// Pagina «Reprocessar» (DEC-017): gera os formatos marcados a partir de arquivos guardados — resposta
// bruta do Claude ou JSON do CDC —, sem buscar a conversa de novo. Abre numa aba pelo popup.
// Formatos e opcoes sao os mesmos do popup (`cdc.exportSettings`); a caixa da bruta nao existe aqui.
import { browser } from 'wxt/browser';
import { createIdGenerator } from '../../core/ids';
import { reprocessFile, reprocessFolder } from '../../popup/reprocess';
import { parseSettings, SETTINGS_KEY, type ExportSettings } from '../../popup/settings';

const $ = <T extends HTMLElement>(id: string) => document.querySelector<T>(`#${id}`)!;
const fileInput = $<HTMLInputElement>('files');
const drop = $<HTMLDivElement>('drop');
const runButton = $<HTMLButtonElement>('run');
const statusEl = $<HTMLParagraphElement>('status');
const results = $<HTMLUListElement>('results');
const boxes = {
  simpleMd: $<HTMLInputElement>('fmt-simple'),
  lunoda: $<HTMLInputElement>('fmt-lunoda'),
  cdcJson: $<HTMLInputElement>('fmt-cdc'),
  thinking: $<HTMLInputElement>('opt-thinking'),
  files: $<HTMLInputElement>('opt-files'),
};

let chosen: File[] = [];
let settings: ExportSettings = parseSettings(undefined);

function say(text: string, kind: 'info' | 'ok' | 'error' = 'info'): void {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

/** Le as caixas desta pagina, mantendo a escolha da bruta que so o popup mostra. */
function readBoxes(): ExportSettings {
  return {
    includeThinking: boxes.thinking.checked,
    includeFiles: boxes.files.checked,
    formats: {
      lunoda: boxes.lunoda.checked,
      simpleMd: boxes.simpleMd.checked,
      cdcJson: boxes.cdcJson.checked,
      raw: settings.formats.raw,
    },
  };
}

function choose(list: FileList | null): void {
  chosen = list ? Array.from(list).filter((f) => f.name.toLowerCase().endsWith('.json')) : [];
  runButton.disabled = chosen.length === 0;
  say(
    chosen.length ? `${chosen.length} arquivo(s) escolhido(s).` : 'Nenhum arquivo .json escolhido.',
  );
}

/** Baixa um texto como arquivo (caminho relativo a Downloads). */
async function download(text: string, filename: string, type: string): Promise<void> {
  const url = URL.createObjectURL(new Blob([text], { type }));
  await browser.downloads.download({ url, filename, saveAs: false });
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function addResult(text: string, error = false): void {
  const li = document.createElement('li');
  li.textContent = text;
  if (error) li.className = 'error';
  results.append(li);
}

async function main(): Promise<void> {
  const stored = await browser.storage.local.get(SETTINGS_KEY);
  settings = parseSettings(stored[SETTINGS_KEY]);
  boxes.simpleMd.checked = settings.formats.simpleMd;
  boxes.lunoda.checked = settings.formats.lunoda;
  boxes.cdcJson.checked = settings.formats.cdcJson;
  boxes.thinking.checked = settings.includeThinking;
  boxes.files.checked = settings.includeFiles;
  for (const box of Object.values(boxes)) {
    box.addEventListener('change', () => {
      settings = readBoxes();
      void browser.storage.local.set({ [SETTINGS_KEY]: settings });
    });
  }

  fileInput.addEventListener('change', () => choose(fileInput.files));
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('over');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('over');
    const dropped = e.dataTransfer?.files ?? null;
    // Arrastar nao preenche o campo de arquivo sozinho: sem isto, a pagina diz «1 arquivo escolhido»
    // ao lado de um campo que mostra «Nenhum arquivo escolhido» (visto pelo dono em 2026-11-27).
    if (dropped) fileInput.files = dropped;
    choose(dropped);
  });

  runButton.addEventListener('click', async () => {
    const s = readBoxes();
    if (!s.formats.simpleMd && !s.formats.lunoda && !s.formats.cdcJson) {
      return say('Marque ao menos um formato.', 'error');
    }
    runButton.disabled = true;
    results.replaceChildren();
    const now = new Date();
    const folder = reprocessFolder(now);
    let ok = 0;
    for (const file of chosen) {
      const r = reprocessFile(await file.text(), s, {
        newId: createIdGenerator(),
        now: now.toISOString(),
      });
      if (!r.ok) {
        addResult(`${file.name}: ${r.error}`, true);
        continue;
      }
      for (const f of r.files) await download(f.content, `${folder}/${f.filename}`, f.mime);
      ok++;
      const from = r.kind === 'raw' ? 'resposta bruta' : 'JSON do CDC';
      addResult(`${r.baseName} (${r.turns} turnos, de ${from}): ${r.files.length} arquivo(s).`);
    }
    const bad = chosen.length - ok;
    say(
      `Pronto: ${ok} de ${chosen.length} reprocessado(s) em Downloads/${folder}.` +
        (bad ? ` ${bad} com erro (veja a lista).` : ''),
      bad ? 'error' : 'ok',
    );
    runButton.disabled = false;
  });
}

void main();
