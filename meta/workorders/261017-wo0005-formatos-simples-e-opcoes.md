# WO 0005 — formatos «simples» e opcoes no popup (F2, primeira leva)

> **Tipo:** CODIGO (dois exportadores novos, preferencias, popup) + versionar os docs que o chat ja gravou.
> **Config sugerida:** Sonnet · `/effort` medio. Codigo pronto e testado; o julgamento e parar no vermelho.
> **Pre-requisito:** HEAD `f5754c8` (`feat(adapter-claude): normaliza a conversa e exporta para o Lunoda`) em `main`, igual a
> `origin/main`. Antes de aplicar, `git status --short` mostra EXATAMENTE:
> ```
>  M .claude/skills/apply-wo/SKILL.md
>  M meta/CHANGELOG.md
>  M meta/CONTEXT.md
>  M meta/DECISIONS.md
>  M meta/GLOSSARY.md
>  M meta/IDEAS.md
>  M meta/ROADMAP.md
>  M meta/STATUS.md
> ?? logs/2026-10-17.md
> ?? meta/workorders/261017-wo0005-formatos-simples-e-opcoes.md
> ?? specs/261017-f2-opcoes-e-formatos.md
> ```
> Mais alguma coisa: **PARE e reporte** — e grave o relatorio em arquivo ANTES do menu (`CLAUDE.md`, «Relatório em arquivo»).
> **Base:** conversa de chat de 2026-10-17 (Conversa 1 do log): o dono fechou a F1 e pediu a F2 com os formatos simples.
> Spec: `specs/261017-f2-opcoes-e-formatos.md`. Decisao: DEC-012.
> **Arquivos que o chat gravou no disco e esta WO versiona** (Edicao 0 confere; hash diferente: PARE):
> - `meta/CHANGELOG.md` — `0df6e7bf5e2542739a57deaa7bec661f58ebde63`
> - `meta/CONTEXT.md` — `7e83fcbc2a034a107208df272780d4710e33baec`
> - `meta/DECISIONS.md` — `841f9eb27b8d5b6bda79cd1d0b5dcec9b090a446`
> - `meta/GLOSSARY.md` — `7adadc85e4a7065ff21a13b9e627347fca98a8d8`
> - `meta/IDEAS.md` — `85021b43845d17c8b6df5cf80c77c30f39b162bc`
> - `meta/ROADMAP.md` — `551659690dc9dfc6f08ad95a1c25c85744239a71`
> - `meta/STATUS.md` — `ed4dc7f5cc1332ba4707df192369e6c5f4cf83cb`
> - `specs/261017-f2-opcoes-e-formatos.md` — `3a8617d939f4e9b1b123d52162f751d4eb0b19e2`
> - `logs/2026-10-17.md` — `d814ce7f8b19fd3b90f043daf1139430d87bdda0` (antes da Edicao 5, que acrescenta a sua secao)
> - `.claude/skills/apply-wo/SKILL.md` — `7d4613840aac0e107158633a32499a6057cfb1ce` (a skill nova que o dono copiou na wo0004)
> **Arquivos de codigo que esta WO muda** (Edicao 0 confere; hash diferente = alguem mexeu depois do chat ler: PARE):
> - `src/entrypoints/popup/index.html` — `ac1b7faa7a73ee4dc9800e1d43f1917859fe2749` (substituido inteiro)
> - `src/entrypoints/popup/main.ts` — `61fa10fb3e08310c45f0239e640cfff9e4b49599` (substituido inteiro)
> - `src/popup/export.ts` — `89b0036ef1d77cb17b468cfcd0b0569b5c4a3f31` (substituido inteiro)
> - `src/popup/export.test.ts` — `558aa04732bb07288b956e9584c5ad42298218f7` (substituido inteiro)
> - `src/core/model.ts` — `483e67c9890e2ebf702d77f1d4b7eff449b9d703` (edicao ancorada)
> - `src/adapters/claude/normalize.ts` — `c5060547ab32ff72cec8e3e5e6318c622420987d` (edicao ancorada)
> - `wxt.config.ts` — `5c490e9f6bb86e9880fad181151a78850cf7f9d1` (edicao ancorada)
> **Ancora semantica:** se um trecho-ancora nao bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar proximo.
> **Ancoras lidas em:** neste turno de chat, nos arquivos em `f5754c8` (hashes acima).
> **Simulado:** o chat aplicou esta WO, a partir do proprio texto, numa copia limpa do repo em `f5754c8`: `npm run check` verde
> (`Tests  90 passed | 2 skipped (92)`); oraculo do Lunoda com os 5 pares do disco do dono (`Tests  9 passed (9)`); capturas
> reais com as 5 do disco do dono (`Tests  18 passed (18)`); as 4 fixtures antigas com o mesmo hash; as 2 novas com os hashes da
> Edicao 4. O manifesto gerado tem `"permissions":["activeTab","scripting","downloads","storage"]`.
> **Nao testado:** o popup no navegador (caixas, storage, 4 downloads) — e do dono, no roteiro do chat.
> **Canal dos meta neste ciclo = CHAT.** Todos os docs ja estao gravados (Edicao 0 confere) — nao os edite, exceto a Edicao 5 (a
> SUA secao no fim do log de hoje).

