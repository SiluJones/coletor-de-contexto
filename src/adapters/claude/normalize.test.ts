/**
 * Normalizador do Claude (DEC-011).
 * 1. Resposta SINTETICA no formato medido (versionada).
 * 2. Capturas REAIS fora do repositorio, apontadas por CDC_CLAUDE_CAPTURES_DIR (pulado sem a variavel):
 *    todas tem de normalizar sem erro e sem turno vazio.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SYNTHETIC_CLAUDE_RAW } from '../../tests/synthetic-claude-raw';
import { ClaudeFormatError, normalizeClaudeConversation } from './normalize';

describe('normalizeClaudeConversation (sintetico)', () => {
  const c = normalizeClaudeConversation(structuredClone(SYNTHETIC_CLAUDE_RAW));

  it('le os dados da conversa e monta o link', () => {
    expect(c).toMatchObject({
      platform: 'claude',
      sourceId: '11111111-2222-4333-8444-555555555555',
      title: 'Sintética 1 — contar palavras',
      url: 'https://claude.ai/chat/11111111-2222-4333-8444-555555555555',
    });
  });

  it('segue so o ramo atual e termina no pedido sem resposta', () => {
    expect(c.turns.map((t) => [t.index, t.user.text, t.assistant ? 'resposta' : '-'])).toEqual([
      [1, 'Quantas palavras tem este arquivo?', 'resposta'],
      [2, 'E sem contar as linhas vazias?', 'resposta'],
      [3, 'Obrigado! Última pergunta depois.', '-'],
    ]);
    expect(JSON.stringify(c)).not.toContain('ABANDONADO');
    expect(JSON.stringify(c)).not.toContain('ANTES DE EDITAR');
  });

  it('junta os textos da resposta com linha em branco e deixa as ferramentas de fora', () => {
    expect(c.turns[0]?.assistant?.text).toBe('Vou contar com o `wc`.\n\nSão **412** palavras.');
    expect(JSON.stringify(c)).not.toContain('412 notas.txt');
  });

  it('pensamento vem dos resumos, um item por bloco de pensamento', () => {
    expect(c.turns[0]?.assistant?.thinking).toEqual([
      '- Lendo o anexo.\n- Escolhendo o comando.',
      '- Conferindo a saida.',
    ]);
  });

  it('une a continuacao da resposta e ignora a mensagem vazia', () => {
    expect(c.turns[1]?.assistant?.text).toBe(
      'Use `grep -c .` para as linhas não vazias.\n\nDeixei o script pronto.',
    );
    expect(c.turns[1]?.assistant?.generated).toEqual([
      { name: 'contar.sh', kind: 'blob', size: 312 },
    ]);
  });

  it('anexos do pedido viram referencias, sem o conteudo extraido', () => {
    expect(c.turns[0]?.user.attachments).toEqual([
      { name: 'notas.txt', kind: 'text/plain', size: 2048 },
      { name: 'print.png', kind: 'image', size: 95547 },
    ]);
    expect(JSON.stringify(c)).not.toContain('NAO DEVE APARECER');
  });

  it('titulo vazio vira «Conversa sem título»', () => {
    const raw = { ...structuredClone(SYNTHETIC_CLAUDE_RAW), name: '  ' };
    expect(normalizeClaudeConversation(raw).title).toBe('Conversa sem título');
  });
});

describe('normalizeClaudeConversation (formato quebrado)', () => {
  const broken = (mutate: (r: Record<string, unknown>) => void) => {
    const raw = structuredClone(SYNTHETIC_CLAUDE_RAW) as unknown as Record<string, unknown>;
    mutate(raw);
    return () => normalizeClaudeConversation(raw);
  };

  it.each([
    ['sem chat_messages', (r: Record<string, unknown>) => delete r.chat_messages],
    [
      'sem current_leaf_message_uuid',
      (r: Record<string, unknown>) => delete r.current_leaf_message_uuid,
    ],
    ['folha que nao existe', (r: Record<string, unknown>) => (r.current_leaf_message_uuid = 'x')],
    [
      'sender desconhecido',
      (r: Record<string, unknown>) =>
        ((r.chat_messages as Record<string, unknown>[])[0]!.sender = 'bot'),
    ],
  ])('%s -> ClaudeFormatError com a mensagem padrao', (_nome, mutate) => {
    expect(broken(mutate)).toThrow(ClaudeFormatError);
    expect(broken(mutate)).toThrow('Formato da conversa do Claude mudou');
  });

  it('nao e objeto -> erro', () => {
    expect(() => normalizeClaudeConversation('<html>')).toThrow(ClaudeFormatError);
  });
});

const capturesDir = process.env.CDC_CLAUDE_CAPTURES_DIR;
const captures =
  capturesDir && existsSync(capturesDir)
    ? readdirSync(capturesDir).filter((f) => f.endsWith('.json'))
    : [];

describe.skipIf(!capturesDir)('capturas reais (CDC_CLAUDE_CAPTURES_DIR)', () => {
  it('a pasta tem ao menos uma captura .json', () => {
    expect(captures.length).toBeGreaterThan(0);
  });

  it.each(captures)('%s: normaliza sem erro e sem turno vazio', (file) => {
    const raw: unknown = JSON.parse(readFileSync(join(capturesDir!, file), 'utf8'));
    const c = normalizeClaudeConversation(raw);
    expect(c.turns.length).toBeGreaterThan(0);
    for (const t of c.turns) {
      expect(t.user.text !== '' || t.user.attachments.length > 0).toBe(true);
      if (t.assistant) {
        expect(t.assistant.text !== '' || t.assistant.generated.length > 0).toBe(true);
      }
    }
  });
});
