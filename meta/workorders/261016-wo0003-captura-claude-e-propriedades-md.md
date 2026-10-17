# WO 0003 — captura bruta do Claude e propriedades no MD do Lunoda

> **Tipo:** mista — CODIGO (popup, `src/adapters/claude/`, `src/popup/`, `lunoda-md.ts`, manifesto) e REGISTRO (DEC-010 e appends).
> **Config sugerida:** modelo mais capaz · `/effort` medio. Codigo pronto e testado; o julgamento e parar no vermelho.
> **Pre-requisito:** HEAD `95df808` (`feat(exporters): exporta entrada do Lunoda em JSON e MD`) em `main`, igual a `origin/main`.
> Antes de aplicar, `git status --short` mostra EXATAMENTE:
> ```
>  M logs/2026-10-16.md
>  M meta/CONTEXT.md
>  M meta/GLOSSARY.md
>  M specs/261016-mvp-exportar-conversa-claude.md
> ?? meta/workorders/261016-wo0003-captura-claude-e-propriedades-md.md
> ```
> Mais alguma coisa: **PARE e reporte**.
> **Base:** conversa de chat de 2026-10-16 (Conversa 7 do log): passo 6 da spec e os pares exportados pelo Lunoda.
> **Arquivos que o chat gravou no disco e esta WO versiona** (Edicao 0 confere):
> - `meta/CONTEXT.md` — `15dd2173671a7970fa00afd55ef99d6846542ee3`
> - `meta/GLOSSARY.md` — `d0e3649bcf6a3649e3625a1e7dfd8ffa9e954292`
> - `specs/261016-mvp-exportar-conversa-claude.md` — `f62c30b1c9543e2647f688b18a315438e99b6060`
> - `logs/2026-10-16.md` — `70fad3106b19418fbaf80501244b34223c134130` (antes da Edicao 10, que acrescenta a sua secao)
> **Arquivos que esta WO SUBSTITUI INTEIROS** (Edicao 0 confere o hash do que esta no disco; diferente = alguem mexeu depois do chat ler: PARE):

> - `wxt.config.ts` — `d4fc87d2e01d86283cd9bdc0d947ceb41d42284a`
> - `src/entrypoints/popup/index.html` — `6d9513cd28c4f32caaae22e3884de5bf8350e408`
> - `src/entrypoints/popup/main.ts` — `31209bee0bfd44911b1269781a69259e82e126fd`
> - `src/exporters/lunoda-md.ts` — `f6dfec7b2fce343de9d5561854ffa7f5aa9c88ca`
> - `src/exporters/lunoda-golden.test.ts` — `6f9880e2c378d2c26d7945b08b590202a6ca9ed9`
> **Ancora semantica:** se um trecho-ancora nao bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar proximo.
> **Idempotencia:** antes de cada insercao, procure a frase-chave do texto NOVO; se ja existir, PULE e diga no relatorio.
> **Ancoras lidas em:** neste turno de chat, no disco em `95df808`: `CLAUDE.md` (linha «- Mudou `src/exporters/`?...»),
> `meta/DECISIONS.md` (ultima linha da DEC-009), `meta/STATUS.md` (Versao Atual, Funcionando, Em Progresso, Backlog, Ultima
> conversa), `meta/CHANGELOG.md` (ultimo item de «Adicionado»), `meta/ROADMAP.md` (item «Adaptador Claude» da F1), `meta/IDEAS.md`
> (entradas «Preencher `p-ia` sozinho» e «Botao de depuracao», secao «Concluidas»). O trecho literal esta no bloco «Ancora».
> **Simulado:** o chat aplicou o codigo desta WO numa copia do repo em `95df808` e rodou `npm run check` (verde:
> `Tests  50 passed | 1 skipped (51)`), o oraculo com os 3 pares de `CDC/oraculo-lunoda/` (`Tests  7 passed (7)`; com o
> `lunoda-md.ts` antigo, o par `sintetico-lunoda-ia` falhava) e conferiu que a funcao injetada, extraida do build MINIFICADO e
> recriada so do proprio texto, faz as duas chamadas e devolve o corpo. As edicoes de doc foram aplicadas a partir do texto DESTA
> WO em copias dos meta/ do disco; as contagens da conferencia sairam dessas copias.
> **Nao testado:** a captura no navegador de verdade (sessao do claude.ai). Isso e do dono, no roteiro do chat — nao e item seu.
> **Proximo comando:** `CDC_LUNODA_ORACLE_DIR=../oraculo-lunoda npx vitest run src/exporters/lunoda-golden.test.ts`

> **Canal dos meta neste ciclo = CODE.** Esta WO E o registro: aplique as Edicoes 4 a 10. CONTEXT, GLOSSARY, spec e a secao do
> chat no log ja estao gravados (Edicao 0 confere) — nao os edite, exceto a Edicao 10 (a SUA secao no fim do log).

---

## 1. Por que