---

## 1. Por que

O dono pediu formatos «original/simples», em `.md` e `.json`, alem do par do Lunoda, e a F2 previa as opcoes de pensamento e
arquivos no popup. Esta WO entrega os dois: um Markdown para ler, um JSON do proprio CDC com a conversa inteira (arquivo de guarda)
e caixas de formato e de opcao lembradas entre usos (DEC-012). O padrao do primeiro uso continua o da F1 (so Lunoda).

## 2. Contexto factual

- **[relatado pelo dono, 2026-10-17]** exportou «CDC 1» pelo botao da F1 e o Lunoda importou: F1 fechada.
- **[medido pelo chat]** com o padrao, `buildExportDownloads` gera exatamente os 2 arquivos de `buildLunodaExport` (teste novo);
  as fixtures `sintetico-claude.lunoda.*` e `lunoda/sintetico.*` nao mudam.
- **[medido]** os 3 formatos rodados sobre as 5 capturas reais do dono sem erro; «CDC 1» sai com 7 turnos e
  `IA: Claude (claude-opus-5-5)` no Markdown simples.

---

## Edicao 0 — conferencia antes de tudo (nao edita nada)

```
git log -1 --oneline
git status --short
sha1sum meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md specs/261017-f2-opcoes-e-formatos.md logs/2026-10-17.md .claude/skills/apply-wo/SKILL.md
sha1sum src/entrypoints/popup/index.html src/entrypoints/popup/main.ts src/popup/export.ts src/popup/export.test.ts src/core/model.ts src/adapters/claude/normalize.ts wxt.config.ts
sha1sum src/tests/fixtures/claude/sintetico-claude.lunoda.json src/tests/fixtures/claude/sintetico-claude.lunoda.md src/tests/fixtures/lunoda/sintetico.json src/tests/fixtures/lunoda/sintetico.md
ls ../oraculo-lunoda ../capturas-claude/cdc-raw
```

Esperado: `f5754c8 …`; o `status` e os 17 hashes do cabecalho; as 4 fixtures com os hashes da Edicao 4; `oraculo-lunoda` com 10
arquivos (5 pares); `cdc-raw` com 5 `.json`. Divergiu: PARE.

---

