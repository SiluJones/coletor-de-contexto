/**
 * Reconhece a URL de uma conversa do claude.ai (`https://claude.ai/chat/<uuid>`).
 */

const CONVERSATION_URL =
  /^https:\/\/claude\.ai\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:[/?#]|$)/i;

/**
 * Devolve o uuid da conversa (em minusculas) ou `null` se a URL nao for de uma conversa do Claude.
 * @param url URL da aba ativa; `undefined` quando o navegador nao a expoe.
 */
export function parseClaudeConversationUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = CONVERSATION_URL.exec(url);
  return match?.[1] ? match[1].toLowerCase() : null;
}
