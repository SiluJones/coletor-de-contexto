import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW } from '../tests/synthetic-conversation';
import { buildCopyText, lastReplyText } from './copy';
import { DEFAULT_SETTINGS } from './settings';

const all = {
  includeThinking: true,
  includeFiles: true,
  formats: { lunoda: false, simpleMd: false, cdcJson: false },
};
const ctx = { now: SYNTHETIC_NOW, timeZone: 'America/Sao_Paulo' };
const raw = () => structuredClone(SYNTHETIC_CLAUDE_RAW);

describe('buildCopyText', () => {
  it('conversa = o mesmo Markdown simples do «Exportar» (fixture)', () => {
    const fixture = readFileSync(
      new URL('../tests/fixtures/claude/sintetico-claude.simples.md', import.meta.url),
      'utf8',
    );
    expect(buildCopyText(raw(), 'conversation', all, ctx)).toEqual({ text: fixture, turns: 3 });
  });

  it('conversa segue as opcoes (padrao: sem pensamento)', () => {
    const { text } = buildCopyText(raw(), 'conversation', DEFAULT_SETTINGS, ctx);
    expect(text).not.toContain('Pensamento');
    expect(text).toContain('**Arquivos anexados:**');
  });

  it('ultima resposta = texto da resposta do turno 2, porque o turno 3 nao tem resposta', () => {
    const c = normalizeClaudeConversation(raw());
    expect(c.turns.at(-1)?.assistant).toBeUndefined();
    const { text } = buildCopyText(raw(), 'lastReply', all, ctx);
    expect(text).toBe(c.turns[1]?.assistant?.text);
    expect(text).toContain('Deixei o script pronto.');
    expect(text).not.toContain('Arquivos gerados');
  });
});

describe('lastReplyText', () => {
  it('nenhuma resposta da IA -> null', () => {
    const c = normalizeClaudeConversation(raw());
    const noReplies = { ...c, turns: c.turns.map((t) => ({ index: t.index, user: t.user })) };
    expect(lastReplyText(noReplies)).toBeNull();
  });
});