## Edicao 1 — substituir 4 arquivos inteiros

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
      fieldset {
        border: 1px solid #d0d7de;
        border-radius: 6px;
        margin: 8px 0 0;
        padding: 4px 10px 8px;
      }
      legend {
        font-size: 11px;
        color: #57606a;
      }
      label {
        display: block;
        margin-top: 3px;
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
        margin-top: 8px;
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
    <div id="controls" hidden>
      <fieldset>
        <legend>Formatos</legend>
        <label><input type="checkbox" id="fmt-lunoda" /> Lunoda (.json + .md)</label>
        <label><input type="checkbox" id="fmt-simple" /> Markdown simples (.md)</label>
        <label
          ><input type="checkbox" id="fmt-cdc" /> JSON do CDC (.cdc.json, conversa inteira)</label
        >
      </fieldset>
      <fieldset>
        <legend>Incluir</legend>
        <label><input type="checkbox" id="opt-thinking" /> Pensamento (resumos)</label>
        <label><input type="checkbox" id="opt-files" /> Lista de arquivos</label>
      </fieldset>
      <button id="export" type="button">Exportar</button>
      <button id="raw" type="button" class="secondary">Salvar resposta bruta (depuração)</button>
    </div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### `src/entrypoints/popup/main.ts`

```ts
// Popup da extensao (F1 + F2). Reconhece a conversa do Claude e oferece:
// - «Exportar»: baixa os formatos marcados (Lunoda, Markdown simples, JSON do CDC — DEC-011, DEC-012);
// - «Salvar resposta bruta (depuracao)»: baixa a resposta da API como veio (DEC-010).
// Formatos e opcoes ficam lembrados em chrome.storage.local.
import { browser } from 'wxt/browser';
import { fetchClaudeConversationRaw } from '../../adapters/claude/fetch-raw';
import { ClaudeFormatError } from '../../adapters/claude/normalize';
import { parseClaudeConversationUrl } from '../../adapters/claude/url';
import { createIdGenerator } from '../../core/ids';
import { buildExportDownloads } from '../../popup/export';
import { rawDumpFilename, summarizeRaw } from '../../popup/raw-dump';
import { parseSettings, SETTINGS_KEY, type ExportSettings } from '../../popup/settings';

const $ = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;
const statusEl = $<HTMLParagraphElement>('status');
const controls = $<HTMLDivElement>('controls');
const exportButton = $<HTMLButtonElement>('export');
const rawButton = $<HTMLButtonElement>('raw');
const boxes = {
  lunoda: $<HTMLInputElement>('fmt-lunoda'),
  simpleMd: $<HTMLInputElement>('fmt-simple'),
  cdcJson: $<HTMLInputElement>('fmt-cdc'),
  thinking: $<HTMLInputElement>('opt-thinking'),
  files: $<HTMLInputElement>('opt-files'),
};

function say(text: string, kind: 'info' | 'ok' | 'error' = 'info'): void {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

/** Le as caixas marcadas. */
function readBoxes(): ExportSettings {
  return {
    includeThinking: boxes.thinking.checked,
    includeFiles: boxes.files.checked,
    formats: {
      lunoda: boxes.lunoda.checked,
      simpleMd: boxes.simpleMd.checked,
      cdcJson: boxes.cdcJson.checked,
    },
  };
}

/** Marca as caixas conforme as preferencias. */
function writeBoxes(s: ExportSettings): void {
  boxes.thinking.checked = s.includeThinking;
  boxes.files.checked = s.includeFiles;
  boxes.lunoda.checked = s.formats.lunoda;
  boxes.simpleMd.checked = s.formats.simpleMd;
  boxes.cdcJson.checked = s.formats.cdcJson;
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

  // Preferencias: lidas uma vez, salvas a cada mudanca de caixa.
  const stored = await browser.storage.local.get(SETTINGS_KEY);
  writeBoxes(parseSettings(stored[SETTINGS_KEY]));
  for (const box of Object.values(boxes)) {
    box.addEventListener('change', () => {
      void browser.storage.local.set({ [SETTINGS_KEY]: readBoxes() });
    });
  }

  say(`Conversa ${conversationId.slice(0, 8)}… encontrada.`);
  controls.hidden = false;

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
      const settings = readBoxes();
      if (!Object.values(settings.formats).some(Boolean)) {
        return say('Marque ao menos um formato.', 'error');
      }
      const text = await fetchRaw(tabId, conversationId);
      if (text === null) return;
      const summary = summarizeRaw(text);
      if (!summary.ok) return say(summary.error, 'error');
      const out = buildExportDownloads(JSON.parse(text), settings, {
        newId: createIdGenerator(),
        now: new Date().toISOString(),
      });
      for (const f of out.files) await download(f.content, f.filename, f.mime);
      say(
        `Exportado: ${out.files.length} arquivo(s) de «${out.baseName}» (${out.turns} turnos).`,
        'ok',
      );
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

### `src/popup/export.ts`

```ts
/**
 * Exportacao do botao «Exportar»: resposta bruta -> arquivos dos formatos escolhidos (DEC-011, DEC-012).
 * Parte pura (sem navegador), para ser testada de ponta a ponta.
 */

import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { safeFileName } from '../core/filename';
import type { Conversation, ExportOptions } from '../core/model';
import { renderCdcJson } from '../exporters/cdc-json';
import {
  buildLunodaDocument,
  buildLunodaEntry,
  type BuildContext,
} from '../exporters/lunoda-build';
import { renderLunodaJson } from '../exporters/lunoda-json';
import { renderLunodaMd } from '../exporters/lunoda-md';
import { renderSimpleMarkdown } from '../exporters/simple-md';
import type { ExportSettings } from './settings';

/** Os dois arquivos do Lunoda e o nome-base (titulo da conversa, seguro para o Windows). */
export interface ExportFiles {
  baseName: string;
  json: string;
  md: string;
  turns: number;
}

/** Um arquivo a baixar. */
export interface DownloadFile {
  filename: string;
  content: string;
  mime: string;
}

function lunodaFiles(
  conversation: Conversation,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): { json: string; md: string } {
  const entry = buildLunodaEntry(conversation, options, ctx);
  const doc = buildLunodaDocument([entry]);
  return { json: renderLunodaJson(doc), md: renderLunodaMd(entry, doc.properties, timeZone) };
}

/**
 * Gera os arquivos do Lunoda a partir da resposta bruta do Claude.
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildLunodaExport(
  raw: unknown,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): ExportFiles {
  const conversation = normalizeClaudeConversation(raw);
  return {
    baseName: safeFileName(conversation.title),
    ...lunodaFiles(conversation, options, ctx, timeZone),
    turns: conversation.turns.length,
  };
}

/**
 * Monta TODOS os arquivos dos formatos marcados, com nomes que comecam pelo titulo da conversa:
 * `<titulo>.json` + `<titulo>.md` (Lunoda), `<titulo> (simples).md` e `<titulo>.cdc.json`.
 * Nenhum formato marcado -> lista vazia (o popup avisa).
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildExportDownloads(
  raw: unknown,
  settings: ExportSettings,
  ctx: BuildContext,
  timeZone?: string,
): { baseName: string; turns: number; files: DownloadFile[] } {
  const conversation = normalizeClaudeConversation(raw);
  const baseName = safeFileName(conversation.title);
  const files: DownloadFile[] = [];
  if (settings.formats.lunoda) {
    const { json, md } = lunodaFiles(conversation, settings, ctx, timeZone);
    files.push({ filename: `${baseName}.json`, content: json, mime: 'application/json' });
    files.push({ filename: `${baseName}.md`, content: md, mime: 'text/markdown' });
  }
  if (settings.formats.simpleMd) {
    files.push({
      filename: `${baseName} (simples).md`,
      content: renderSimpleMarkdown(conversation, settings, { now: ctx.now, timeZone }),
      mime: 'text/markdown',
    });
  }
  if (settings.formats.cdcJson) {
    files.push({
      filename: `${baseName}.cdc.json`,
      content: renderCdcJson(conversation, ctx.now),
      mime: 'application/json',
    });
  }
  return { baseName, turns: conversation.turns.length, files };
}
```

### `src/popup/export.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS } from '../core/model';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW, syntheticIds } from '../tests/synthetic-conversation';
import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { buildExportDownloads, buildLunodaExport } from './export';
import { DEFAULT_SETTINGS } from './settings';

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

describe('buildExportDownloads (formatos escolhidos)', () => {
  const ctx = () => ({ newId: syntheticIds(), now: SYNTHETIC_NOW });
  const all = {
    includeThinking: true,
    includeFiles: true,
    formats: { lunoda: true, simpleMd: true, cdcJson: true },
  };
  const out = buildExportDownloads(
    structuredClone(SYNTHETIC_CLAUDE_RAW),
    all,
    ctx(),
    'America/Sao_Paulo',
  );
  const byName = (suffix: string) => out.files.find((f) => f.filename.endsWith(suffix))!;

  it('todos os formatos -> 4 arquivos com o titulo na frente', () => {
    expect(out.files.map((f) => [f.filename, f.mime])).toEqual([
      ['Sintética 1 — contar palavras.json', 'application/json'],
      ['Sintética 1 — contar palavras.md', 'text/markdown'],
      ['Sintética 1 — contar palavras (simples).md', 'text/markdown'],
      ['Sintética 1 — contar palavras.cdc.json', 'application/json'],
    ]);
  });

  it('padrao do primeiro uso -> so os 2 do Lunoda, iguais aos do buildLunodaExport', () => {
    const d = buildExportDownloads(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      DEFAULT_SETTINGS,
      ctx(),
      'America/Sao_Paulo',
    );
    const l = buildLunodaExport(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      DEFAULT_SETTINGS,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(d.files.map((f) => f.content)).toEqual([l.json, l.md]);
  });

  it('nenhum formato marcado -> nenhum arquivo', () => {
    const none = { ...all, formats: { lunoda: false, simpleMd: false, cdcJson: false } };
    expect(buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), none, ctx()).files).toEqual(
      [],
    );
  });

  it('markdown simples bate com a fixture', async () => {
    await expect(byName('(simples).md').content).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.simples.md',
    );
  });

  it('JSON do CDC bate com a fixture e devolve a conversa inteira', async () => {
    const cdc = byName('.cdc.json').content;
    await expect(cdc).toMatchFileSnapshot('../tests/fixtures/claude/sintetico-claude.cdc.json');
    const parsed = JSON.parse(cdc);
    expect(parsed).toMatchObject({
      format: 'coletor-de-contexto',
      version: 1,
      exportedAt: SYNTHETIC_NOW,
    });
    expect(parsed.conversation).toEqual(
      normalizeClaudeConversation(structuredClone(SYNTHETIC_CLAUDE_RAW)),
    );
  });

  it('JSON do CDC ignora as opcoes: pensamento e arquivos vao sempre', () => {
    const lean = { ...all, includeThinking: false, includeFiles: false };
    const cdc = buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), lean, ctx()).files.find(
      (f) => f.filename.endsWith('.cdc.json'),
    )!;
    expect(cdc.content).toContain('Lendo o anexo.');
    expect(cdc.content).toContain('notas.txt');
  });
});
```

---

## Edicao 2 — tres edicoes ancoradas

Cada **Ancora** aparece UMA vez no arquivo; troque-a pelo **Substituir por**.

### `src/core/model.ts`

**Ancora:**

```
  title: string;
  url: string;
  /** ISO 8601 UTC. */
```

**Substituir por:**

```
  title: string;
  url: string;
  /** Modelo informado pela plataforma (ex.: "claude-opus-…"), quando vier. */
  model?: string;
  /** ISO 8601 UTC. */
```

### `src/adapters/claude/normalize.ts`

**Ancora:**

```
    url: `https://claude.ai/chat/${uuid}`,
    createdAt,
```

**Substituir por:**

```
    url: `https://claude.ai/chat/${uuid}`,
    ...(typeof raw.model === 'string' && raw.model ? { model: raw.model } : {}),
    createdAt,
```

### `wxt.config.ts` (1 de 2)

**Ancora:**

```
// Configuracao do WXT. Permissoes minimas (DEC-007, DEC-010): `activeTab` + `scripting` rodam a
// busca dentro da aba do Claude so quando o usuario abre o popup; `downloads` salva os arquivos.
// Nenhuma host_permission permanente.
```

**Substituir por:**

```
// Configuracao do WXT. Permissoes minimas (DEC-007, DEC-010, DEC-012): `activeTab` + `scripting`
// rodam a busca dentro da aba do Claude so quando o usuario abre o popup; `downloads` salva os
// arquivos; `storage` lembra formatos e opcoes do popup. Nenhuma host_permission permanente.
```

### `wxt.config.ts` (2 de 2)

**Ancora:**

```
    permissions: ['activeTab', 'scripting', 'downloads'],
```

**Substituir por:**

```
    permissions: ['activeTab', 'scripting', 'downloads', 'storage'],
```

---

## Edicao 3 — criar 4 arquivos novos

**Criar arquivo novo** em cada caminho. Se algum ja existir: PARE. As fixtures NAO se escrevem a mao: a Edicao 4 as grava.

### `src/exporters/simple-md.ts`

```ts
/**
 * «Markdown simples»: a conversa para LER (DEC-012). Sem marcadores do Lunoda, sem IDs.
 *
 *   # <titulo>
 *   - Link, IA, modelo, criada em, exportada em, turnos
 *   ---
 *   ## Você · 1
 *   <pedido>
 *   ## Claude · 1
 *   [### Pensamento (resumo)]
 *   <resposta>
 *   ---
 *
 * O texto de pedido e resposta entra como veio (markdown); por isso os titulos da conversa usam `##`
 * e o texto pode ter os seus proprios titulos dentro. Pensamento e listas de arquivos seguem as
 * mesmas opcoes do Lunoda.
 */

import { formatLunodaLocal } from '../core/dates';
import type { Conversation, ExportOptions, FileRef } from '../core/model';
import { PLATFORM_LABEL } from '../core/model';
import { formatFileSize } from './lunoda-build';

/** Dados da exportacao que nao estao na conversa. */
export interface SimpleMdContext {
  /** Instante da exportacao (ISO 8601 UTC). */
  now: string;
  /** Fuso das datas; omitido = fuso do ambiente. */
  timeZone?: string;
}

function fileList(heading: string, files: FileRef[]): string[] {
  if (files.length === 0) return [];
  return [
    `**${heading}:**`,
    ...files.map(
      (f) =>
        `- \`${f.name}\` — ${f.kind}${f.size === undefined ? '' : `, ${formatFileSize(f.size)}`}`,
    ),
    '',
  ];
}

/**
 * Gera o Markdown simples de uma conversa.
 * @param c conversa normalizada.
 * @param options pensamento e listas de arquivos (as mesmas do Lunoda).
 * @param ctx instante da exportacao e fuso.
 */
export function renderSimpleMarkdown(
  c: Conversation,
  options: ExportOptions,
  ctx: SimpleMdContext,
): string {
  const ai = PLATFORM_LABEL[c.platform];
  const when = (iso: string) => formatLunodaLocal(iso, ctx.timeZone);
  const lines: string[] = [
    `# ${c.title}`,
    '',
    `- **Link:** ${c.url}`,
    `- **IA:** ${ai}${c.model ? ` (${c.model})` : ''}`,
    `- **Criada em:** ${when(c.createdAt)} · **Exportada em:** ${when(ctx.now)}`,
    `- **Turnos:** ${c.turns.length}`,
    '',
  ];
  for (const t of c.turns) {
    lines.push('---', '', `## Você · ${t.index}`, '');
    if (t.user.text) lines.push(t.user.text, '');
    if (options.includeFiles) lines.push(...fileList('Arquivos anexados', t.user.attachments));
    const r = t.assistant;
    if (!r) continue;
    lines.push(`## ${ai} · ${t.index}`, '');
    if (options.includeThinking && r.thinking.length > 0) {
      lines.push('### Pensamento (resumo)', '', r.thinking.join('\n\n'), '');
    }
    if (r.text) lines.push(r.text, '');
    if (options.includeFiles) lines.push(...fileList('Arquivos gerados', r.generated));
  }
  return lines.join('\n');
}
```

### `src/exporters/cdc-json.ts`

```ts
/**
 * «JSON do CDC»: a conversa normalizada INTEIRA, com tudo que foi capturado (DEC-012).
 *
 * E o formato de arquivo do proprio projeto: serve para guardar e para reprocessar depois (gerar outro
 * formato sem buscar a conversa de novo). Por isso ignora as opcoes de exportacao — pensamento e
 * arquivos vao sempre. O envelope tem nome e versao do formato para leitores futuros saberem o que
 * estao lendo.
 */

import type { Conversation } from '../core/model';

/** Nome do formato no envelope. */
export const CDC_FORMAT = 'coletor-de-contexto';
/** Versao do formato. Mude so com mudanca incompativel do modelo canonico (e registre em DECISIONS). */
export const CDC_FORMAT_VERSION = 1;

/** Envelope do arquivo. */
export interface CdcFile {
  format: typeof CDC_FORMAT;
  version: typeof CDC_FORMAT_VERSION;
  /** Instante da exportacao (ISO 8601 UTC). */
  exportedAt: string;
  conversation: Conversation;
}

/**
 * Serializa a conversa no formato do CDC: 2 espacos de indentacao e quebra de linha no fim.
 * @param conversation conversa normalizada.
 * @param exportedAt instante da exportacao (ISO 8601 UTC).
 */
export function renderCdcJson(conversation: Conversation, exportedAt: string): string {
  const file: CdcFile = {
    format: CDC_FORMAT,
    version: CDC_FORMAT_VERSION,
    exportedAt,
    conversation,
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}
```

### `src/popup/settings.ts`

```ts
/**
 * Preferencias de exportacao do popup, lembradas entre usos em `chrome.storage.local` (DEC-012).
 * Parte pura: leitura tolerante e valores padrao. O acesso ao storage fica no popup.
 */

import { DEFAULT_EXPORT_OPTIONS, type ExportOptions } from '../core/model';

/** Formatos que o botao «Exportar» baixa. */
export interface ExportFormats {
  /** `.json` + `.md` do Lunoda. */
  lunoda: boolean;
  /** Markdown simples, para ler. */
  simpleMd: boolean;
  /** JSON do CDC: a conversa inteira, para guardar e reprocessar. */
  cdcJson: boolean;
}

/** Tudo o que o popup lembra. */
export interface ExportSettings extends ExportOptions {
  formats: ExportFormats;
}

/** Chave no `chrome.storage.local`. */
export const SETTINGS_KEY = 'cdc.exportSettings';

/** Primeiro uso: so o Lunoda, sem pensamento, com arquivos (DEC-008). */
export const DEFAULT_SETTINGS: Readonly<ExportSettings> = Object.freeze({
  ...DEFAULT_EXPORT_OPTIONS,
  formats: Object.freeze({ lunoda: true, simpleMd: false, cdcJson: false }),
});

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

/**
 * Le preferencias salvas, completando com o padrao o que faltar ou vier com tipo errado.
 * Nunca lanca: preferencia quebrada nao pode travar a exportacao.
 */
export function parseSettings(raw: unknown): ExportSettings {
  const o = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const f =
    typeof o.formats === 'object' && o.formats !== null
      ? (o.formats as Record<string, unknown>)
      : {};
  const d = DEFAULT_SETTINGS;
  return {
    includeThinking: bool(o.includeThinking, d.includeThinking),
    includeFiles: bool(o.includeFiles, d.includeFiles),
    formats: {
      lunoda: bool(f.lunoda, d.formats.lunoda),
      simpleMd: bool(f.simpleMd, d.formats.simpleMd),
      cdcJson: bool(f.cdcJson, d.formats.cdcJson),
    },
  };
}
```

### `src/popup/settings.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings } from './settings';

describe('parseSettings', () => {
  it('sem nada salvo -> padrao do primeiro uso (so Lunoda, sem pensamento, com arquivos)', () => {
    expect(parseSettings(undefined)).toEqual({
      includeThinking: false,
      includeFiles: true,
      formats: { lunoda: true, simpleMd: false, cdcJson: false },
    });
  });

  it('le o que foi salvo', () => {
    const saved = {
      includeThinking: true,
      includeFiles: false,
      formats: { lunoda: false, simpleMd: true, cdcJson: true },
    };
    expect(parseSettings(saved)).toEqual(saved);
  });

  it('completa campo ausente ou com tipo errado com o padrao, sem lancar', () => {
    expect(parseSettings({ includeThinking: 'sim', formats: { simpleMd: true } })).toEqual({
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: true, cdcJson: false },
    });
    expect(parseSettings('lixo')).toEqual(parseSettings(undefined));
  });

  it('o padrao nao pode ser alterado por engano', () => {
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true);
    expect(Object.isFrozen(DEFAULT_SETTINGS.formats)).toBe(true);
  });
});
```

---

## Edicao 4 — gravar as fixtures novas e validar

```
npx vitest run src/popup/export.test.ts --update
sha1sum src/tests/fixtures/claude/sintetico-claude.simples.md src/tests/fixtures/claude/sintetico-claude.cdc.json src/tests/fixtures/claude/sintetico-claude.lunoda.json src/tests/fixtures/claude/sintetico-claude.lunoda.md src/tests/fixtures/lunoda/sintetico.json src/tests/fixtures/lunoda/sintetico.md
npm run check
CDC_LUNODA_ORACLE_DIR=../oraculo-lunoda npx vitest run src/exporters/lunoda-golden.test.ts
CDC_CLAUDE_CAPTURES_DIR=../capturas-claude/cdc-raw npx vitest run src/adapters/claude/normalize.test.ts
```

- O `--update` grava as 2 fixtures novas. **A flag vai DEPOIS do caminho** (armadilha 16 do CONTEXT).
  Saida esperada: `Snapshots  2 written` e `Tests  10 passed (10)`.
- Hashes esperados (as 2 primeiras sao novas; as 4 seguintes NAO podem mudar):

  - `src/tests/fixtures/claude/sintetico-claude.simples.md` — `8649505b142b64a8bf038c87ebce687ea949858d`
  - `src/tests/fixtures/claude/sintetico-claude.cdc.json` — `425657312fd69ae65005367b189a6f121922b129`
  - `src/tests/fixtures/claude/sintetico-claude.lunoda.json` — `80f07850c6c45d056d9b1e449c142fb786ad1b7b`
  - `src/tests/fixtures/claude/sintetico-claude.lunoda.md` — `16d6508a4dba4cdda14997c927c27b9f05ad6483`
  - `src/tests/fixtures/lunoda/sintetico.json` — `36eb528d38af5da3d54d1f540023bd5237208f98`
  - `src/tests/fixtures/lunoda/sintetico.md` — `0251a6ab4dc513da739da728e9a4ac30cffffe1e`
- `npm run check`: 0 erros, `Tests  90 passed | 2 skipped (92)`.
- Oraculo: `Tests  9 passed (9)`. Capturas: `Tests  18 passed (18)`.
- Qualquer hash diferente, fixture antiga mudada ou numero diferente: PARE (relatorio antes do menu).

---

## Edicao 5 — `logs/2026-10-17.md` · a SUA secao, no fim

Acrescente no FIM do arquivo (depois de `## Conversa 1 — chat — ...`, sem tocar nela) a secao
`## Conversa 2 — Code — aplicacao da wo0005`, no formato de `meta/LOG-TEMPLATE.md`, com o que aconteceu DE FATO.

