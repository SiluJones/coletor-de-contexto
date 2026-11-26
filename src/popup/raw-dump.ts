/**
 * Partes puras do formato «Resposta bruta» do «Exportar» (DEC-015; antes, botao de depuracao — DEC-010).
 */

import { safeFileName } from '../core/filename';
import type { DownloadFile } from './export';

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

/**
 * Arquivo da resposta bruta: o texto EXATAMENTE como veio da API, sem reformatar (DEC-015).
 * @param text corpo da resposta, como veio.
 * @param title o `name` da conversa (de `summarizeRaw`), se houver.
 */
export function rawDownloadFile(
  text: string,
  conversationId: string,
  now: Date,
  title?: string,
): DownloadFile {
  return {
    filename: rawDumpFilename(conversationId, now, title),
    content: text,
    mime: 'application/json',
  };
}