Duas coisas, ambas medidas hoje. (1) O dono importou o `sintetico.json` no Lunoda e exportou de volta: sem edicao, volta byte a
byte; com «IA Utilizada» marcada, o `.md` do Lunoda ganha linhas que o nosso `renderLunodaMd` nao escrevia — o oraculo ficou
vermelho nesse par. (2) Passo 6 da spec: antes de traduzir a resposta do claude.ai para o modelo canonico, capturar respostas
REAIS. O formato dela so e conhecido por relato de terceiro (HISTORY §1); escrever o normalizador agora seria deduzir (DEC-010).

## 2. Contexto factual

- **[medido pelo chat]** `CDC/oraculo-lunoda/` tem 3 pares: `mapsmith 12`, `sintetico-lunoda` (export do Lunoda sem edicao, sha1
  igual ao da fixture) e `sintetico-lunoda-ia` («IA Utilizada = Claude»: `p-ia: ["o4"]` na entrada e so nos blocos «Claude»).
  O chat moveu os pares para essa pasta: a variavel do oraculo deixa de apontar para `..`.
- **[medido]** Com o `lunoda-md.ts` da wo0002: oraculo `1 failed | 6 passed (7)` (o par `-ia`). Com o desta WO: `7 passed (7)`.
  A fixture sintetica nao muda (`47b4e6d0…` / `62ef1c25…`).
- **[medido]** `renderLunodaMd` ganha o parametro `properties` (para traduzir `o4` em «Claude»): a assinatura muda de
  `(entry, timeZone?)` para `(entry, properties, timeZone?)`. Unico chamador no repo: `lunoda-golden.test.ts` (substituido aqui).
- **[medido]** O `lunoda-golden.test.ts` no disco difere do texto da wo0002 numa linha de comentario («PELO Lunoda» x «PELO
  LUNODA»); a versao desta WO adota a do disco.
- **[medido]** Build com as permissoes novas: manifesto com `"permissions":["activeTab","scripting","downloads"]`.

---

## Edicao 0 — conferencia antes de tudo (nao edita nada)

```
git log -1 --oneline
git status --short
sha1sum meta/CONTEXT.md meta/GLOSSARY.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md
sha1sum wxt.config.ts src/entrypoints/popup/index.html src/entrypoints/popup/main.ts src/exporters/lunoda-md.ts src/exporters/lunoda-golden.test.ts
ls ../oraculo-lunoda
```

Esperado: `95df808 feat(exporters): exporta entrada do Lunoda em JSON e MD`; o `status` e os 9 hashes do cabecalho; a pasta do
oraculo com 6 arquivos (3 pares). Divergiu: PARE.

---

## Edicao 1 — substituir 5 arquivos inteiros

**Substituir o arquivo inteiro** por o conteudo abaixo (o hash de antes ja foi conferido na Edicao 0).

### `wxt.config.ts`

```ts
import { defineConfig } from 'wxt';

// Configuracao do WXT. Permissoes minimas (DEC-007, DEC-010): `activeTab` + `scripting` rodam a
// busca dentro da aba do Claude so quando o usuario abre o popup; `downloads` salva os arquivos.
// Nenhuma host_permission permanente.
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Coletor de Contexto',
    description: 'Exporta conversas de IA para JSON (Lunoda) e Markdown.',
    permissions: ['activeTab', 'scripting', 'downloads'],
  },
});
```

