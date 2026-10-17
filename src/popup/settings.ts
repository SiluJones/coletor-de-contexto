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
