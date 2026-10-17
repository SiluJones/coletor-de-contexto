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