### `src/entrypoints/popup/index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coletor de Contexto</title>
    <style>
      body {
        width: 320px;
        margin: 0;
        padding: 12px 14px;
        font:
          13px/1.4 system-ui,
          sans-serif;
      }
      h1 {
        font-size: 14px;
        margin: 0 0 8px;
      }
      #status[data-kind='ok'] {
        color: #1a7f37;
      }
      #status[data-kind='error'] {
        color: #cf222e;
      }
      button {
        width: 100%;
        padding: 6px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Coletor de Contexto</h1>
    <p id="status">Verificando a aba…</p>
    <button id="raw" type="button" hidden>Salvar resposta bruta (depuração)</button>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### `src/entrypoints/popup/main.ts`

```ts
// Popup da extensao. Nesta fase (F1, passo 6) so reconhece a conversa do Claude e oferece o botao de
// depuracao que salva a resposta bruta — material para escrever o adaptador sobre o formato REAL.
// O botao «Exportar» entra quando o adaptador existir (passos 7 e 8 da spec).
import { browser } from 'wxt/browser';
import { fetchClaudeConversationRaw } from '../../adapters/claude/fetch-raw';
import { parseClaudeConversationUrl } from '../../adapters/claude/url';
import { rawDumpFilename, summarizeRaw } from '../../popup/raw-dump';

const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;
const rawButton = document.querySelector<HTMLButtonElement>('#raw')!;

function say(text: string, kind: 'info' | 'ok' | 'error' = 'info'): void {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

async function main(): Promise<void> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const conversationId = parseClaudeConversationUrl(tab?.url);
  if (!tab?.id || !conversationId) {
    say('Abra uma conversa do Claude (claude.ai/chat/…) e clique no ícone de novo.');
    return;
  }
  const tabId = tab.id;
  say(`Conversa ${conversationId.slice(0, 8)}… encontrada.`);
  rawButton.hidden = false;

  rawButton.addEventListener('click', async () => {
    rawButton.disabled = true;
    say('Buscando a conversa…');
    try {
      const [injection] = await browser.scripting.executeScript({
        target: { tabId },
        func: fetchClaudeConversationRaw,
        args: [conversationId],
      });
      const result = injection?.result;
      if (!result || !result.ok) {
        say(result ? result.error : 'O script na página não devolveu resultado.', 'error');
        return;
      }
      const summary = summarizeRaw(result.text);
      if (!summary.ok) {
        say(summary.error, 'error');
        return;
      }
      const filename = rawDumpFilename(conversationId, new Date());
      const url = URL.createObjectURL(new Blob([result.text], { type: 'application/json' }));
      await browser.downloads.download({ url, filename, saveAs: false });
      // O download ja comecou; liberar a URL logo depois evita segurar o texto na memoria.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      say(`Salvo em Downloads/${filename} (${summary.kb} KB, ${summary.topKeys} chaves).`, 'ok');
    } catch (err) {
      say(`Erro: ${String(err)}`, 'error');
    } finally {
      rawButton.disabled = false;
    }
  });
}

void main();
```

### `src/exporters/lunoda-md.ts`

```ts
/**
 * Escrita do `.md` no layout do export do Lunoda, reproduzido byte a byte dos pares do oraculo
 * (`mapsmith 12`, `sintetico-lunoda`, `sintetico-lunoda-ia` — DEC-009).
 *
 * Detalhes que o teste de ouro protege: LF; dois espacos no fim das linhas de metadado (quebra de
 * linha em Markdown); separador de 40 × U+2501 depois do cabecalho e de cada bloco; front matter em
 * ISO UTC e corpo em hora local `dd/mm/aa HH:MM`; conteudo do bloco copiado sem nenhuma alteracao;
 * propriedade marcada (medido so com UMA propriedade e UM valor: «IA Utilizada = Claude») aparece no
 * front matter, no cabecalho e em cada bloco que a tem no `blockProps`.
 * Nao verificado (o oraculo nao tem): titulo com aspas, descricao preenchida, duas propriedades ou
 * dois valores marcados ao mesmo tempo, nome de propriedade com acento (chave do front matter).
 */

import { formatLunodaLocal } from '../core/dates';
import type { LunodaBlock, LunodaEntry, LunodaProperty } from './lunoda-types';

/** Separador do Lunoda: 40 × «━» (U+2501). */
export const LUNODA_SEPARATOR = '━'.repeat(40);

/** Uma propriedade marcada, ja traduzida de ids para nomes. */
interface MarkedProperty {
  name: string;
  values: string[];
}

/**
 * Traduz `{ "p-ia": ["o4"] }` em `[{ name: "IA Utilizada", values: ["Claude"] }]`, na ordem das
 * propriedades do documento. Propriedade sem valor marcado fica de fora; id sem cadastro aparece cru.
 */
function markedProperties(
  values: Record<string, unknown>,
  properties: LunodaProperty[],
): MarkedProperty[] {
  const marked: MarkedProperty[] = [];
  for (const prop of properties) {
    const ids = values[prop.id];
    if (!Array.isArray(ids) || ids.length === 0) continue;
    marked.push({
      name: prop.name,
      values: ids.map((id) => prop.options.find((o) => o.id === id)?.name ?? String(id)),
    });
  }
  return marked;
}

/** Chave do front matter: «IA Utilizada» -> «ia_utilizada» (medido). */
function frontMatterKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_');
}

/** Linhas `**Nome:** valor  ` seguidas de uma linha em branco; nada quando nao ha propriedade. */
function propertyLines(marked: MarkedProperty[]): string[] {
  if (marked.length === 0) return [];
  return [...marked.map((p) => `**${p.name}:** ${p.values.join(', ')}  `), ''];
}

function blockSection(block: LunodaBlock, n: number, properties: LunodaProperty[]): string {
  return [
    `## [Bloco ${n}] ${block.subtitle} · v${block.version}`,
    '',
    `<!-- BLOCO ${n} -->`,
    `**Subtítulo:** ${block.subtitle}  `,
    `**Versão:** v${block.version}  `,
    '',
    ...propertyLines(markedProperties(block.blockProps, properties)),
    '**Conteúdo:**',
    '',
    `<!-- CONTEUDO:INICIO bloco=${n} -->`,
    block.content,
    `<!-- CONTEUDO:FIM bloco=${n} -->`,
    '',
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
}

/**
 * Gera o `.md` de uma entrada.
 * @param entry entrada do Lunoda.
 * @param properties propriedades do documento (para traduzir ids marcados em nomes).
 * @param timeZone fuso IANA das datas do corpo; omitido = fuso do ambiente (o do usuario).
 */