---

## Fora de escopo

- Conteudo dos artefatos gerados, copiar para a area de transferencia, nome configuravel: proximas levas da F2.
- Reprocessar a partir do `.cdc.json`: ideia (IDEAS).
- Qualquer doc alem da Edicao 5: o chat ja gravou.
- Copiar captura, exportacao real ou par do oraculo para dentro do repo (DEC-009).

## Armadilhas desta WO

- **`--update` no fim do comando, e so no `export.test.ts`:** antes do caminho ele o engole e roda a suite inteira, regravando
  qualquer fixture divergente. Os 6 hashes logo depois sao a prova.
- **Funcao injetada:** `fetch-raw.ts` nao muda; o `main.ts` novo continua passando `fetchClaudeConversationRaw` ao `executeScript`
  (armadilha 14).
- **Prettier:** o texto desta WO ja saiu do `prettier --write` do repo; se o `format:check` reprovar, e desvio de copia — PARE.

---

## Depois de aplicar — conferencia antes do commit

- [ ] `git status --short` mostra exatamente: ` M` `.claude/skills/apply-wo/SKILL.md`, os 7 docs ` M` do cabecalho, os 4 da
      Edicao 1, os 3 da Edicao 2; `??` `logs/2026-10-17.md`, `specs/261017-f2-opcoes-e-formatos.md`, esta WO, os 4 da Edicao 3 e
      as 2 fixtures novas. Diferente: PARE.
