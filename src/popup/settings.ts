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
  /** JSON do CDC: a conversa normalizada inteira. */
  cdcJson: boolean;
  /** Resposta bruta da API, como veio: o unico formato sem perda (DEC-015). */
  raw: boolean;
}

/** Tudo o que o popup lembra. */
export interface ExportSettings extends ExportOptions {
  formats: ExportFormats;
}

/** Chave no `chrome.storage.local`. */
export const SETTINGS_KEY = 'cdc.exportSettings';

/** Primeiro uso: Markdown simples + resposta bruta (DEC-015), sem pensamento, com arquivos (DEC-008). */
export const DEFAULT_SETTINGS: Readonly<ExportSettings> = Object.freeze({
  ...DEFAULT_EXPORT_OPTIONS,
  formats: Object.freeze({ lunoda: false, simpleMd: true, cdcJson: false, raw: true }),
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
      raw: bool(f.raw, d.formats.raw),
    },
  };
}

/**
 * Algum formato marcado precisa da conversa normalizada? A resposta bruta sozinha nao precisa:
 * ela sai como veio, mesmo quando o formato do site mudou e o normalizador falharia.
 */
export function needsNormalization(formats: ExportFormats): boolean {
  return formats.lunoda || formats.simpleMd || formats.cdcJson;
}