export function renderLunodaMd(
  entry: LunodaEntry,
  properties: LunodaProperty[],
  timeZone?: string,
): string {
  const marked = markedProperties(entry.propertyValues, properties);
  const header = [
    '---',
    `title: ${JSON.stringify(entry.title)}`,
    `id: ${JSON.stringify(entry.id)}`,
    `created: ${JSON.stringify(entry.createdAt)}`,
    `updated: ${JSON.stringify(entry.updatedAt)}`,
    `blocks: ${entry.blocks.length}`,
    ...marked.flatMap((p) => [
      `${frontMatterKey(p.name)}:`,
      ...p.values.map((v) => `  - ${JSON.stringify(v)}`),
    ]),
    '---',
    `# ${entry.title}`,
    '',
    '<!-- ENTRADA -->',
    `**ID:** \`${entry.id}\`  `,
    `**Criado em:** ${formatLunodaLocal(entry.createdAt, timeZone)}  `,
    `**Modificado em:** ${formatLunodaLocal(entry.updatedAt, timeZone)}  `,
    `**Total de blocos:** ${entry.blocks.length}  `,
    '',
    ...propertyLines(marked),
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
  return header + entry.blocks.map((b, i) => blockSection(b, i + 1, properties)).join('');
}
```

### `src/exporters/lunoda-golden.test.ts`

```ts
/**
 * Testes de ouro dos exportadores do Lunoda.
 *
 * 1. Par SINTETICO versionado (`src/tests/fixtures/lunoda/`): regressao byte a byte. Ele foi gravado
 *    pelo proprio codigo (toMatchFileSnapshot), entao prova estabilidade, nao fidelidade ao Lunoda.
 * 2. Oraculo PRIVADO, fora do repositorio: pares `<nome>.json` + `<nome>.md` exportados PELO Lunoda,
 *    numa pasta apontada por CDC_LUNODA_ORACLE_DIR. E ele que prova fidelidade. Sem a variavel, o
 *    bloco e pulado (e o resumo do Vitest mostra «skipped»).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_CONVERSATION,
  SYNTHETIC_NOW,
  syntheticIds,
} from '../tests/synthetic-conversation';
import { buildLunodaDocument, buildLunodaEntry } from './lunoda-build';
import { parseLunodaJson, renderLunodaJson } from './lunoda-json';
import { renderLunodaMd } from './lunoda-md';

const FIXTURE_DIR = '../tests/fixtures/lunoda';

describe('par sintetico versionado', () => {
  const entry = buildLunodaEntry(
    SYNTHETIC_CONVERSATION,
    { includeThinking: true, includeFiles: true },
    { newId: syntheticIds(), now: SYNTHETIC_NOW },
  );
  const doc0 = buildLunodaDocument([entry]);
  const json = renderLunodaJson(doc0);
  const md = renderLunodaMd(entry, doc0.properties, 'America/Sao_Paulo');

  it('json bate com a fixture', async () => {
    await expect(json).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.json`);
  });

  it('md bate com a fixture', async () => {
    await expect(md).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.md`);
  });

  it('json lido de volta reproduz o mesmo json e o mesmo md', () => {
    const doc = parseLunodaJson(json);
    expect(renderLunodaJson(doc)).toBe(json);
    expect(renderLunodaMd(doc.entries[0]!, doc.properties, 'America/Sao_Paulo')).toBe(md);
  });
});

const oracleDir = process.env.CDC_LUNODA_ORACLE_DIR;
const oraclePairs =
  oracleDir && existsSync(oracleDir)
    ? readdirSync(oracleDir)
        .filter(
          (f) => f.endsWith('.json') && existsSync(join(oracleDir, f.replace(/\.json$/, '.md'))),
        )
        .map((f) => f.replace(/\.json$/, ''))
    : [];

describe.skipIf(!oracleDir)('oraculo privado do Lunoda (CDC_LUNODA_ORACLE_DIR)', () => {
  it('a pasta tem ao menos um par .json + .md', () => {
    expect(oraclePairs.length).toBeGreaterThan(0);
  });

  it.each(oraclePairs)('%s: json e md reproduzidos byte a byte', (name) => {
    const json = readFileSync(join(oracleDir!, `${name}.json`), 'utf8');
    const md = readFileSync(join(oracleDir!, `${name}.md`), 'utf8');
    const doc = parseLunodaJson(json);
    expect(renderLunodaJson(doc)).toBe(json);
    expect(renderLunodaMd(doc.entries[0]!, doc.properties, 'America/Sao_Paulo')).toBe(md);
  });
});
```

---

## Edicao 2 — criar 6 arquivos novos

**Criar arquivo novo** em cada caminho. Se algum ja existir: PARE e reporte.

### `src/adapters/claude/url.ts`

```ts
/**
 * Reconhece a URL de uma conversa do claude.ai (`https://claude.ai/chat/<uuid>`).
 */

const CONVERSATION_URL =
  /^https:\/\/claude\.ai\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[/?#]|$)/i;

/**
 * Devolve o uuid da conversa (em minusculas) ou `null` se a URL nao for de uma conversa do Claude.
 * @param url URL da aba ativa; `undefined` quando o navegador nao a expoe.
 */
export function parseClaudeConversationUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = CONVERSATION_URL.exec(url);
  return match?.[1] ? match[1].toLowerCase() : null;
}
```

### `src/adapters/claude/url.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { parseClaudeConversationUrl } from './url';

const ID = 'd41adc75-87c7-4a84-87ee-0b95f7ed0a5c';

describe('parseClaudeConversationUrl', () => {
  it.each([
    [`https://claude.ai/chat/${ID}`, ID],
    [`https://claude.ai/chat/${ID}?foo=1`, ID],
    [`https://claude.ai/chat/${ID}#x`, ID],
    [`https://claude.ai/chat/${ID.toUpperCase()}`, ID],
  ])('%s -> uuid', (url, id) => {
    expect(parseClaudeConversationUrl(url)).toBe(id);
  });

  it.each([
    'https://claude.ai/new',
    'https://claude.ai/project/abc',
    `https://claude.ai/chat/${ID}extra`,
    `http://claude.ai/chat/${ID}`,
    `https://evil.example/claude.ai/chat/${ID}`,
    'chrome://extensions',
    '',
  ])('%s -> null', (url) => {
    expect(parseClaudeConversationUrl(url)).toBeNull();
  });

  it('aba sem URL legivel -> null', () => {
    expect(parseClaudeConversationUrl(undefined)).toBeNull();
  });
});
```

### `src/adapters/claude/fetch-raw.ts`

```ts
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
```

### `src/adapters/claude/fetch-raw.test.ts`

```ts
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
```

### `src/popup/raw-dump.ts`

```ts
/**
 * Partes puras do botao de depuracao «Salvar resposta bruta» (passo 6 da spec, DEC-010).
 */

/** Subpasta dentro de Downloads onde as capturas brutas caem. */
export const RAW_DUMP_DIR = 'cdc-raw';

/**
 * Nome do arquivo da captura: `cdc-raw/claude-<uuid>-<AAAAMMDDTHHMMSSZ>.json` (hora em UTC, para
 * nunca colidir nem depender do fuso).
 */
export function rawDumpFilename(conversationId: string, now: Date): string {
  const stamp = now
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[-:]/g, '');
  return `${RAW_DUMP_DIR}/claude-${conversationId}-${stamp}.json`;
}

