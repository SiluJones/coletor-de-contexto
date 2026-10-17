# WO 0004 — normalizador do Claude e botao «Exportar para o Lunoda»

> **Tipo:** mista — CODIGO (normalizador, exportacao, popup, nome de arquivo) e REGISTRO (DEC-011 e appends).
> **Config sugerida:** modelo mais capaz · `/effort` medio. Codigo pronto e testado; o julgamento e parar no vermelho.
> **Pre-requisito:** HEAD `79ffab2` (`feat(adapter-claude): captura bruta da conversa e propriedades no MD`) em `main`, igual a
> `origin/main`. Antes de aplicar, `git status --short` mostra EXATAMENTE:
> ```
>  M logs/2026-10-16.md
>  M meta/CEREBRO.md
>  M meta/CONTEXT.md
>  M meta/GLOSSARY.md
>  M specs/261016-mvp-exportar-conversa-claude.md
> ?? meta/workorders/261016-wo0004-normalizador-e-exportar.md
> ```
> Se o dono ja copiou a skill nova (abaixo), aparece tambem ` M .claude/skills/apply-wo/SKILL.md`. Mais alguma coisa: **PARE e reporte**
> — e grave o relatorio em arquivo ANTES do menu (`CLAUDE.md`, «Relatório em arquivo»).
> **Base:** conversa de chat de 2026-10-16 (Conversas 9 e 10 do log): passos 7 e 8 da spec, 4 capturas reais medidas, pedido do dono
> de nome de arquivo com o titulo na frente e link na descricao.
> **Arquivos que o chat gravou no disco e esta WO versiona** (Edicao 0 confere):
> - `meta/CEREBRO.md` — `0046cae3e246ad60f99d6be0ff14a4b4aae4b3ae`
> - `meta/CONTEXT.md` — `18baf696d026b0c8c03322abf25ab04f68317f3c`
> - `meta/GLOSSARY.md` — `227afdfddf0f3b57ffb402acf36a94978f90cb87`
> - `specs/261016-mvp-exportar-conversa-claude.md` — `8b468d5b05f47570c974ce49620a1deed81fd935`
> - `logs/2026-10-16.md` — `c479b33e6caf456f17e15af2fd25332ee5f004f1` (antes da Edicao 10, que acrescenta a sua secao)
> - `.claude/skills/apply-wo/SKILL.md` — **opcional**: o dono copia a versao nova antes de aplicar (a ponte do chat nao grava em
>   `.claude/`). Hash novo `7d4613840aac0e107158633a32499a6057cfb1ce`: entra no commit. Ainda o antigo
>   `ed09000abde615c643b0396b015b00e56a68ec70`: siga sem ele e diga no relatorio. Outro hash: PARE.
> **Arquivos que esta WO SUBSTITUI INTEIROS** (Edicao 0 confere; hash diferente = alguem mexeu depois do chat ler: PARE):

> - `src/entrypoints/popup/index.html` — `ee44166148e6199527af9999d555edef07e901f8`
> - `src/entrypoints/popup/main.ts` — `1da9e0dfe93280ca8f037312c0fb514d1719bf2f`
> - `src/exporters/lunoda-build.ts` — `d3dd9b08312df708e12467a2389d3a3bbdb7b529`
> - `src/exporters/lunoda-build.test.ts` — `8871c07b5399a537853df10ae437539bde86ede5`
> - `src/exporters/lunoda-md.ts` — `49dac01e483b9685fe3a70aae61ae6b45f58d53e`
> - `src/popup/raw-dump.ts` — `4537a19e58413efc554bcd091203e2ebb21130d3`
> - `src/popup/raw-dump.test.ts` — `b8250a679d49dc058895531306c1173f8431214a`
> **Ancora semantica:** se um trecho-ancora nao bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar proximo.
> **Idempotencia:** antes de cada insercao, procure a frase-chave do texto NOVO; se ja existir, PULE e diga no relatorio.
> **Ancoras lidas em:** neste turno de chat, no disco em `79ffab2`: `CLAUDE.md` (linha da armadilha 14), `meta/DECISIONS.md`
> (ultima linha de texto da DEC-010), `meta/STATUS.md` (Versao, Funcionando, Em Progresso, Backlog, Ultima conversa),
> `meta/CHANGELOG.md` (ultimo item), `meta/ROADMAP.md` (itens da F1 e da F2), `meta/IDEAS.md` (entradas «Preencher `p-ia` sozinho»
> e «Outros formatos de saida», secao «Concluidas»). O trecho literal esta no bloco «Ancora».
> **Simulado:** o chat aplicou o codigo desta WO numa copia do repo em `79ffab2`: `npm run check` verde
> (`Tests  80 passed | 2 skipped (82)`), oraculo do Lunoda com 4 pares (`8 passed`), e o normalizador + a exportacao compilados
> rodaram NA MAQUINA DO DONO sobre as 4 capturas reais: 16, 11, 5 e 14 turnos, nenhum turno vazio, link na descricao.
> As edicoes de doc foram aplicadas a partir do texto DESTA WO em copias dos meta/ do disco.
> **Nao testado:** o teste das capturas com Vitest (`CDC_CLAUDE_CAPTURES_DIR`) — o chat so rodou a mesma logica compilada. O
> numero esperado dele e **deduzido**: relate o cru, nao pare por ele. E a exportacao no navegador: e do dono, no roteiro do chat.
> **Proximo comando:** `CDC_CLAUDE_CAPTURES_DIR=../capturas-claude/cdc-raw npx vitest run src/adapters/claude/normalize.test.ts`

> **Canal dos meta neste ciclo = CODE.** Esta WO E o registro: aplique as Edicoes 4 a 10. CEREBRO, CONTEXT, GLOSSARY, spec e a
> secao do chat no log ja estao gravados (Edicao 0 confere) — nao os edite, exceto a Edicao 10 (a SUA secao no fim do log).

---

## 1. Por que

Passos 7 e 8 da spec: traduzir a resposta do claude.ai para o modelo canonico e dar ao popup o botao que baixa o `.json` e o
`.md` do Lunoda. O normalizador foi escrito sobre o formato MEDIDO nas capturas, e a medicao evitou dois defeitos silenciosos: o
campo `text` da mensagem vem vazio (o texto esta em `content[]`) e o pensamento completo nao vem (so os resumos). Junto, tres
pedidos do dono: nome do arquivo com o titulo da conversa na frente, link da conversa na descricao do Lunoda, e «IA Utilizada»
marcada como ele marcava a mao (entrada + blocos da IA).

## 2. Contexto factual

- **[medido pelo chat, na maquina do dono]** 4 capturas em `CDC/capturas-claude/cdc-raw/`: estrutura registrada no CONTEXT
  («Formato da resposta do Claude»). Normalizador nelas: 16, 11, 5 e 14 turnos = numero de pedidos no ramo atual; nenhum pedido
  nem resposta vazios; 6 anexos e 2 arquivos gerados reconhecidos.
- **[medido]** Exportacao de ponta a ponta nas 4: 32, 22, 10 e 28 blocos; 33–68 KB; menos de 1 s cada.
- **[medido]** Par novo do oraculo `CDC/oraculo-lunoda/sintetico-lunoda-desc.*` (descricao preenchida): o MD ganha
  `> **Descrição/Resumo:** <texto>` + linha em branco depois do titulo. Oraculo com 4 pares: `8 passed`.
- **[medido]** As fixtures `src/tests/fixtures/lunoda/sintetico.*` MUDAM (agora com link na descricao e «IA Utilizada»); a versao
  nova tem a mesma forma do par `sintetico-lunoda-desc` exportado pelo Lunoda (so os carimbos de edicao diferem).
- **[relatado pelo dono, 2026-10-16]** «IA Utilizada» foi marcada por ele, bloco a bloco; quer o titulo na frente do nome do
  arquivo; sugeriu o link na descricao do Lunoda.

---

## Edicao 0 — conferencia antes de tudo (nao edita nada)

```
git log -1 --oneline
git status --short
sha1sum meta/CEREBRO.md meta/CONTEXT.md meta/GLOSSARY.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md .claude/skills/apply-wo/SKILL.md
sha1sum src/entrypoints/popup/index.html src/entrypoints/popup/main.ts src/exporters/lunoda-build.ts src/exporters/lunoda-build.test.ts src/exporters/lunoda-md.ts src/popup/raw-dump.ts src/popup/raw-dump.test.ts
ls ../oraculo-lunoda ../capturas-claude/cdc-raw
```

Esperado: `79ffab2 …`; o `status` e os 12 hashes do cabecalho; `oraculo-lunoda` com 8 arquivos (4 pares); `cdc-raw` com 4 `.json`.
Divergiu: PARE.

---

## Edicao 1 — substituir 7 arquivos inteiros

