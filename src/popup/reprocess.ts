/**
 * Partes puras do «Reprocessar» (DEC-017): reconhece um arquivo guardado — resposta bruta do Claude
 * ou JSON do CDC — e gera dele os formatos marcados, sem buscar a conversa de novo.
 */

import { ClaudeFormatError, normalizeClaudeConversation } from '../adapters/claude/normalize';
import type { Conversation } from '../core/model';
import type { BuildContext } from '../exporters/lunoda-build';
import { buildConversationDownloads, type DownloadFile } from './export';
import type { ExportSettings } from './settings';

/** Subpasta de Downloads onde cada rodada do «Reprocessar» cai. */
export const REPROCESS_DIR = 'cdc-reprocessado';

/** Que tipo de arquivo guardado foi reconhecido. */
export type SavedKind = 'raw' | 'cdc';

/** Resultado de reconhecer um arquivo guardado. */
export type ParsedSaved =
  { ok: true; kind: SavedKind; conversation: Conversation } | { ok: false; error: string };

/** Resultado de reprocessar um arquivo. */
export type ReprocessResult =
  | { ok: true; kind: SavedKind; baseName: string; turns: number; files: DownloadFile[] }
  | { ok: false; error: string };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Reconhece o texto de um arquivo guardado. Nunca lanca: arquivo ruim vira erro so dele.
 * - JSON do CDC (`format: "coletor-de-contexto"`, `version: 1`) -> a `conversation` dele;
 * - resposta bruta do Claude (objeto com `chat_messages`) -> o normalizador.
 */
export function parseSavedFile(text: string): ParsedSaved {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'O arquivo não é JSON.' };
  }
  if (!isObject(parsed)) {
    return { ok: false, error: 'O JSON não é um objeto de conversa.' };
  }
  if (parsed.format === 'coletor-de-contexto') {
    if (parsed.version !== 1) {
      return {
        ok: false,
        error: `JSON do CDC na versão ${String(parsed.version)}, não suportada.`,
      };
    }
    const c = parsed.conversation;
    // O JSON do CDC e o modelo canonico inteiro (DEC-012); confere o minimo para nao gerar arquivo vazio.
    if (!isObject(c) || !Array.isArray(c.turns) || typeof c.title !== 'string') {
      return { ok: false, error: 'JSON do CDC sem a conversa.' };
    }
    return { ok: true, kind: 'cdc', conversation: c as unknown as Conversation };
  }
  if (Array.isArray(parsed.chat_messages)) {
    try {
      return { ok: true, kind: 'raw', conversation: normalizeClaudeConversation(parsed) };
    } catch (err) {
      const why = err instanceof ClaudeFormatError ? err.message : String(err);
      return { ok: false, error: `Resposta bruta com formato que o CDC não lê: ${why}` };
    }
  }
  return { ok: false, error: 'Não é uma resposta bruta do Claude nem um JSON do CDC.' };
}

/**
 * Reprocessa um arquivo guardado nos formatos marcados (a caixa «Resposta bruta» e ignorada: a
 * bruta e a entrada). Os nomes sao os mesmos do «Exportar».
 */
export function reprocessFile(
  text: string,
  settings: ExportSettings,
  ctx: BuildContext,
  timeZone?: string,
): ReprocessResult {
  const parsed = parseSavedFile(text);
  if (!parsed.ok) return parsed;
  const out = buildConversationDownloads(parsed.conversation, settings, ctx, timeZone);
  return { ok: true, kind: parsed.kind, ...out };
}

/** Subpasta da rodada, em hora local: `cdc-reprocessado/AAMMDD-HHMM`. */
export function reprocessFolder(now: Date): string {
  const two = (n: number) => String(n).padStart(2, '0');
  const stamp =
    two(now.getFullYear() % 100) +
    two(now.getMonth() + 1) +
    two(now.getDate()) +
    '-' +
    two(now.getHours()) +
    two(now.getMinutes());
  return `${REPROCESS_DIR}/${stamp}`;
}