/** Resumo do texto capturado, para o popup dizer o que salvou. */
export type RawSummary = { ok: true; kb: string; topKeys: number } | { ok: false; error: string };

/**
 * Confere que a resposta e JSON de objeto e resume o tamanho. Nao interpreta o formato da conversa.
 * @param text corpo da resposta, como veio.
 */
export function summarizeRaw(text: string): RawSummary {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: 'A resposta não é JSON (sessão expirada ou página de verificação do site?).',
    };
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'A resposta é JSON, mas não é um objeto de conversa.' };
  }
  const kb = (new TextEncoder().encode(text).length / 1024).toFixed(1).replace('.', ',');
  return { ok: true, kb, topKeys: Object.keys(parsed).length };
}
```

### `src/popup/raw-dump.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { rawDumpFilename, summarizeRaw } from './raw-dump';

describe('rawDumpFilename', () => {
  it('poe a captura em cdc-raw/ com uuid e carimbo UTC', () => {
    expect(
      rawDumpFilename('d41adc75-87c7-4a84-87ee-0b95f7ed0a5c', new Date('2026-10-17T01:23:25.562Z')),
    ).toBe('cdc-raw/claude-d41adc75-87c7-4a84-87ee-0b95f7ed0a5c-20261017T012325Z.json');
  });
});

