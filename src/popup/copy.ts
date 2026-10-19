/**
 * Textos do «Copiar» do popup (F2, DEC-013). Parte pura: o acesso a area de transferencia fica no popup.
 *
 * - `conversation`: a conversa inteira em Markdown simples, com as mesmas opcoes do «Exportar».
 * - `lastReply`: so o texto da ultima resposta da IA, como veio (markdown), para colar adiante.
 */

import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import type { Conversation } from '../core/model';
import { renderSimpleMarkdown } from '../exporters/simple-md';
import type { ExportSettings } from './settings';

/** O que copiar. */
export type CopyKind = 'conversation' | 'lastReply';

/**
 * Texto da ultima resposta da IA na conversa (ramo atual), ou null se nenhuma pergunta teve resposta.
 * A conversa pode terminar num pedido sem resposta: nesse caso vale a resposta do turno anterior.
 */
export function lastReplyText(conversation: Conversation): string | null {
  for (let i = conversation.turns.length - 1; i >= 0; i--) {
    const reply = conversation.turns[i]?.assistant;
    if (reply && reply.text) return reply.text;
  }
  return null;
}

/**
 * Monta o texto a copiar a partir da resposta bruta do Claude.
 * @returns `text` null quando nao ha o que copiar (ex.: nenhuma resposta da IA ainda).
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildCopyText(
  raw: unknown,
  kind: CopyKind,
  settings: ExportSettings,
  ctx: { now: string; timeZone?: string },
): { text: string | null; turns: number } {
  const conversation = normalizeClaudeConversation(raw);
  const text =
    kind === 'conversation'
      ? renderSimpleMarkdown(conversation, settings, ctx)
      : lastReplyText(conversation);
  return { text, turns: conversation.turns.length };
}