**Substituir o arquivo inteiro** pelo conteudo abaixo (o hash de antes ja foi conferido na Edicao 0).

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
        margin-top: 6px;
        cursor: pointer;
      }
      button.secondary {
        font-size: 11px;
        opacity: 0.8;
      }
    </style>
  </head>
  <body>
    <h1>Coletor de Contexto</h1>
    <p id="status">Verificando a aba…</p>
    <button id="export" type="button" hidden>Exportar para o Lunoda (.json + .md)</button>
    <button id="raw" type="button" class="secondary" hidden>
      Salvar resposta bruta (depuração)
    </button>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### `src/entrypoints/popup/main.ts`

```ts
// Popup da extensao (F1, passos 6 e 8 da spec). Reconhece a conversa do Claude e oferece:
// - «Exportar para o Lunoda»: baixa `<titulo>.json` e `<titulo>.md` (DEC-011);
// - «Salvar resposta bruta (depuracao)»: baixa a resposta da API como veio (DEC-010).
import { browser } from 'wxt/browser';
import { fetchClaudeConversationRaw } from '../../adapters/claude/fetch-raw';
import { ClaudeFormatError } from '../../adapters/claude/normalize';
import { parseClaudeConversationUrl } from '../../adapters/claude/url';
import { createIdGenerator } from '../../core/ids';
import { DEFAULT_EXPORT_OPTIONS } from '../../core/model';
import { buildLunodaExport } from '../../popup/export';
import { rawDumpFilename, summarizeRaw } from '../../popup/raw-dump';

const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;
const exportButton = document.querySelector<HTMLButtonElement>('#export')!;
const rawButton = document.querySelector<HTMLButtonElement>('#raw')!;

function say(text: string, kind: 'info' | 'ok' | 'error' = 'info'): void {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

/** Baixa um texto como arquivo (caminho relativo a Downloads). */
async function download(text: string, filename: string, type: string): Promise<void> {
  const url = URL.createObjectURL(new Blob([text], { type }));
  await browser.downloads.download({ url, filename, saveAs: false });
  // O download ja comecou; liberar a URL logo depois evita segurar o texto na memoria.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Busca a resposta bruta na aba. Devolve o texto, ou null depois de dizer o erro no popup. */
async function fetchRaw(tabId: number, conversationId: string): Promise<string | null> {
  const [injection] = await browser.scripting.executeScript({
    target: { tabId },
    func: fetchClaudeConversationRaw,
    args: [conversationId],
  });
  const result = injection?.result;
  if (!result || !result.ok) {
    say(result ? result.error : 'O script na página não devolveu resultado.', 'error');
    return null;
  }
  return result.text;
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
  exportButton.hidden = false;
  rawButton.hidden = false;

  /** Roda uma acao com os dois botoes travados e erro inesperado no popup. */
  const run = (action: () => Promise<void>) => async () => {
    exportButton.disabled = rawButton.disabled = true;
    say('Buscando a conversa…');
    try {
      await action();
    } catch (err) {
      const hint =
        err instanceof ClaudeFormatError ? ' Salve a resposta bruta e leve ao chat.' : '';
      say(`${err instanceof Error ? err.message : String(err)}.${hint}`, 'error');
    } finally {
      exportButton.disabled = rawButton.disabled = false;
    }
  };

  exportButton.addEventListener(
    'click',
    run(async () => {
      const text = await fetchRaw(tabId, conversationId);
      if (text === null) return;
      const summary = summarizeRaw(text);
      if (!summary.ok) return say(summary.error, 'error');
      const files = buildLunodaExport(JSON.parse(text), DEFAULT_EXPORT_OPTIONS, {
        newId: createIdGenerator(),
        now: new Date().toISOString(),
      });
      await download(files.json, `${files.baseName}.json`, 'application/json');
      await download(files.md, `${files.baseName}.md`, 'text/markdown');
      say(`Exportado: ${files.baseName}.json e .md (${files.turns} turnos).`, 'ok');
    }),
  );

  rawButton.addEventListener(
    'click',
    run(async () => {
      const text = await fetchRaw(tabId, conversationId);
      if (text === null) return;
      const summary = summarizeRaw(text);
      if (!summary.ok) return say(summary.error, 'error');
      const filename = rawDumpFilename(conversationId, new Date(), summary.title);
      await download(text, filename, 'application/json');
      say(`Salvo em Downloads/${filename} (${summary.kb} KB, ${summary.topKeys} chaves).`, 'ok');
    }),
  );
}

void main();
```

### `src/exporters/lunoda-build.ts`

```ts
/**
 * Conversation (modelo canonico) -> entrada do Lunoda (DEC-003, DEC-004, DEC-008).
 *
 * Ordem dos blocos por turno: Prompt vN -> [Pensamento vN] -> <IA> vN. O pensamento so entra com
 * `includeThinking`; as listas de arquivos so entram com `includeFiles`.
 * A descricao da entrada e o link da conversa, e a propriedade «IA Utilizada» vem marcada na entrada e
 * nos blocos da IA — o mesmo que o dono fazia a mao no Lunoda (DEC-011).
 */

import type { Conversation, ExportOptions, FileRef, Message } from '../core/model';
import { PLATFORM_LABEL } from '../core/model';
import type { Platform } from '../core/model';
import type { LunodaBlock, LunodaDocument, LunodaEntry } from './lunoda-types';
import { defaultLunodaProperties } from './lunoda-types';

/** Opcao de «IA Utilizada» (`p-ia`) de cada plataforma, nas propriedades padrao do Lunoda. */
export const PLATFORM_IA_OPTION: Record<Platform, string> = {
  claude: 'o4',
  gemini: 'o5',
  chatgpt: 'o6',
};

/** Dependencias injetaveis da montagem (relogio e IDs), para os testes serem deterministicos. */
export interface BuildContext {
  /** Gera um ID do Lunoda (ver `createIdGenerator` em `core/ids.ts`). */
  newId: () => string;
  /** Instante da exportacao em ISO 8601 UTC; vira `createdAt` e `updatedAt` da entrada. */
  now: string;
}

/** Subtitulo do bloco de pensamento (DEC-008). */
export const THINKING_SUBTITLE = 'Pensamento';
/** Subtitulo do bloco do pedido do usuario. */
export const PROMPT_SUBTITLE = 'Prompt';

/**
 * Tamanho legivel em pt-BR: `512 B`, `1,5 KB`, `2,3 MB`. Uma casa decimal a partir de KB.
 * @param bytes tamanho em bytes (inteiro >= 0).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(1).replace('.', ',')} ${units[unit]}`;
}

/** Uma linha da lista de arquivos: `` - `nome` — tipo, tamanho `` (sem tamanho quando desconhecido). */
function fileLine(file: FileRef): string {
  const size = file.size === undefined ? '' : `, ${formatFileSize(file.size)}`;
  return `- \`${file.name}\` — ${file.kind}${size}`;
}

/** Acrescenta uma secao de arquivos ao texto, separada por uma linha em branco (DEC-008). */
function withFiles(text: string, heading: string, files: FileRef[]): string {
  if (files.length === 0) return text;
  const section = [`**${heading}:**`, ...files.map(fileLine)].join('\n');
  return text === '' ? section : `${text}\n\n${section}`;
}

function userContent(msg: Message, options: ExportOptions): string {
  return options.includeFiles
    ? withFiles(msg.text, 'Arquivos anexados', msg.attachments)
    : msg.text;
}

function assistantContent(msg: Message, options: ExportOptions): string {
  return options.includeFiles ? withFiles(msg.text, 'Arquivos gerados', msg.generated) : msg.text;
}

/**
 * Monta a entrada do Lunoda de uma conversa.
 * @param conversation conversa ja normalizada (so o ramo atual).
 * @param options o que incluir alem do texto.
 * @param ctx relogio e gerador de IDs.
 */
export function buildLunodaEntry(
  conversation: Conversation,
  options: ExportOptions,
  ctx: BuildContext,
): LunodaEntry {
  const entryId = ctx.newId();
  const aiLabel = PLATFORM_LABEL[conversation.platform];
  const iaOption = PLATFORM_IA_OPTION[conversation.platform];
  const blocks: LunodaBlock[] = [];
  const push = (subtitle: string, version: number, content: string): void => {
    // So o bloco da IA leva «IA Utilizada»; Prompt e Pensamento ficam sem (como o dono marcava).
    const blockProps = subtitle === aiLabel ? { 'p-ia': [iaOption] } : {};
    blocks.push({ id: ctx.newId(), subtitle, version, content, blockProps });
  };

  for (const turn of conversation.turns) {
    push(PROMPT_SUBTITLE, turn.index, userContent(turn.user, options));
    const reply = turn.assistant;
    if (!reply) continue;
    if (options.includeThinking && reply.thinking.length > 0) {
      push(THINKING_SUBTITLE, turn.index, reply.thinking.join('\n\n'));
    }
    push(aiLabel, turn.index, assistantContent(reply, options));
  }

  return {
    id: entryId,
    title: conversation.title,
    description: conversation.url,
    propertyValues: { 'p-tags': [], 'p-ia': [iaOption] },
    propertyAutoFlags: {},
    blocks,
    createdAt: ctx.now,
    updatedAt: ctx.now,
  };
}