describe('summarizeRaw', () => {
  it('resume objeto JSON em KB (bytes UTF-8) e numero de chaves', () => {
    const text = JSON.stringify({ a: 'é'.repeat(1024), b: 1 });
    expect(summarizeRaw(text)).toEqual({ ok: true, kb: '2,0', topKeys: 2 });
  });

  it('recusa HTML (sessao expirada, pagina de verificacao)', () => {
    expect(summarizeRaw('<!doctype html><html>')).toMatchObject({ ok: false });
  });

  it('recusa JSON que nao e objeto', () => {
    expect(summarizeRaw('[1,2]')).toMatchObject({ ok: false });
  });
});
```

---

## Edicao 3 — validar

```
npm run check
sha1sum src/tests/fixtures/lunoda/sintetico.json src/tests/fixtures/lunoda/sintetico.md
grep -o '"permissions":\[[^]]*\]' .output/chrome-mv3/manifest.json
CDC_LUNODA_ORACLE_DIR=../oraculo-lunoda npx vitest run src/exporters/lunoda-golden.test.ts
```

- `npm run check` -> codigo 0, `Tests  50 passed | 1 skipped (51)`, `All matched files use Prettier code style!`, build verde.
  Nao precisa de `npm install` (nenhuma dependencia nova).
- Fixtures: os mesmos hashes de antes (`47b4e6d03f7ea8e76ac82be44c95cd18e12ea830`, `62ef1c25d89909ab16811b98d85248284c13203a`).
  Se o Vitest disser que GRAVOU snapshot, algo mudou a saida: PARE.
- Manifesto: `"permissions":["activeTab","scripting","downloads"]`.
- Oraculo: `Tests  7 passed (7)` (1 da pasta + 3 pares x 1 + os 3 do par sintetico).
- Vermelho: **PARE e reporte com a saida crua**. Nao «conserte» o codigo da WO para passar.

---

## Edicao 4 — `CLAUDE.md` · nova pasta do oraculo

**Ancora** (secao «Build / validação»):

```
- Mudou `src/exporters/`? Rode também o oráculo privado do Lunoda (DEC-009): `CDC_LUNODA_ORACLE_DIR=.. npx vitest run src/exporters/lunoda-golden.test.ts` — pares exportados pelo Lunoda na pasta-pai, fora do repo. O `npm test` comum pula esse bloco.
```

**Substituir por:**

```
- Mudou `src/exporters/`? Rode também o oráculo privado do Lunoda (DEC-009): `CDC_LUNODA_ORACLE_DIR=../oraculo-lunoda npx vitest run src/exporters/lunoda-golden.test.ts` — pares exportados pelo Lunoda em `CDC/oraculo-lunoda/`, fora do repo. O `npm test` comum pula esse bloco.
- `src/adapters/claude/fetch-raw.ts` é injetado na aba do claude.ai: nada de import ou constante de fora dentro de `fetchClaudeConversationRaw` (armadilha 14 do CONTEXT).
```

---

## Edicao 5 — `meta/DECISIONS.md` · nova DEC-010 no fim

**Ancora** (ultima linha da DEC-009, ultima linha do arquivo):

```
O `npm test` comum não prova fidelidade; quem mexe em `src/exporters/` roda também o oráculo (comando no `CLAUDE.md`). Medido em 2026-10-16: `mapsmith 12.json` e `.md` reproduzidos byte a byte.
```

**Substituir por** (a ancora repetida + a entrada nova):

```
O `npm test` comum não prova fidelidade; quem mexe em `src/exporters/` roda também o oráculo (comando no `CLAUDE.md`). Medido em 2026-10-16: `mapsmith 12.json` e `.md` reproduzidos byte a byte.

---

## DEC-010 — Claude: busca injetada na aba e captura bruta antes do normalizador
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
O normalizador do Claude (passo 7 da spec) depende do formato da resposta de `chat_conversations`, que o projeto só conhece por relato de terceiro (HISTORY §1). Escrevê-lo em cima disso seria deduzir um formato não lido, e o erro apareceria em silêncio: arquivo exportado faltando partes.

### Decisão
- A busca roda DENTRO da aba do claude.ai: o popup injeta `fetchClaudeConversationRaw` com `chrome.scripting.executeScript` — mesma origem e mesma sessão da página. Permissões: `activeTab`, `scripting`, `downloads`; nenhuma host_permission permanente.
- Primeiro, a captura bruta (passo 6): o botão «Salvar resposta bruta (depuração)» baixa o corpo exato da API para `Downloads/cdc-raw/`; o dono move para `CDC/capturas-claude/`, fora do repo. O normalizador é escrito sobre capturas reais, e as fixtures versionadas do Claude serão sintéticas no MESMO formato (DEC-009).
- O botão fica visível em todo build durante a F1: o único usuário é o dono, e o build de desenvolvimento só funciona com o dev server rodando. Sai antes de qualquer publicação.
- O oráculo do Lunoda mudou para `CDC/oraculo-lunoda/` (a DEC-009 citava a pasta-pai).

### Alternativas consideradas
- **Fetch feito pelo próprio popup, com host_permission do claude.ai** — mais permissão permanente, e a origem da extensão pode ser tratada pelo site como terceira (cookies, verificação anti-robô).
- **Content script fixo no claude.ai** — rodaria em toda página do site sem o usuário pedir.
- **Normalizador já, pela memória do formato** — exatamente a dedução que o método proíbe.

