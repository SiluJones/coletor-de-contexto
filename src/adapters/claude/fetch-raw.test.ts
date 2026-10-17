import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchClaudeConversationRaw, type RawFetchResult } from './fetch-raw';

const CONV = '0f1e2d3c-4b5a-4968-8776-655443322110';
const ORG = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

/** Resposta minima no formato que `fetch` devolve. */
function reply(status: number, body: string): Response {
  return new Response(body, { status });
}

/** Instala um fetch falso que responde por caminho e guarda as chamadas. */
function stubFetch(routes: Record<string, () => Response>): ReturnType<typeof vi.fn> {
  const spy = vi.fn(async (input: string, init?: RequestInit) => {
    // Toda chamada tem de levar a sessao do usuario.
    expect(init?.credentials).toBe('include');
    const path = input.split('?')[0]!;
    const route = routes[path];
    return route ? route() : reply(404, 'nao mapeado no teste');
  });
  vi.stubGlobal('fetch', spy);
  return spy;
}

const orgsOk = () =>
  reply(
    200,
    JSON.stringify([
      { uuid: 'org-api', capabilities: ['api'] },
      { uuid: ORG, capabilities: ['chat', 'claude_pro'] },
    ]),
  );

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchClaudeConversationRaw', () => {
  it('escolhe a organizacao com "chat" e pede a conversa com os parametros que trazem tudo', async () => {
    const body = '{"uuid":"x","qualquer":"coisa"}';
    const spy = stubFetch({
      '/api/organizations': orgsOk,
      [`/api/organizations/${ORG}/chat_conversations/${CONV}`]: () => reply(200, body),
    });
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result).toEqual({
      ok: true,
      orgId: ORG,
      endpoint: `/api/organizations/${ORG}/chat_conversations/${CONV}?tree=True&rendering_mode=messages&render_all_tools=true`,
      text: body,
    });
    // Usa a sessao do usuario nas duas chamadas.
    expect(spy.mock.calls.map((c) => c[1]?.credentials)).toEqual(['include', 'include']);
  });

  it('devolve o texto como veio, sem reformatar', async () => {
    const body = '{\n  "a": 1,\n  "b": "olá"\n}';
    stubFetch({
      '/api/organizations': orgsOk,
      [`/api/organizations/${ORG}/chat_conversations/${CONV}`]: () => reply(200, body),
    });
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result.ok && result.text).toBe(body);
  });

  it('erro de status vira mensagem com o codigo e o comeco do corpo', async () => {
    stubFetch({ '/api/organizations': () => reply(403, '<html>verifique que voce e humano') });
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result).toEqual({
      ok: false,
      error: 'GET /api/organizations respondeu 403: <html>verifique que voce e humano',
    });
  });

  it('sem organizacao de chat, diz quantas achou e quais chaves elas tem', async () => {
    stubFetch({
      '/api/organizations': () =>
        reply(200, JSON.stringify([{ name: 'x', capabilities: ['api'] }])),
    });
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toContain(
      '1 organizacoes; chaves da primeira: name, capabilities',
    );
  });

  it('conversa inexistente vira erro com o status', async () => {
    stubFetch({
      '/api/organizations': orgsOk,
      [`/api/organizations/${ORG}/chat_conversations/${CONV}`]: () => reply(404, 'not found'),
    });
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result).toEqual({ ok: false, error: 'GET da conversa respondeu 404: not found' });
  });

  it('excecao de rede vira resultado, nunca excecao', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))),
    );
    const result = await fetchClaudeConversationRaw(CONV);
    expect(result).toEqual({
      ok: false,
      error: 'Falha de rede ou de script: TypeError: Failed to fetch',
    });
  });

  it('funciona reconstruida so a partir do proprio texto (como o executeScript a injeta)', async () => {
    // O Chrome serializa a funcao e a recria na pagina: qualquer referencia a algo de fora quebra la.
    const rebuilt = new Function(`return (${fetchClaudeConversationRaw.toString()});`)() as (
      id: string,
    ) => Promise<RawFetchResult>;
    stubFetch({
      '/api/organizations': orgsOk,
      [`/api/organizations/${ORG}/chat_conversations/${CONV}`]: () => reply(200, '{}'),
    });
    expect(await rebuilt(CONV)).toMatchObject({ ok: true, orgId: ORG, text: '{}' });
  });
});