/** Documento do Lunoda com as propriedades padrao e as entradas dadas. */
export function buildLunodaDocument(entries: LunodaEntry[]): LunodaDocument {
  return { properties: defaultLunodaProperties(), entries };
}
```

### `src/exporters/lunoda-build.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS, type Conversation } from '../core/model';
import {
  SYNTHETIC_CONVERSATION,
  SYNTHETIC_NOW,
  syntheticIds,
} from '../tests/synthetic-conversation';
import { buildLunodaDocument, buildLunodaEntry, formatFileSize } from './lunoda-build';

const ctx = () => ({ newId: syntheticIds(), now: SYNTHETIC_NOW });
const both = { includeThinking: true, includeFiles: true };
const none = { includeThinking: false, includeFiles: false };

const shape = (c: Conversation, opts = both) =>
  buildLunodaEntry(c, opts, ctx()).blocks.map((b) => `${b.subtitle} v${b.version}`);

describe('buildLunodaEntry', () => {
  it('ordena Prompt -> Pensamento -> Claude por turno e termina no pedido sem resposta', () => {
    expect(shape(SYNTHETIC_CONVERSATION)).toEqual([
      'Prompt v1',
      'Pensamento v1',
      'Claude v1',
      'Prompt v2',
      'Claude v2',
      'Prompt v3',
    ]);
  });

  it('sem includeThinking nao gera bloco Pensamento (padrao do primeiro uso)', () => {
    expect(DEFAULT_EXPORT_OPTIONS.includeThinking).toBe(false);
    expect(shape(SYNTHETIC_CONVERSATION, { ...DEFAULT_EXPORT_OPTIONS })).not.toContain(
      'Pensamento v1',
    );
  });

  it('junta varios blocos de pensamento com uma linha em branco', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(entry.blocks[1]?.content).toBe(
      'O usuário anexou um .txt e quer contar palavras.\n\nResposta curta: wc -w, com um exemplo.',
    );
  });

  it('acrescenta as listas de arquivos so com includeFiles', () => {
    const on = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx()).blocks;
    expect(on[0]?.content).toBe(
      'Como eu conto as palavras deste arquivo no terminal?\n\n**Arquivos anexados:**\n- `notas.txt` — text/plain, 2,0 KB',
    );
    expect(
      on[4]?.content.endsWith(
        '\n\n**Arquivos gerados:**\n- `contar.ps1` — text/x-powershell, 312 B',
      ),
    ).toBe(true);
    const off = buildLunodaEntry(SYNTHETIC_CONVERSATION, none, ctx()).blocks;
    expect(off[0]?.content).toBe('Como eu conto as palavras deste arquivo no terminal?');
  });

  it('mensagem so com anexo vira so a lista, sem linhas em branco na frente', () => {
    const c: Conversation = {
      ...SYNTHETIC_CONVERSATION,
      turns: [
        {
          index: 1,
          user: {
            text: '',
            thinking: [],
            attachments: [{ name: 'a.pdf', kind: 'application/pdf' }],
            generated: [],
          },
        },
      ],
    };
    expect(buildLunodaEntry(c, both, ctx()).blocks[0]?.content).toBe(
      '**Arquivos anexados:**\n- `a.pdf` — application/pdf',
    );
  });

  it('preenche a entrada no formato medido, com IDs unicos', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(Object.keys(entry)).toEqual([
      'id',
      'title',
      'description',
      'propertyValues',
      'propertyAutoFlags',
      'blocks',
      'createdAt',
      'updatedAt',
    ]);
    expect(Object.keys(entry.blocks[0]!)).toEqual([
      'id',
      'subtitle',
      'version',
      'content',
      'blockProps',
    ]);
    expect(entry.createdAt).toBe(SYNTHETIC_NOW);
    const ids = [entry.id, ...entry.blocks.map((b) => b.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('poe o link na descricao e marca «IA Utilizada» na entrada e so nos blocos da IA', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(entry.description).toBe(SYNTHETIC_CONVERSATION.url);
    expect(entry.propertyValues['p-ia']).toEqual(['o4']);
    expect(entry.blocks.map((b) => [b.subtitle, b.blockProps])).toEqual([
      ['Prompt', {}],
      ['Pensamento', {}],
      ['Claude', { 'p-ia': ['o4'] }],
      ['Prompt', {}],
      ['Claude', { 'p-ia': ['o4'] }],
      ['Prompt', {}],
    ]);
  });

  it('documento traz as propriedades padrao sem compartilhar referencia', () => {
    const a = buildLunodaDocument([]);
    const b = buildLunodaDocument([]);
    expect(a.properties.map((p) => p.id)).toEqual(['p-tags', 'p-ia']);
    a.properties[0]!.name = 'mudou';
    expect(b.properties[0]!.name).toBe('Tags');
  });
});

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1,0 KB'],
    [1536, '1,5 KB'],
    [5 * 1024 * 1024, '5,0 MB'],
  ])('%i bytes -> %s', (bytes, text) => {
    expect(formatFileSize(bytes)).toBe(text);
  });
});
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
 * front matter, no cabecalho e em cada bloco que a tem no `blockProps`; descricao preenchida (medida
 * com uma linha so) aparece como citacao logo depois do titulo.
 * Nao verificado (o oraculo nao tem): titulo com aspas, descricao com quebra de linha, duas
 * propriedades ou dois valores marcados ao mesmo tempo, nome de propriedade com acento.
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
    ...(entry.description === '' ? [] : [`> **Descrição/Resumo:** ${entry.description}`, '']),
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

### `src/popup/raw-dump.ts`

```ts
/**
 * Partes puras do botao de depuracao «Salvar resposta bruta» (passo 6 da spec, DEC-010).
 */

import { safeFileName } from '../core/filename';

/** Subpasta dentro de Downloads onde as capturas brutas caem. */
export const RAW_DUMP_DIR = 'cdc-raw';

/**
 * Nome do arquivo da captura: `cdc-raw/<titulo> — claude-<uuid8>-<AAAAMMDDTHHMMSSZ>.json`.
 * O titulo vem primeiro (o dono numera as conversas e quer ve-las em ordem); o pedaco do uuid e o
 * carimbo UTC evitam colisao. Sem titulo, o nome comeca pelo uuid inteiro.
 */
export function rawDumpFilename(conversationId: string, now: Date, title?: string): string {
  const stamp = now
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[-:]/g, '');
  const head = title?.trim()
    ? `${safeFileName(title)} — claude-${conversationId.slice(0, 8)}`
    : `claude-${conversationId}`;
  return `${RAW_DUMP_DIR}/${head}-${stamp}.json`;
}

/** Resumo do texto capturado, para o popup dizer o que salvou. */
export type RawSummary =
  { ok: true; kb: string; topKeys: number; title?: string } | { ok: false; error: string };

/**
 * Confere que a resposta e JSON de objeto e resume o tamanho e o titulo (`name`).
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
  const name = (parsed as { name?: unknown }).name;
  return {
    ok: true,
    kb,
    topKeys: Object.keys(parsed).length,
    ...(typeof name === 'string' && name.trim() ? { title: name } : {}),
  };
}
```

### `src/popup/raw-dump.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { rawDumpFilename, summarizeRaw } from './raw-dump';

const ID = 'd41adc75-87c7-4a84-87ee-0b95f7ed0a5c';
const NOW = new Date('2026-10-17T01:23:25.562Z');

describe('rawDumpFilename', () => {
  it('poe o titulo na frente, depois o comeco do uuid e o carimbo UTC', () => {
    expect(rawDumpFilename(ID, NOW, 'CDC 1')).toBe(
      'cdc-raw/CDC 1 — claude-d41adc75-20261017T012325Z.json',
    );
  });

  it('titulo com caractere proibido no Windows vira nome seguro', () => {
    expect(rawDumpFilename(ID, NOW, 'Parte 2: A/B')).toBe(
      'cdc-raw/Parte 2_ A_B — claude-d41adc75-20261017T012325Z.json',
    );
  });

  it('sem titulo, comeca pelo uuid inteiro', () => {
    expect(rawDumpFilename(ID, NOW)).toBe(`cdc-raw/claude-${ID}-20261017T012325Z.json`);
    expect(rawDumpFilename(ID, NOW, '  ')).toBe(`cdc-raw/claude-${ID}-20261017T012325Z.json`);
  });
});