### Consequências
A função injetada tem de ser autocontida (armadilha 14 do CONTEXT; um teste a recria só do próprio texto). Há um ciclo a mais — capturas do dono — antes do botão «Exportar».
```

---

## Edicao 6 — `meta/STATUS.md` (cinco trechos)

### 6a — Versao Atual

**Ancora:**

```
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos e testados; ainda não lê conversa do Claude (sem adaptador nem botão).
```

**Substituir por:**

```
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos; a extensão já busca a conversa do Claude e salva a resposta bruta, mas ainda não a traduz para o Lunoda.
```

### 6b — Funcionando

**Ancora:**

```
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.
```

**Substituir por:**

```
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.
- O Lunoda importou o `sintetico.json` (bloco «Pensamento» e listas de arquivos aceitos) e o devolveu byte a byte; o MD reproduz também a propriedade marcada (wo0003). Oráculo: 3 pares em `CDC/oraculo-lunoda/`.
```

### 6c — Em Progresso

**Ancora:**

```
- **F1 — MVP:** passos 1 a 5 da spec prontos (wo0001, wo0002). Próximo: botão de depuração «salvar resposta bruta» e adaptador Claude (passos 6 e 7).
```

**Substituir por:**

```
- **F1 — MVP:** passos 1 a 6 da spec escritos (wo0001 a wo0003); a captura bruta ainda não foi usada no navegador. Próximo: capturas reais → normalizador do Claude (passo 7).
```

### 6d — Backlog (as duas linhas, inteiras)

**Ancora:**

```
- [ ] Dono: importar `src/tests/fixtures/lunoda/sintetico.json` no Lunoda e exportar de volta (roteiro na conversa de 2026-10-16) — confirma se o Lunoda aceita o bloco «Pensamento» e as listas de arquivos, e mostra como ele grava `p-ia` preenchido.
- [ ] F1: botão «salvar resposta bruta» + adaptador Claude (passos 6 e 7 da spec) — próxima WO do chat.
```

**Substituir por:**

```
- [ ] Dono: capturar 2 ou 3 conversas reais com o botão de depuração e movê-las para `CDC/capturas-claude/` — uma com pensamento, uma com anexo, uma com pedido editado (roteiro na conversa de 2026-10-16).
- [ ] Dono: dizer se «IA Utilizada» ficou só nos blocos «Claude» por herança do Lunoda ou porque foi marcada bloco a bloco — decide como o exportador preenche `p-ia` (IDEAS).
- [ ] F1: normalizador do Claude sobre as capturas (passo 7 da spec) — próxima WO do chat.
```

### 6e — Ultima conversa

**Ancora** (o paragrafo inteiro, uma linha so):

```
**2026-10-16** — Popup conferido no Chrome. Repositório público → DEC-009: fixture sintética versionada e oráculo do Lunoda fora do repo. wo0002 entregou os exportadores Lunoda JSON e MD, que reproduzem o `mapsmith 12` byte a byte. Próximo: o dono testa o `sintetico.json` no Lunoda; o chat escreve a WO do adaptador Claude.
```

**Substituir por:**

```
**2026-10-16** — O Lunoda aceitou o `sintetico.json` e o devolveu byte a byte; com «IA Utilizada» marcada, mostrou o formato das propriedades, que o MD agora reproduz (oráculo com 3 pares). wo0003: busca da conversa do Claude e captura bruta (DEC-010). Próximo: o dono captura conversas reais; o chat escreve o normalizador sobre elas.
```

---

## Edicao 7 — `meta/CHANGELOG.md` · itens em «Nao lancado»

**Ancora** (ultimo item de «Adicionado»):

```
- Par sintético versionado (`src/tests/fixtures/lunoda/`) e oráculo privado por `CDC_LUNODA_ORACLE_DIR` (DEC-009); `@types/node` 22.20.5; 27 testes.
```

**Substituir por:**

```
- Par sintético versionado (`src/tests/fixtures/lunoda/`) e oráculo privado por `CDC_LUNODA_ORACLE_DIR` (DEC-009); `@types/node` 22.20.5; 27 testes.
- MD do Lunoda com propriedades marcadas (front matter, cabeçalho e blocos), medido no par `sintetico-lunoda-ia` (wo0003).
- Captura bruta do Claude (wo0003, DEC-010): popup reconhece `claude.ai/chat/<uuid>`, injeta a busca na aba e baixa o corpo exato para `Downloads/cdc-raw/`; permissões `activeTab`, `scripting`, `downloads`; 50 testes.
```

---

## Edicao 8 — `meta/ROADMAP.md` · item novo na F1

**Ancora:**

```
- [ ] Adaptador Claude via API interna, só o ramo atual.
```

**Substituir por:**

```
- [x] Captura bruta da conversa do Claude, para medir o formato real (wo0003).
- [ ] Adaptador Claude via API interna, só o ramo atual.
```

---

## Edicao 9 — `meta/IDEAS.md` (tres trechos)

### 9a — «Preencher `p-ia` sozinho»

**Ancora:**

```
Marcar a propriedade «IA Utilizada» com a opção da plataforma de origem (`o4` Claude, `o5` Gemini, `o6` ChatGPT). No `mapsmith 12` ela veio vazia; depende do teste no Lunoda (STATUS).
```

**Substituir por:**

```
Marcar a propriedade «IA Utilizada» com a opção da plataforma de origem (`o4` Claude, `o5` Gemini, `o6` ChatGPT). Formato medido no par `sintetico-lunoda-ia` (CONTEXT, «Formato Lunoda»): `p-ia` na entrada e só nos blocos da IA. Falta o dono dizer se a marcação nos blocos foi herança do Lunoda ou manual (STATUS).
```

### 9b — remover «Botao de depuracao» das Ativas

**Remover o bloco inteiro** — as duas linhas abaixo **mais a linha em branco logo depois delas**:

```
### 2026-10-16 — Botão de depuração «salvar resposta bruta»
No build de desenvolvimento, um botão que baixa o JSON cru da API. É o jeito mais barato de gerar fixtures reais e de diagnosticar quando a plataforma muda o formato.
```

### 9c — e registra-la em «Concluidas» (a outra metade da mesma operacao)

**Ancora:**

```
- (nenhuma ainda)
```

**Substituir por:**

```
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1.
```

---

## Edicao 10 — `logs/2026-10-16.md` · a SUA secao, no fim

Acrescente no FIM do arquivo (depois de `## Conversa 7 — chat — ...`, sem tocar nela) a secao
`## Conversa 8 — Code — aplicacao da wo0003`, no formato de `meta/LOG-TEMPLATE.md`, com o que aconteceu DE FATO.

