/**
 * Partes puras do botao de depuracao «Salvar resposta bruta» (passo 6 da spec, DEC-010).
 */

/** Subpasta dentro de Downloads onde as capturas brutas caem. */
export const RAW_DUMP_DIR = 'cdc-raw';

/**
 * Nome do arquivo da captura: `cdc-raw/claude-<uuid>-<AAAAMMDDTHHMMSSZ>.json` (hora em UTC, para
 * nunca colidir nem depender do fuso).
 */
export function rawDumpFilename(conversationId: string, now: Date): string {
  const stamp = now
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[-:]/g, '');
  return `${RAW_DUMP_DIR}/claude-${conversationId}-${stamp}.json`;
}

/** Resumo do texto capturado, para o popup dizer o que salvou. */
export type RawSummary = { ok: true; kb: string; topKeys: number } | { ok: false; error: string };

/**
 * Confere que a resposta e JSON de objeto e resume o tamanho. Nao interpreta o formato da conversa.
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
  return { ok: true, kb, topKeys: Object.keys(parsed).length };
}
