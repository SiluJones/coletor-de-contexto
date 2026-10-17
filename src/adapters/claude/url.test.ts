import { describe, expect, it } from 'vitest';
import { parseClaudeConversationUrl } from './url';

const ID = 'd41adc75-87c7-4a84-87ee-0b95f7ed0a5c';

describe('parseClaudeConversationUrl', () => {
  it.each([
    [`https://claude.ai/chat/${ID}`, ID],
    [`https://claude.ai/chat/${ID}?foo=1`, ID],
    [`https://claude.ai/chat/${ID}#x`, ID],
    [`https://claude.ai/chat/${ID.toUpperCase()}`, ID],
  ])('%s -> uuid', (url, id) => {
    expect(parseClaudeConversationUrl(url)).toBe(id);
  });

  it.each([
    'https://claude.ai/new',
    'https://claude.ai/project/abc',
    `https://claude.ai/chat/${ID}extra`,
    `http://claude.ai/chat/${ID}`,
    `https://evil.example/claude.ai/chat/${ID}`,
    'chrome://extensions',
    '',
  ])('%s -> null', (url) => {
    expect(parseClaudeConversationUrl(url)).toBeNull();
  });

  it('aba sem URL legivel -> null', () => {
    expect(parseClaudeConversationUrl(undefined)).toBeNull();
  });
});