---

## Fora de escopo

- Normalizar a resposta do Claude para `Conversation`, botao «Exportar», escolher o arquivo de saida: proximas WOs, depois das capturas.
- Preencher `p-ia` no exportador: espera a resposta do dono (STATUS).
- Esconder o botao de depuracao: so antes de publicar (DEC-010).
- Copiar qualquer captura ou par do oraculo para dentro do repo (DEC-009).

## Armadilhas desta WO

- **Funcao injetada:** ao copiar `fetch-raw.ts`, nada de «melhorar» extraindo constantes ou helpers para fora de
  `fetchClaudeConversationRaw` — o teste «funciona reconstruida so a partir do proprio texto» reprova, e no navegador seria
  `ReferenceError` (armadilha 14).
- **Ancoras de uma linha longa** (4, 5, 6a-6e, 9a): substitua a linha inteira.
- **9b e 9c sao as duas metades de um MOVER:** faca as duas, ou nenhuma.

---

## Depois de aplicar — conferencia antes do commit

- [ ] `git status --short` mostra exatamente: ` M` `CLAUDE.md`, `logs/2026-10-16.md`, `meta/CHANGELOG.md`, `meta/CONTEXT.md`,
      `meta/DECISIONS.md`, `meta/GLOSSARY.md`, `meta/IDEAS.md`, `meta/ROADMAP.md`, `meta/STATUS.md`,
      `specs/261016-mvp-exportar-conversa-claude.md`, `src/entrypoints/popup/index.html`, `src/entrypoints/popup/main.ts`,
      `src/exporters/lunoda-golden.test.ts`, `src/exporters/lunoda-md.ts`, `wxt.config.ts`; `??` `src/adapters/`, `src/popup/` e
      esta WO. Diferente: PARE.
- [ ] `find src -type f | wc -l` -> **23** (17 + 6).
- [ ] `grep -c "^## DEC-" meta/DECISIONS.md` -> **10**; `grep -c "^## DEC-010" meta/DECISIONS.md` -> **1**.
- [ ] `grep -c "^- \[ \]" meta/STATUS.md` -> **3**.
- [ ] `grep -c "^- \[x\]" meta/ROADMAP.md` -> **7**.
- [ ] `grep -c "^### 2026" meta/IDEAS.md` -> **12** (13 de antes - 1 movida); `grep -c "nenhuma ainda" meta/IDEAS.md` -> **0**.
- [ ] `grep -c "^## Conversa" logs/2026-10-16.md` -> **8**.
- [ ] `git ls-files --eol` depois do `git add` -> nenhuma linha com `i/crlf`.

## Relatorio de aplicacao *(quem aplica preenche ao terminar)*

O que foi feito, edicao por edicao · a SAIDA CRUA das conferencias (numero + comando) · o que fugiu do texto literal — **inclusive
comentario e formatacao**, por menor que seja (a wo0002 trocou «PELO LUNODA» por «PELO Lunoda» e o relatorio disse «nenhum») ·
arquivos tocados · `npm run check` · oraculo · commit e push. Escreva-o DEPOIS de resolver o push.

## Commit — blocos separados, mensagem SEM acento

```
git add CLAUDE.md wxt.config.ts src meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/STATUS.md meta/CHANGELOG.md meta/ROADMAP.md meta/IDEAS.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md meta/workorders/261016-wo0003-captura-claude-e-propriedades-md.md
```

```
git commit -m "feat(adapter-claude): captura bruta da conversa e propriedades no MD" -m "Popup reconhece a conversa do claude.ai, injeta a busca na aba (activeTab + scripting) e baixa a resposta bruta para cdc-raw/ (DEC-010). renderLunodaMd escreve propriedades marcadas como o Lunoda (oraculo com 3 pares). 50 testes."
```

```
git push
```
