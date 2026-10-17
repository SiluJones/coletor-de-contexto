/**
 * Busca a resposta BRUTA de uma conversa do claude.ai (DEC-002, DEC-010).
 *
 * ATENCAO: `fetchClaudeConversationRaw` roda DENTRO da pagina do claude.ai, injetada por
 * `chrome.scripting.executeScript({ func })`. O navegador serializa a funcao como texto: ela NAO pode
 * usar nada de fora do proprio corpo (imports, constantes do modulo, outras funcoes). Tudo o que ela
 * precisa esta declarado dentro dela. Os tipos abaixo somem na compilacao e por isso podem ficar fora.
 *
 * Endpoints (nao oficiais; HISTORY §1): `GET /api/organizations` e
 * `GET /api/organizations/{org}/chat_conversations/{id}?tree=True&rendering_mode=messages&render_all_tools=true`.
 * O formato da resposta da conversa NAO e interpretado aqui: o texto volta como veio, para virar
 * captura e, depois, fixture.
 */

/** Resultado da busca: sempre um objeto, nunca excecao (excecao na pagina chega mal ao popup). */
export type RawFetchResult =
  { ok: true; orgId: string; endpoint: string; text: string } | { ok: false; error: string };

/**
 * Busca a conversa com a sessao do usuario e devolve o corpo como texto, sem interpretar.
 * @param conversationId uuid da conversa (de `parseClaudeConversationUrl`).
 */
export async function fetchClaudeConversationRaw(conversationId: string): Promise<RawFetchResult> {
  // Le o comeco de uma resposta de erro para o diagnostico (pagina de login, desafio, etc.).
  const head = async (res: Response): Promise<string> => (await res.text()).slice(0, 200);
  try {
    const orgsRes = await fetch('/api/organizations', { credentials: 'include' });
    if (!orgsRes.ok) {
      return {
        ok: false,
        error: `GET /api/organizations respondeu ${orgsRes.status}: ${await head(orgsRes)}`,
      };
    }
    const orgs: unknown = await orgsRes.json();
    if (!Array.isArray(orgs)) {
      return { ok: false, error: 'Formato de /api/organizations mudou: esperava uma lista.' };
    }
    // A organizacao de chat e a que tem a capacidade "chat"; o id vem em `uuid` (ou `id`, por garantia).
    const chatOrg = orgs.find(
      (o: unknown) =>
        typeof o === 'object' &&
        o !== null &&
        Array.isArray((o as { capabilities?: unknown }).capabilities) &&
        (o as { capabilities: unknown[] }).capabilities.includes('chat'),
    ) as { uuid?: unknown; id?: unknown } | undefined;
    const orgId =
      typeof chatOrg?.uuid === 'string'
        ? chatOrg.uuid
        : typeof chatOrg?.id === 'string'
          ? chatOrg.id
          : null;
    if (!orgId) {
      const keys = orgs[0] && typeof orgs[0] === 'object' ? Object.keys(orgs[0]).join(', ') : '-';
      return {
        ok: false,
        error: `Nenhuma organizacao com capacidade "chat" e id legivel (${orgs.length} organizacoes; chaves da primeira: ${keys}).`,
      };
    }
    const endpoint =
      `/api/organizations/${orgId}/chat_conversations/${conversationId}` +
      '?tree=True&rendering_mode=messages&render_all_tools=true';
    const convRes = await fetch(endpoint, { credentials: 'include' });
    if (!convRes.ok) {
      return {
        ok: false,
        error: `GET da conversa respondeu ${convRes.status}: ${await head(convRes)}`,
      };
    }
    return { ok: true, orgId, endpoint, text: await convRes.text() };
  } catch (err) {
    return { ok: false, error: `Falha de rede ou de script: ${String(err)}` };
  }
}
