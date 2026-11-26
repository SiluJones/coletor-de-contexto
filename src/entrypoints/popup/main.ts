// Popup da extensao (F1 + F2). Reconhece a conversa do Claude e oferece:
// - «Exportar»: baixa os formatos marcados — Markdown simples, resposta bruta, Lunoda, JSON do CDC
//   (DEC-011, DEC-012, DEC-015); a bruta sai primeiro, como veio da API;
// - «Copiar conversa» / «Copiar última resposta»: poe o texto na area de transferencia (DEC-013).
// Formatos e opcoes ficam lembrados em chrome.storage.local.
import { browser } from 'wxt/browser';
import { fetchClaudeConversationRaw } from '../../adapters/claude/fetch-raw';
import { ClaudeFormatError } from '../../adapters/claude/normalize';
import { parseClaudeConversationUrl } from '../../adapters/claude/url';
import { createIdGenerator } from '../../core/ids';
import { buildCopyText, type CopyKind } from '../../popup/copy';
import { buildExportDownloads } from '../../popup/export';
import { rawDownloadFile, summarizeRaw } from '../../popup/raw-dump';
import {
  needsNormalization,
  parseSettings,
  SETTINGS_KEY,
  type ExportSettings,
} from '../../popup/settings';

const $ = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;
const statusEl = $<HTMLParagraphElement>('status');
const controls = $<HTMLDivElement>('controls');
const exportButton = $<HTMLButtonElement>('export');
const copyConversationButton = $<HTMLButtonElement>('copy-conversation');
const copyLastButton = $<HTMLButtonElement>('copy-last');
const actionButtons = [exportButton, copyConversationButton, copyLastButton];
const boxes = {
  lunoda: $<HTMLInputElement>('fmt-lunoda'),
  simpleMd: $<HTMLInputElement>('fmt-simple'),
  cdcJson: $<HTMLInputElement>('fmt-cdc'),
  raw: $<HTMLInputElement>('fmt-raw'),
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
      raw: boxes.raw.checked,
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
  boxes.raw.checked = s.formats.raw;
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

  /** A resposta bruta ja foi salva nesta acao? Muda a dica quando o formato do site mudou. */
  let rawSaved = false;

  /** Roda uma acao com os botoes travados e erro inesperado no popup. */
  const run = (action: () => Promise<void>) => async () => {
    for (const b of actionButtons) b.disabled = true;
    rawSaved = false;
    say('Buscando a conversa…');
    try {
      await action();
    } catch (err) {
      const hint = !(err instanceof ClaudeFormatError)
        ? ''
        : rawSaved
          ? ' A resposta bruta foi salva em Downloads/cdc-raw: leve-a ao chat.'
          : ' Exporte só a «Resposta bruta» e leve-a ao chat.';
      say(`${err instanceof Error ? err.message : String(err)}.${hint}`, 'error');
    } finally {
      for (const b of actionButtons) b.disabled = false;
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
      const now = new Date();
      // A bruta sai PRIMEIRO: se o formato do site mudou e o normalizador falhar abaixo, ela ja
      // esta salva — e e justamente o que o chat precisa para consertar (DEC-015).
      if (settings.formats.raw) {
        const f = rawDownloadFile(text, conversationId, now, summary.title);
        await download(f.content, f.filename, f.mime);
        rawSaved = true;
      }
      if (!needsNormalization(settings.formats)) {
        return say(`Exportado: resposta bruta (${summary.kb} KB) em Downloads/cdc-raw.`, 'ok');
      }
      const out = buildExportDownloads(JSON.parse(text), settings, {
        newId: createIdGenerator(),
        now: now.toISOString(),
      });
      for (const f of out.files) await download(f.content, f.filename, f.mime);
      const count = out.files.length + (rawSaved ? 1 : 0);
      say(`Exportado: ${count} arquivo(s) de «${out.baseName}» (${out.turns} turnos).`, 'ok');
    }),
  );

  /** Copia o texto pedido. Le o texto antes de escrever: a area de transferencia so muda se der certo. */
  const copy = (kind: CopyKind) =>
    run(async () => {
      const text = await fetchRaw(tabId, conversationId);
      if (text === null) return;
      const summary = summarizeRaw(text);
      if (!summary.ok) return say(summary.error, 'error');
      const out = buildCopyText(JSON.parse(text), kind, readBoxes(), {
        now: new Date().toISOString(),
      });
      if (out.text === null) return say('A conversa ainda não tem resposta da IA.', 'error');
      await navigator.clipboard.writeText(out.text);
      const what = kind === 'conversation' ? `conversa (${out.turns} turnos)` : 'última resposta';
      say(`Copiado: ${what}, ${out.text.length} caracteres.`, 'ok');
    });
  copyConversationButton.addEventListener('click', copy('conversation'));
  copyLastButton.addEventListener('click', copy('lastReply'));
}

void main();