- [ ] `find src -type f | wc -l` -> **38** (32 + 4 novos + 2 fixtures).
- [ ] `grep -c "^## DEC-" meta/DECISIONS.md` -> **12**.
- [ ] `grep -c "^## Conversa" logs/2026-10-17.md` -> **2**.
- [ ] `git ls-files --eol` depois do `git add` -> nenhuma linha com `i/crlf`; fixtures com `attr/-text`.

## Relatorio de aplicacao *(quem aplica preenche ao terminar)*

O que foi feito, edicao por edicao · a SAIDA CRUA das conferencias (numero + comando) · o que fugiu do texto literal, inclusive
comentario e formatacao · arquivos tocados · `npm run check` · oraculo e capturas · commit e push. Escreva-o DEPOIS do push.

## Commit — blocos separados, mensagem SEM acento

```
git add .claude/skills/apply-wo/SKILL.md src wxt.config.ts meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md specs/261017-f2-opcoes-e-formatos.md logs/2026-10-17.md meta/workorders/261017-wo0005-formatos-simples-e-opcoes.md
```

```
git commit -m "feat(popup): formatos simples e opcoes lembradas" -m "Markdown simples e JSON do CDC com a conversa inteira, escolhidos em caixas no popup junto com pensamento e arquivos; preferencias em chrome.storage.local, permissao storage (DEC-012). Skill apply-wo com relatorio tambem na parada. 90 testes."
```

```
git push
```
