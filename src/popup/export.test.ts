import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS } from '../core/model';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW, syntheticIds } from '../tests/synthetic-conversation';
import { buildLunodaExport } from './export';

describe('buildLunodaExport (ponta a ponta, resposta sintetica do Claude)', () => {
  const files = buildLunodaExport(
    structuredClone(SYNTHETIC_CLAUDE_RAW),
    { ...DEFAULT_EXPORT_OPTIONS },
    { newId: syntheticIds(), now: SYNTHETIC_NOW },
    'America/Sao_Paulo',
  );

  it('nome-base e o titulo da conversa', () => {
    expect(files.baseName).toBe('Sintética 1 — contar palavras');
    expect(files.turns).toBe(3);
  });

  it('json bate com a fixture', async () => {
    await expect(files.json).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.lunoda.json',
    );
  });

  it('md bate com a fixture', async () => {
    await expect(files.md).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.lunoda.md',
    );
  });

  it('padrao do primeiro uso: sem pensamento, com arquivos, link na descricao', () => {
    expect(files.md).not.toContain('Pensamento');
    expect(files.md).toContain('**Arquivos anexados:**');
    expect(files.md).toContain(
      '> **Descrição/Resumo:** https://claude.ai/chat/11111111-2222-4333-8444-555555555555',
    );
  });
});
