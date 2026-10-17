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
