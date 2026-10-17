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