describe('summarizeRaw', () => {
  it('resume objeto JSON em KB (bytes UTF-8), numero de chaves e titulo', () => {
    const text = JSON.stringify({ name: 'CDC 1', a: 'é'.repeat(1024) });
    expect(summarizeRaw(text)).toEqual({ ok: true, kb: '2,0', topKeys: 2, title: 'CDC 1' });
  });

  it('sem name, sem titulo', () => {
    expect(summarizeRaw('{"a":1}')).toEqual({ ok: true, kb: '0,0', topKeys: 1 });
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

## Edicao 2 — criar 7 arquivos novos

**Criar arquivo novo** em cada caminho. Se algum ja existir: PARE. As fixtures NAO se escrevem a mao: a Edicao 3 as grava.

### `src/adapters/claude/normalize.ts`

```ts
/**
 * Resposta bruta do claude.ai -> Conversation (modelo canonico). Passo 7 da spec, DEC-011.
 *
 * Formato MEDIDO em 4 capturas reais (2026-10-16; CONTEXT, «Formato da resposta do Claude»):
 * - `chat_messages[]` com `uuid`, `sender` ("human" | "assistant"), `parent_message_uuid` e `content[]`;
 *   a conversa e uma arvore, e o ramo da tela vai da raiz ate `current_leaf_message_uuid`.
 * - O campo `text` da mensagem vem VAZIO; o texto real esta nos itens `content[].type === "text"`,
 *   intercalados com `thinking`, `tool_use` e `tool_result`.
 * - O pensamento completo NAO vem (`thinking` vazio, as vezes `thinking_hidden`); vem `summaries[].summary`.
 * - Anexos do usuario: `attachments[]` (`file_name`, `file_type`, `file_size`) e `files[]` (`file_name`,
 *   `file_kind`, `size_bytes`); arquivos gerados pela IA: `files[]` da mensagem da IA.
 * - Pode haver duas mensagens seguidas da IA (continuacao, ou mensagem vazia): viram UMA resposta.
 */

import type { Conversation, FileRef, Message, Turn } from '../../core/model';

/** Erro de formato: a plataforma mudou a resposta e o adaptador nao reconhece mais. */
export class ClaudeFormatError extends Error {
  override name = 'ClaudeFormatError';
  constructor(detail: string) {
    super(`Formato da conversa do Claude mudou: ${detail}`);
  }
}

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

function str(o: Obj, key: string, where: string): string {
  const v = o[key];
  if (typeof v !== 'string') throw new ClaudeFormatError(`${where}.${key} nao e texto`);
  return v;
}

/** Lista opcional: ausente vira vazia; presente e nao-lista e erro. */
function list(o: Obj, key: string, where: string): unknown[] {
  const v = o[key];
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new ClaudeFormatError(`${where}.${key} nao e lista`);
  return v;
}

/** Converte `attachments[]` e `files[]` em referencias, sem nunca levar o conteudo do arquivo. */
function fileRefs(m: Obj, where: string): FileRef[] {
  const refs: FileRef[] = [];
  for (const a of list(m, 'attachments', where)) {
    if (!isObj(a) || typeof a.file_name !== 'string') continue;
    refs.push({
      name: a.file_name,
      kind: typeof a.file_type === 'string' && a.file_type ? a.file_type : 'arquivo',
      ...(typeof a.file_size === 'number' ? { size: a.file_size } : {}),
    });
  }
  for (const f of list(m, 'files', where)) {
    if (!isObj(f) || typeof f.file_name !== 'string') continue;
    refs.push({
      name: f.file_name,
      kind: typeof f.file_kind === 'string' && f.file_kind ? f.file_kind : 'arquivo',
      ...(typeof f.size_bytes === 'number' ? { size: f.size_bytes } : {}),
    });
  }
  return refs;
}

/**
 * Pensamento de um item `thinking`: o texto completo quando vier; senao, os resumos como lista.
 * Devolve '' quando nao ha nada legivel.
 */
function thinkingText(c: Obj): string {
  if (typeof c.thinking === 'string' && c.thinking.trim() !== '') return c.thinking;
  const summaries = Array.isArray(c.summaries) ? c.summaries : [];
  return summaries
    .map((s) => (isObj(s) && typeof s.summary === 'string' ? s.summary.trim() : ''))
    .filter((s) => s !== '')
    .map((s) => `- ${s}`)
    .join('\n');
}

/** Uma mensagem bruta -> Message (ferramentas ficam de fora: `tool_use`/`tool_result`). */
function toMessage(m: Obj, where: string): { sender: 'human' | 'assistant'; msg: Message } {
  const sender = m.sender;
  if (sender !== 'human' && sender !== 'assistant') {
    throw new ClaudeFormatError(`${where}.sender inesperado (${String(sender)})`);
  }
  const texts: string[] = [];
  const thinking: string[] = [];
  list(m, 'content', where).forEach((c, i) => {
    if (!isObj(c)) throw new ClaudeFormatError(`${where}.content[${i}] nao e objeto`);
    if (c.type === 'text') {
      const t = str(c, 'text', `${where}.content[${i}]`);
      if (t.trim() !== '') texts.push(t);
    } else if (c.type === 'thinking') {
      const t = thinkingText(c);
      if (t !== '') thinking.push(t);
    }
  });
  const files = fileRefs(m, where);
  const createdAt = typeof m.created_at === 'string' ? m.created_at : undefined;
  return {
    sender,
    msg: {
      text: texts.join('\n\n'),
      thinking,
      attachments: sender === 'human' ? files : [],
      generated: sender === 'assistant' ? files : [],
      ...(createdAt ? { createdAt } : {}),
    },
  };
}

const isEmpty = (m: Message): boolean =>
  m.text === '' &&
  m.thinking.length === 0 &&
  m.attachments.length === 0 &&
  m.generated.length === 0;

/** Junta a continuacao de uma resposta na resposta anterior do mesmo turno. */
function merge(a: Message, b: Message): Message {
  return {
    text: [a.text, b.text].filter((t) => t !== '').join('\n\n'),
    thinking: [...a.thinking, ...b.thinking],
    attachments: [...a.attachments, ...b.attachments],
    generated: [...a.generated, ...b.generated],
    ...(a.createdAt ? { createdAt: a.createdAt } : {}),
  };
}

/**
 * Normaliza a resposta de `chat_conversations/{id}?tree=True&rendering_mode=messages`.
 * @param raw o JSON da resposta, ja parseado.
 * @throws ClaudeFormatError quando falta campo essencial ou o ramo atual nao fecha.
 */
export function normalizeClaudeConversation(raw: unknown): Conversation {
  if (!isObj(raw)) throw new ClaudeFormatError('a resposta nao e um objeto');
  const uuid = str(raw, 'uuid', 'conversa');
  const name = str(raw, 'name', 'conversa');
  const createdAt = str(raw, 'created_at', 'conversa');
  const updatedAt = str(raw, 'updated_at', 'conversa');
  const leaf = str(raw, 'current_leaf_message_uuid', 'conversa');
  const all = raw.chat_messages;
  if (!Array.isArray(all)) throw new ClaudeFormatError('conversa.chat_messages nao e lista');

  const byId = new Map<string, Obj>();
  all.forEach((m, i) => {
    if (!isObj(m)) throw new ClaudeFormatError(`chat_messages[${i}] nao e objeto`);
    byId.set(str(m, 'uuid', `chat_messages[${i}]`), m);
  });

  // Ramo atual: da folha ate a raiz, seguindo parent_message_uuid; depois inverte.
  const path: Obj[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined = leaf;
  if (!byId.has(leaf))
    throw new ClaudeFormatError('current_leaf_message_uuid nao esta nas mensagens');
  while (cursor !== undefined && byId.has(cursor)) {
    if (seen.has(cursor)) throw new ClaudeFormatError('ciclo em parent_message_uuid');
    seen.add(cursor);
    const m: Obj = byId.get(cursor)!;
    path.push(m);
    cursor = typeof m.parent_message_uuid === 'string' ? m.parent_message_uuid : undefined;
  }
  path.reverse();

  const turns: Turn[] = [];
  path.forEach((m, i) => {
    const { sender, msg } = toMessage(m, `ramo[${i}]`);
    if (isEmpty(msg)) return; // mensagem vazia (resposta abortada): nao vira bloco
    const current = turns[turns.length - 1];
    if (sender === 'human') {
      turns.push({ index: turns.length + 1, user: msg });
    } else if (!current) {
      // Resposta sem pedido antes (nao visto nas capturas): turno com pedido vazio.
      turns.push({
        index: 1,
        user: { text: '', thinking: [], attachments: [], generated: [] },
        assistant: msg,
      });
    } else {
      current.assistant = current.assistant ? merge(current.assistant, msg) : msg;
    }
  });

  return {
    platform: 'claude',
    sourceId: uuid,
    title: name.trim() || 'Conversa sem título',
    url: `https://claude.ai/chat/${uuid}`,
    createdAt,
    updatedAt,
    turns,
  };
}
```

### `src/adapters/claude/normalize.test.ts`

```ts
/**
 * Normalizador do Claude (DEC-011).
 * 1. Resposta SINTETICA no formato medido (versionada).
 * 2. Capturas REAIS fora do repositorio, apontadas por CDC_CLAUDE_CAPTURES_DIR (pulado sem a variavel):
 *    todas tem de normalizar sem erro e sem turno vazio.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SYNTHETIC_CLAUDE_RAW } from '../../tests/synthetic-claude-raw';
import { ClaudeFormatError, normalizeClaudeConversation } from './normalize';

describe('normalizeClaudeConversation (sintetico)', () => {
  const c = normalizeClaudeConversation(structuredClone(SYNTHETIC_CLAUDE_RAW));

  it('le os dados da conversa e monta o link', () => {
    expect(c).toMatchObject({
      platform: 'claude',
      sourceId: '11111111-2222-4333-8444-555555555555',
      title: 'Sintética 1 — contar palavras',
      url: 'https://claude.ai/chat/11111111-2222-4333-8444-555555555555',
    });
  });

  it('segue so o ramo atual e termina no pedido sem resposta', () => {
    expect(c.turns.map((t) => [t.index, t.user.text, t.assistant ? 'resposta' : '-'])).toEqual([
      [1, 'Quantas palavras tem este arquivo?', 'resposta'],
      [2, 'E sem contar as linhas vazias?', 'resposta'],
      [3, 'Obrigado! Última pergunta depois.', '-'],
    ]);
    expect(JSON.stringify(c)).not.toContain('ABANDONADO');
    expect(JSON.stringify(c)).not.toContain('ANTES DE EDITAR');
  });

  it('junta os textos da resposta com linha em branco e deixa as ferramentas de fora', () => {
    expect(c.turns[0]?.assistant?.text).toBe('Vou contar com o `wc`.\n\nSão **412** palavras.');
    expect(JSON.stringify(c)).not.toContain('412 notas.txt');
  });

  it('pensamento vem dos resumos, um item por bloco de pensamento', () => {
    expect(c.turns[0]?.assistant?.thinking).toEqual([
      '- Lendo o anexo.\n- Escolhendo o comando.',
      '- Conferindo a saida.',
    ]);
  });

  it('une a continuacao da resposta e ignora a mensagem vazia', () => {
    expect(c.turns[1]?.assistant?.text).toBe(
      'Use `grep -c .` para as linhas não vazias.\n\nDeixei o script pronto.',
    );
    expect(c.turns[1]?.assistant?.generated).toEqual([
      { name: 'contar.sh', kind: 'blob', size: 312 },
    ]);
  });

  it('anexos do pedido viram referencias, sem o conteudo extraido', () => {
    expect(c.turns[0]?.user.attachments).toEqual([
      { name: 'notas.txt', kind: 'text/plain', size: 2048 },
      { name: 'print.png', kind: 'image', size: 95547 },
    ]);
    expect(JSON.stringify(c)).not.toContain('NAO DEVE APARECER');
  });

  it('titulo vazio vira «Conversa sem título»', () => {
    const raw = { ...structuredClone(SYNTHETIC_CLAUDE_RAW), name: '  ' };
    expect(normalizeClaudeConversation(raw).title).toBe('Conversa sem título');
  });
});

describe('normalizeClaudeConversation (formato quebrado)', () => {
  const broken = (mutate: (r: Record<string, unknown>) => void) => {
    const raw = structuredClone(SYNTHETIC_CLAUDE_RAW) as unknown as Record<string, unknown>;
    mutate(raw);
    return () => normalizeClaudeConversation(raw);
  };

  it.each([
    ['sem chat_messages', (r: Record<string, unknown>) => delete r.chat_messages],
    [
      'sem current_leaf_message_uuid',
      (r: Record<string, unknown>) => delete r.current_leaf_message_uuid,
    ],
    ['folha que nao existe', (r: Record<string, unknown>) => (r.current_leaf_message_uuid = 'x')],
    [
      'sender desconhecido',
      (r: Record<string, unknown>) =>
        ((r.chat_messages as Record<string, unknown>[])[0]!.sender = 'bot'),
    ],
  ])('%s -> ClaudeFormatError com a mensagem padrao', (_nome, mutate) => {
    expect(broken(mutate)).toThrow(ClaudeFormatError);
    expect(broken(mutate)).toThrow('Formato da conversa do Claude mudou');
  });

  it('nao e objeto -> erro', () => {
    expect(() => normalizeClaudeConversation('<html>')).toThrow(ClaudeFormatError);
  });
});

const capturesDir = process.env.CDC_CLAUDE_CAPTURES_DIR;
const captures =
  capturesDir && existsSync(capturesDir)
    ? readdirSync(capturesDir).filter((f) => f.endsWith('.json'))
    : [];

describe.skipIf(!capturesDir)('capturas reais (CDC_CLAUDE_CAPTURES_DIR)', () => {
  it('a pasta tem ao menos uma captura .json', () => {
    expect(captures.length).toBeGreaterThan(0);
  });

  it.each(captures)('%s: normaliza sem erro e sem turno vazio', (file) => {
    const raw: unknown = JSON.parse(readFileSync(join(capturesDir!, file), 'utf8'));
    const c = normalizeClaudeConversation(raw);
    expect(c.turns.length).toBeGreaterThan(0);
    for (const t of c.turns) {
      expect(t.user.text !== '' || t.user.attachments.length > 0).toBe(true);
      if (t.assistant) {
        expect(t.assistant.text !== '' || t.assistant.generated.length > 0).toBe(true);
      }
    }
  });
});
```

### `src/core/filename.ts`

```ts
/**
 * Nome de arquivo seguro para o Windows a partir do titulo da conversa (armadilha 7 do CONTEXT).
 * So o NOME do arquivo e sanitizado; o titulo dentro do conteudo fica como esta.
 */

/** Proibidos no Windows, alem dos caracteres de controle (codigo < 32). */
const FORBIDDEN = '<>:"/\\|?*';

/** Troca cada caractere proibido por `_`. */
function replaceForbidden(text: string): string {
  return Array.from(text, (ch) =>
    ch.charCodeAt(0) < 32 || FORBIDDEN.includes(ch) ? '_' : ch,
  ).join('');
}

const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const MAX_LENGTH = 120;

/**
 * Converte um titulo em nome de arquivo (sem extensao).
 * Caracteres proibidos viram `_`, espacos repetidos colapsam, ponto/espaco no fim saem, nome
 * reservado do Windows ganha `_` na frente, e o resultado tem no maximo 120 caracteres.
 * @param title titulo da conversa.
 * @param fallback nome usado quando nao sobra nada do titulo.
 */
export function safeFileName(title: string, fallback = 'conversa'): string {
  let name = replaceForbidden(title).replace(/\s+/g, ' ').trim();
  name = name.slice(0, MAX_LENGTH).replace(/[. ]+$/, '');
  if (name === '') return fallback;
  return RESERVED.test(name) ? `_${name}` : name;
}
```

### `src/core/filename.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { safeFileName } from './filename';

describe('safeFileName', () => {
  it.each([
    ['CDC 1', 'CDC 1'],
    ['mapsmith 10 - v4', 'mapsmith 10 - v4'],
    ['Conversa sintética — contar palavras', 'Conversa sintética — contar palavras'],
    ['Parte 2: A/B?', 'Parte 2_ A_B_'],
    ['  muitos    espaços  ', 'muitos espaços'],
    ['termina com ponto.', 'termina com ponto'],
    ['CON', '_CON'],
    ['', 'conversa'],
    ['???', '___'],
  ])('%j -> %j', (title, name) => {
    expect(safeFileName(title)).toBe(name);
  });

  it('corta em 120 caracteres', () => {
    expect(safeFileName('a'.repeat(300))).toHaveLength(120);
  });
});
```

### `src/popup/export.ts`

```ts
/**
 * Exportacao do botao «Exportar para o Lunoda»: resposta bruta -> `.json` + `.md` (passo 8 da spec).
 * Parte pura (sem navegador), para ser testada de ponta a ponta.
 */

import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { safeFileName } from '../core/filename';
import type { ExportOptions } from '../core/model';
import {
  buildLunodaDocument,
  buildLunodaEntry,
  type BuildContext,
} from '../exporters/lunoda-build';
import { renderLunodaJson } from '../exporters/lunoda-json';
import { renderLunodaMd } from '../exporters/lunoda-md';

/** Os dois arquivos da exportacao e o nome-base (titulo da conversa, seguro para o Windows). */
export interface ExportFiles {
  baseName: string;
  json: string;
  md: string;
  turns: number;
}

/**
 * Gera os arquivos do Lunoda a partir da resposta bruta do Claude.
 * @param raw JSON da resposta, ja parseado.
 * @param options o que incluir alem do texto.
 * @param ctx relogio e gerador de IDs.
 * @param timeZone fuso das datas do `.md`; omitido = fuso do navegador.
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildLunodaExport(
  raw: unknown,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): ExportFiles {
  const conversation = normalizeClaudeConversation(raw);
  const entry = buildLunodaEntry(conversation, options, ctx);
  const doc = buildLunodaDocument([entry]);
  return {
    baseName: safeFileName(conversation.title),
    json: renderLunodaJson(doc),
    md: renderLunodaMd(entry, doc.properties, timeZone),
    turns: conversation.turns.length,
  };
}
```

### `src/popup/export.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS } from '../core/model';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW, syntheticIds } from '../tests/synthetic-conversation';
import { buildLunodaExport } from './export';

describe('buildLunodaExport (ponta a ponta, resposta sintetica do Claude)', () => {
  const files = buildLunodaExport(
    structuredClone(SYNTHETIC_CLAUDE_RAW),
    { ...DEFAULT_EXPORT_OPTIONS },
    { newId: syntheticIds(), now: SYNTHETIC_NOW },
    'America/Sao_Paulo',
  );

  it('nome-base e o titulo da conversa', () => {
    expect(files.baseName).toBe('Sintética 1 — contar palavras');
    expect(files.turns).toBe(3);
  });

  it('json bate com a fixture', async () => {
    await expect(files.json).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.lunoda.json',
    );
  });

  it('md bate com a fixture', async () => {
    await expect(files.md).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.lunoda.md',
    );
  });

  it('padrao do primeiro uso: sem pensamento, com arquivos, link na descricao', () => {
    expect(files.md).not.toContain('Pensamento');
    expect(files.md).toContain('**Arquivos anexados:**');
    expect(files.md).toContain(
      '> **Descrição/Resumo:** https://claude.ai/chat/11111111-2222-4333-8444-555555555555',
    );
  });
});
```

### `src/tests/synthetic-claude-raw.ts`

```ts
/**
 * Resposta SINTETICA no formato do claude.ai (o repositorio e publico: conteudo inventado — DEC-009).
 *
 * A FORMA copia o que foi medido em 4 capturas reais em 2026-10-16 (CONTEXT, «Formato da resposta do
 * Claude»): `text` da mensagem vazio, texto em `content[]`, ferramentas intercaladas, pensamento so em
 * `summaries`, anexos em `attachments`/`files`, arvore com um pedido EDITADO (ramo abandonado),
 * duas mensagens seguidas da IA (a segunda vazia) e conversa terminando num pedido sem resposta.
 */

const ROOT = '00000000-0000-4000-8000-000000000000';

const text = (t: string) => ({
  start_timestamp: '2026-10-16T20:00:00.000000Z',
  stop_timestamp: '2026-10-16T20:00:01.000000Z',
  type: 'text',
  text: t,
  citations: [],
});

const thinking = (...summaries: string[]) => ({
  start_timestamp: '2026-10-16T20:00:00.000000Z',
  stop_timestamp: '2026-10-16T20:00:01.000000Z',
  type: 'thinking',
  thinking: '',
  summaries: summaries.map((summary) => ({ summary })),
  cut_off: false,
  truncated: false,
  hidden: false,
  thinking_hidden: true,
});

const tool = (id: string) => [
  {
    type: 'tool_use',
    id,
    name: 'bash_tool',
    input: { command: 'wc -w notas.txt' },
    message: 'Contando',
    integration_name: null,
  },
  {
    type: 'tool_result',
    tool_use_id: id,
    name: 'bash_tool',
    content: [{ type: 'text', text: '412 notas.txt' }],
    is_error: false,
  },
];

const msg = (
  uuid: string,
  parent: string,
  sender: 'human' | 'assistant',
  index: number,
  content: unknown[],
  extra: Record<string, unknown> = {},
) => ({
  uuid,
  text: '',
  content,
  sender,
  index,
  created_at: `2026-10-16T20:0${index}:00.000000Z`,
  updated_at: `2026-10-16T20:0${index}:00.000000Z`,
  truncated: false,
  attachments: [],
  files: [],
  sync_sources: [],
  parent_message_uuid: parent,
  ...(sender === 'assistant' ? { stop_reason: 'end_turn' } : {}),
  ...extra,
});

const id = (n: number) => `aaaaaaaa-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const SYNTHETIC_CLAUDE_RAW = {
  uuid: '11111111-2222-4333-8444-555555555555',
  name: 'Sintética 1 — contar palavras',
  summary: '',
  model: 'claude-x',
  created_at: '2026-10-16T20:00:00.000000Z',
  updated_at: '2026-10-16T20:09:00.000000Z',
  settings: {},
  is_starred: false,
  current_leaf_message_uuid: id(8),
  chat_messages: [
    msg(id(1), ROOT, 'human', 0, [text('Quantas palavras tem este arquivo?')], {
      attachments: [
        {
          id: 'x',
          file_name: 'notas.txt',
          file_size: 2048,
          file_type: 'text/plain',
          extracted_content: 'NAO DEVE APARECER NA EXPORTACAO',
          created_at: '2026-10-16T20:00:00.000000Z',
        },
      ],
      files: [{ file_kind: 'image', file_name: 'print.png', size_bytes: 95547, success: true }],
    }),
    msg(id(2), id(1), 'assistant', 1, [
      thinking('Lendo o anexo.', 'Escolhendo o comando.'),
      text('Vou contar com o `wc`.'),
      ...tool('t1'),
      thinking('Conferindo a saida.'),
      text('São **412** palavras.'),
    ]),
    // Pedido editado: o primeiro ramo (id 3/4) foi abandonado; o atual segue por id 5.
    msg(id(3), id(2), 'human', 2, [text('PEDIDO ANTIGO, ANTES DE EDITAR')]),
    msg(id(4), id(3), 'assistant', 3, [text('RESPOSTA DO RAMO ABANDONADO')]),
    msg(id(5), id(2), 'human', 4, [text('E sem contar as linhas vazias?')]),
    msg(
      id(6),
      id(5),
      'assistant',
      5,
      [text('Use `grep -c .` para as linhas não vazias.'), ...tool('t2')],
      {
        stop_reason: 'tool_use',
      },
    ),
    // Continuacao da mesma resposta, e uma mensagem vazia (resposta abortada) logo depois.
    msg(id(7), id(6), 'assistant', 6, [text('Deixei o script pronto.')], {
      files: [{ file_kind: 'blob', file_name: 'contar.sh', size_bytes: 312, download_source: 'x' }],
    }),
    msg(id(9), id(7), 'assistant', 7, []),
    msg(id(8), id(9), 'human', 8, [text('Obrigado! Última pergunta depois.')]),
  ],
};
```

---

## Edicao 3 — regravar as fixtures e validar

```
npx vitest run src/exporters/lunoda-golden.test.ts src/popup/export.test.ts --update
sha1sum src/tests/fixtures/lunoda/sintetico.json src/tests/fixtures/lunoda/sintetico.md src/tests/fixtures/claude/sintetico-claude.lunoda.json src/tests/fixtures/claude/sintetico-claude.lunoda.md
npm run check
CDC_LUNODA_ORACLE_DIR=../oraculo-lunoda npx vitest run src/exporters/lunoda-golden.test.ts
CDC_CLAUDE_CAPTURES_DIR=../capturas-claude/cdc-raw npx vitest run src/adapters/claude/normalize.test.ts
CDC_CLAUDE_CAPTURES_DIR=src/tests npx vitest run src/adapters/claude/normalize.test.ts
```

- O `--update` regrava as 2 fixtures do Lunoda (mudanca intencional: link + «IA Utilizada») e grava as 2 novas do Claude.
  Saida esperada: `Test Files  2 passed (2)` e `Tests  7 passed | 1 skipped (8)` (a linha de snapshots pode mostrar so
  «2 written»; quem decide sao os 4 hashes abaixo).
  **A flag vai DEPOIS dos caminhos** (armadilha 16 do CONTEXT): no Vitest 5, `-u`/`--update` antes de um caminho o engole como
  valor — medido: `-u A B` rodou so o B, e `--update A` rodou a suite inteira.
- Os 4 `sha1sum` TEM de ser, nesta ordem: `36eb528d38af5da3d54d1f540023bd5237208f98`, `0251a6ab4dc513da739da728e9a4ac30cffffe1e`,
  `80f07850c6c45d056d9b1e449c142fb786ad1b7b`, `16d6508a4dba4cdda14997c927c27b9f05ad6483`. Diferente: **PARE** e mande os hashes
  e o `head -c 600` de cada um.
- `npm run check` -> codigo 0, `Tests  80 passed | 2 skipped (82)`, `All matched files use Prettier code style!`, build verde.
- Oraculo: `Tests  8 passed (8)` (3 do par sintetico + 1 da pasta + 4 pares).
- Capturas reais: esperado **deduzido** `Tests  17 passed (17)` (12 sinteticos + 1 da pasta + 4 capturas) — relate o cru.
- Prova de vida das capturas: com `src/tests` (pasta sem `.json`) -> `1 failed` («a pasta tem ao menos uma captura .json»).
- Vermelho fora da prova de vida: **PARE e reporte com a saida crua**. Nao «conserte» o codigo da WO para passar.

---

## Edicao 4 — `CLAUDE.md` · teste das capturas reais

**Ancora** (secao «Build / validação»):

```
- `src/adapters/claude/fetch-raw.ts` é injetado na aba do claude.ai: nada de import ou constante de fora dentro de `fetchClaudeConversationRaw` (armadilha 14 do CONTEXT).
```

**Substituir por:**

```
- `src/adapters/claude/fetch-raw.ts` é injetado na aba do claude.ai: nada de import ou constante de fora dentro de `fetchClaudeConversationRaw` (armadilha 14 do CONTEXT).
- Mudou `src/adapters/claude/`? Rode também as capturas reais (DEC-011): `CDC_CLAUDE_CAPTURES_DIR=../capturas-claude/cdc-raw npx vitest run src/adapters/claude/normalize.test.ts` — respostas brutas do claude.ai fora do repo; nenhuma pode virar turno vazio.
- **Parou (divergência na Edição 0, âncora não achada, validação vermelha)? O relatório em arquivo sai do mesmo jeito, ANTES do menu de opções** — `../AAMMDD-HHMM-code-cdc-apply-<wo>.txt` com o que foi conferido, o que divergiu (esperado × obtido, com o comando) e o que NÃO foi feito. É o que o chat lê; sem ele, o dono tem de copiar a tela.
```

---

## Edicao 5 — `meta/DECISIONS.md` · nova DEC-011 no fim

**Ancora** (ultima linha de texto da DEC-010; depois dela o arquivo so tem uma linha em branco):

```
A função injetada tem de ser autocontida (armadilha 14 do CONTEXT; um teste a recria só do próprio texto). Há um ciclo a mais — capturas do dono — antes do botão «Exportar».
```

**Substituir por** (a ancora repetida + a entrada nova):

```
A função injetada tem de ser autocontida (armadilha 14 do CONTEXT; um teste a recria só do próprio texto). Há um ciclo a mais — capturas do dono — antes do botão «Exportar».

---

## DEC-011 — Normalizador do Claude sobre o formato medido; o que vai para o Lunoda
**Data:** 2026-10-16 · **Status:** aceita (itens de nome, descrição e «IA Utilizada» pedidos pelo dono)

### Contexto
As 4 capturas reais (CONTEXT, «Formato da resposta do Claude») mostraram que o texto da mensagem não está no campo `text` e que o pensamento completo não vem. O dono pediu o título da conversa na frente do nome do arquivo, sugeriu o link na descrição do Lunoda e contou que marcava «IA Utilizada» à mão nos blocos da IA.

### Decisão
- Ramo atual: da raiz até `current_leaf_message_uuid`. Texto: itens `content[].text`, juntos com linha em branco. Ferramentas (`tool_use`/`tool_result`) ficam de fora.
- Pensamento: o texto completo quando vier; senão, os resumos (`summaries`) em lista. Hoje só vêm os resumos.
- Mensagens vazias ficam de fora; respostas seguidas da IA viram uma resposta só.
- Arquivos: só referência (nome, tipo, tamanho); `extracted_content` nunca vai para a exportação.
- Lunoda: descrição = link da conversa; «IA Utilizada» marcada na entrada e nos blocos da IA.
- Nome de arquivo: `<título>.json` e `<título>.md`, com o título seguro para o Windows; a captura bruta vira `<título> — claude-<uuid8>-<carimbo>.json`.
- Teste com as capturas reais fora do repo, por `CDC_CLAUDE_CAPTURES_DIR` (mesmo desenho do oráculo do Lunoda, DEC-009).

### Alternativas consideradas
- **Ler `text` da mensagem** — vem vazio: exportaria conversas em branco sem erro.
- **Incluir as chamadas de ferramenta** — em conversas de trabalho são centenas por resposta (até 696 numa captura); viram ruído. Fica como opção futura (IDEAS).
- **Uuid no nome do arquivo** — atrapalha a ordem por título que o dono usa; o link vai na descrição.

### Consequências
A exportação reproduz o que a tela mostra, menos o raciocínio completo, que a API web não entrega. Mudança no formato do claude.ai aparece como erro «Formato da conversa do Claude mudou», e o teste das capturas reais reprova turno vazio.
```

---

## Edicao 6 — `meta/STATUS.md` (cinco trechos)

### 6a — Versao Atual

**Ancora:**

```
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos; a extensão já busca a conversa do Claude e salva a resposta bruta, mas ainda não a traduz para o Lunoda.
```

**Substituir por:**

```
**0.0.0** — 2026-10-16 — F1 em curso: o botão «Exportar para o Lunoda» baixa o `.json` e o `.md` da conversa aberta no claude.ai; falta a conferência do dono no navegador e no Lunoda.
```

### 6b — Funcionando

**Ancora:**

```
- O Lunoda importou o `sintetico.json` (bloco «Pensamento» e listas de arquivos aceitos) e o devolveu byte a byte; o MD reproduz também a propriedade marcada (wo0003). Oráculo: 3 pares em `CDC/oraculo-lunoda/`.
```

**Substituir por:**

```
- O Lunoda importou o `sintetico.json` (bloco «Pensamento» e listas de arquivos aceitos) e o devolveu byte a byte; o MD reproduz também a propriedade marcada (wo0003) e a descrição (wo0004). Oráculo: 4 pares em `CDC/oraculo-lunoda/`.
- Normalizador do Claude (wo0004): 4 capturas reais em `CDC/capturas-claude/cdc-raw/` normalizam sem turno vazio (DEC-011).
```

### 6c — Em Progresso

**Ancora:**

```
- **F1 — MVP:** passos 1 a 6 da spec escritos (wo0001 a wo0003); a captura bruta ainda não foi usada no navegador. Próximo: capturas reais → normalizador do Claude (passo 7).
```

**Substituir por:**

```
- **F1 — MVP:** passos 1 a 8 da spec escritos (wo0001 a wo0004). Falta o passo 9: o dono exporta uma conversa real pelo botão e a importa no Lunoda.
```

### 6d — Backlog (as tres linhas, inteiras)

**Ancora:**

```
- [ ] Dono: capturar 2 ou 3 conversas reais com o botão de depuração e movê-las para `CDC/capturas-claude/` — uma com pensamento, uma com anexo, uma com pedido editado (roteiro na conversa de 2026-10-16).
- [ ] Dono: dizer se «IA Utilizada» ficou só nos blocos «Claude» por herança do Lunoda ou porque foi marcada bloco a bloco — decide como o exportador preenche `p-ia` (IDEAS).
- [ ] F1: normalizador do Claude sobre as capturas (passo 7 da spec) — próxima WO do chat.
```

**Substituir por:**

```
- [ ] Dono: exportar uma conversa real pelo botão «Exportar para o Lunoda» e importar o `.json` no Lunoda (roteiro na conversa de 2026-10-16) — fecha a F1.
- [ ] Dono: dizer de onde veio `CDC/261016-2317.txt` (página HTML do claude.ai, 268 KB) — sem uso para o projeto até agora.
- [ ] F2: popup com opções (pensamento, arquivos) e formatos «simples» (Markdown legível + JSON do CDC) — próxima WO do chat.
```

### 6e — Ultima conversa

**Ancora** (o paragrafo inteiro, uma linha so):

```
**2026-10-16** — O Lunoda aceitou o `sintetico.json` e o devolveu byte a byte; com «IA Utilizada» marcada, mostrou o formato das propriedades, que o MD agora reproduz (oráculo com 3 pares). wo0003: busca da conversa do Claude e captura bruta (DEC-010). Próximo: o dono captura conversas reais; o chat escreve o normalizador sobre elas.
```

**Substituir por:**

```
**2026-10-16** — 4 capturas reais medidas: o texto vem em `content[]` (o campo `text` é vazio) e o pensamento só em resumos. wo0004: normalizador do Claude e botão «Exportar para o Lunoda»; arquivo com o título da conversa, link na descrição, «IA Utilizada» marcada (DEC-011). Próximo: o dono exporta e importa uma conversa real; depois, F2.
```

---

## Edicao 7 — `meta/CHANGELOG.md` · itens em «Nao lancado»

**Ancora** (ultimo item de «Adicionado»):

```
- Captura bruta do Claude (wo0003, DEC-010): popup reconhece `claude.ai/chat/<uuid>`, injeta a busca na aba e baixa o corpo exato para `Downloads/cdc-raw/`; permissões `activeTab`, `scripting`, `downloads`; 50 testes.
```

**Substituir por:**

```
- Captura bruta do Claude (wo0003, DEC-010): popup reconhece `claude.ai/chat/<uuid>`, injeta a busca na aba e baixa o corpo exato para `Downloads/cdc-raw/`; permissões `activeTab`, `scripting`, `downloads`; 50 testes.
- Normalizador do Claude (wo0004, DEC-011): ramo atual, texto de `content[]`, pensamento por resumos, respostas seguidas unidas, anexos e arquivos gerados por referência; testado com resposta sintética e com capturas reais fora do repo.
- Botão «Exportar para o Lunoda» (wo0004): baixa `<título>.json` e `<título>.md`, com o link da conversa na descrição e «IA Utilizada» marcada; captura bruta passa a ter o título na frente do nome; 80 testes.
```

---

## Edicao 8 — `meta/ROADMAP.md` (tres linhas, cada uma substituida por inteiro)

Cada linha do primeiro bloco e uma ancora de linha inteira; substitua-a pela linha de MESMA posicao do segundo bloco.

```
- [ ] Adaptador Claude via API interna, só o ramo atual.
- [ ] Popup: detectar conversa, botão exportar, mensagens de erro claras.
- `p-ia` automático, nome de arquivo configurável, copiar para a área de transferência.
```

```
- [x] Adaptador Claude via API interna, só o ramo atual (wo0004).
- [x] Popup: detectar conversa, botão exportar, mensagens de erro claras (wo0004; falta a conferência do dono).
- Nome de arquivo configurável, copiar para a área de transferência (`p-ia` automático entrou na F1, DEC-011). Formatos «simples» pedidos pelo dono: Markdown legível e JSON do CDC, escolhidos no popup.
```

---

## Edicao 9 — `meta/IDEAS.md` (quatro trechos)

### 9a — remover «Preencher `p-ia` sozinho» das Ativas

**Remover o bloco inteiro** — as duas linhas abaixo **mais a linha em branco logo depois delas**:

```
### 2026-10-16 — Preencher `p-ia` sozinho
Marcar a propriedade «IA Utilizada» com a opção da plataforma de origem (`o4` Claude, `o5` Gemini, `o6` ChatGPT). Formato medido no par `sintetico-lunoda-ia` (CONTEXT, «Formato Lunoda»): `p-ia` na entrada e só nos blocos da IA. Falta o dono dizer se a marcação nos blocos foi herança do Lunoda ou manual (STATUS).
```

### 9b — e registra-la em «Concluidas» (a outra metade do mesmo MOVER)

**Ancora:**

```
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1.
```

**Substituir por:**

```
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1.
- **Preencher `p-ia` sozinho** — implementado na wo0004 (DEC-011): na entrada e nos blocos da IA, como o dono marcava à mão.
- **Link da conversa na descrição do Lunoda** (ideia do dono, 2026-10-16) — implementado na wo0004 (DEC-011).
```

### 9c — «Outros formatos de saida» ganha o pedido do dono

**Ancora:**

```
Markdown simples (sem os marcadores do Lunoda), Obsidian com front matter próprio, HTML. Cada um é só mais um exportador (DEC-003).
```

**Substituir por:**

```
Markdown simples (sem os marcadores do Lunoda), Obsidian com front matter próprio, HTML. Cada um é só mais um exportador (DEC-003). **Pedido do dono (2026-10-16):** um formato «original/simples», em `.md` e `.json`. Recomendação do chat: Markdown legível (título, link, data e `## Você` / `## Claude` por turno) e JSON do CDC (o modelo canônico inteiro, com tudo que foi capturado — bom para arquivo e para reprocessar). Planejado na F2.

### 2026-10-16 — Incluir as chamadas de ferramenta (opção)
As respostas de trabalho do Claude têm centenas de `tool_use`/`tool_result` (até 696 numa captura). Hoje ficam de fora (DEC-011); uma opção poderia listá-las resumidas (nome da ferramenta + uma linha) para quem quiser o rastro completo.
```

### 9d — «Feedback para o Kit»: relatorio tambem na parada

**Ancora** (ultimo item da secao):

```
- **[2026-10-16]** O pedido de abertura listava `SPEC.md` entre os arquivos a preencher, mas no kit ele é modelo. Solução adotada: modelo especializado em `meta/SPEC.md` e a spec real em `specs/`. O kit poderia dizer isso no próprio pedido de abertura.
```

**Substituir por:**

```
- **[2026-10-16]** O pedido de abertura listava `SPEC.md` entre os arquivos a preencher, mas no kit ele é modelo. Solução adotada: modelo especializado em `meta/SPEC.md` e a spec real em `specs/`. O kit poderia dizer isso no próprio pedido de abertura.
- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório em arquivo no fim, depois do push; quando o Code PARA (divergência na Edição 0 da wo0004), ele não gravou nada e o dono teve de copiar a tela para o chat. Ajuste local: a skill e o `CLAUDE.md` dizem que a parada também gera relatório em arquivo, antes do menu. O kit poderia trazer isso de fábrica.
```

---

## Edicao 10 — `logs/2026-10-16.md` · a SUA secao, no fim

Acrescente no FIM do arquivo (depois de `## Conversa 10 — chat — ...`, sem tocar nela) a secao
`## Conversa 11 — Code — aplicacao da wo0004`, no formato de `meta/LOG-TEMPLATE.md`, com o que aconteceu DE FATO.

---

## Fora de escopo

- Opcoes no popup (pensamento, arquivos), formatos «simples», copiar para a area de transferencia: F2.
- Chamadas de ferramenta na exportacao: ideia (IDEAS).
- Copiar captura, export real ou par do oraculo para dentro do repo (DEC-009).
- Esconder o botao de depuracao: so antes de publicar (DEC-010).

## Armadilhas desta WO

- **`--update` so nesta WO, e no fim do comando:** ele regrava QUALQUER fixture que diverja nos arquivos que rodam, e antes dos
  caminhos engole o primeiro. Rode exatamente o comando da Edicao 3 e confira os 4 hashes logo depois — e o hash que transforma
  «regravou» em «regravou o que devia».
- **Funcao injetada:** `fetch-raw.ts` nao muda nesta WO; o `main.ts` novo continua passando `fetchClaudeConversationRaw` ao
  `executeScript` (armadilha 14).
- **Ancoras de uma linha longa** (4, 5, 6a-6e, 7, 8, 9a, 9c): substitua a linha inteira.
- **9a e 9b sao as duas metades de um MOVER:** faca as duas, ou nenhuma.

---

## Depois de aplicar — conferencia antes do commit

- [ ] `git status --short` mostra exatamente: ` M` `CLAUDE.md`, `logs/2026-10-16.md`, `meta/CHANGELOG.md`, `meta/CONTEXT.md`,
      `meta/CEREBRO.md`, `meta/DECISIONS.md`, `meta/GLOSSARY.md`, `meta/IDEAS.md`, `meta/ROADMAP.md`, `meta/STATUS.md`,
      `specs/261016-mvp-exportar-conversa-claude.md`, os 7 arquivos da Edicao 1, `src/tests/fixtures/lunoda/sintetico.json`,
      `src/tests/fixtures/lunoda/sintetico.md`; `??` os 7 arquivos da Edicao 2, `src/tests/fixtures/claude/` e esta WO (+ ` M .claude/skills/apply-wo/SKILL.md` se o hash
      novo bateu). Diferente: PARE.
- [ ] `find src -type f | wc -l` -> **32** (23 + 7 novos + 2 fixtures do Claude).
- [ ] `grep -c "^## DEC-" meta/DECISIONS.md` -> **11**; `grep -c "^## DEC-011" meta/DECISIONS.md` -> **1**.
- [ ] `grep -c "^- \[ \]" meta/STATUS.md` -> **3**.
- [ ] `grep -c "^- \[x\]" meta/ROADMAP.md` -> **9**.
- [ ] `grep -c "^### 2026" meta/IDEAS.md` -> **12** (12 de antes - 1 movida + 1 nova).
- [ ] `grep -c "^## Conversa" logs/2026-10-16.md` -> **11**.
- [ ] `git ls-files --eol` depois do `git add` -> nenhuma linha com `i/crlf`; fixtures com `attr/-text`.

## Relatorio de aplicacao *(quem aplica preenche ao terminar)*

O que foi feito, edicao por edicao · a SAIDA CRUA das conferencias (numero + comando) · o que fugiu do texto literal, inclusive
comentario e formatacao · arquivos tocados · `npm run check` · oraculo e capturas · commit e push. Escreva-o DEPOIS do push.

## Commit — blocos separados, mensagem SEM acento

Se a skill `apply-wo` estiver com o hash novo, acrescente `.claude/skills/apply-wo/SKILL.md` ao `git add`.

```
git add CLAUDE.md src meta/CEREBRO.md meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/STATUS.md meta/CHANGELOG.md meta/ROADMAP.md meta/IDEAS.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md meta/workorders/261016-wo0004-normalizador-e-exportar.md
```

```
git commit -m "feat(adapter-claude): normaliza a conversa e exporta para o Lunoda" -m "Normalizador sobre o formato medido em 4 capturas reais (texto em content, pensamento por resumos, ramo atual). Botao Exportar baixa titulo.json e titulo.md, com link na descricao e IA Utilizada marcada (DEC-011). 80 testes."
```

```
git push
```
