import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS } from '../core/model';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW, syntheticIds } from '../tests/synthetic-conversation';
import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { buildExportDownloads, buildLunodaExport } from './export';
import { DEFAULT_SETTINGS } from './settings';

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

describe('buildExportDownloads (formatos escolhidos)', () => {
  const ctx = () => ({ newId: syntheticIds(), now: SYNTHETIC_NOW });
  const all = {
    includeThinking: true,
    includeFiles: true,
    formats: { lunoda: true, simpleMd: true, cdcJson: true },
  };
  const out = buildExportDownloads(
    structuredClone(SYNTHETIC_CLAUDE_RAW),
    all,
    ctx(),
    'America/Sao_Paulo',
  );
  const byName = (suffix: string) => out.files.find((f) => f.filename.endsWith(suffix))!;

  it('todos os formatos -> 4 arquivos com o titulo na frente', () => {
    expect(out.files.map((f) => [f.filename, f.mime])).toEqual([
      ['Sintética 1 — contar palavras.json', 'application/json'],
      ['Sintética 1 — contar palavras.md', 'text/markdown'],
      ['Sintética 1 — contar palavras (simples).md', 'text/markdown'],
      ['Sintética 1 — contar palavras.cdc.json', 'application/json'],
    ]);
  });

  it('padrao do primeiro uso -> so os 2 do Lunoda, iguais aos do buildLunodaExport', () => {
    const d = buildExportDownloads(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      DEFAULT_SETTINGS,
      ctx(),
      'America/Sao_Paulo',
    );
    const l = buildLunodaExport(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      DEFAULT_SETTINGS,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(d.files.map((f) => f.content)).toEqual([l.json, l.md]);
  });

  it('nenhum formato marcado -> nenhum arquivo', () => {
    const none = { ...all, formats: { lunoda: false, simpleMd: false, cdcJson: false } };
    expect(buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), none, ctx()).files).toEqual(
      [],
    );
  });

  it('markdown simples bate com a fixture', async () => {
    await expect(byName('(simples).md').content).toMatchFileSnapshot(
      '../tests/fixtures/claude/sintetico-claude.simples.md',
    );
  });

  it('JSON do CDC bate com a fixture e devolve a conversa inteira', async () => {
    const cdc = byName('.cdc.json').content;
    await expect(cdc).toMatchFileSnapshot('../tests/fixtures/claude/sintetico-claude.cdc.json');
    const parsed = JSON.parse(cdc);
    expect(parsed).toMatchObject({
      format: 'coletor-de-contexto',
      version: 1,
      exportedAt: SYNTHETIC_NOW,
    });
    expect(parsed.conversation).toEqual(
      normalizeClaudeConversation(structuredClone(SYNTHETIC_CLAUDE_RAW)),
    );
  });

  it('JSON do CDC ignora as opcoes: pensamento e arquivos vao sempre', () => {
    const lean = { ...all, includeThinking: false, includeFiles: false };
    const cdc = buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), lean, ctx()).files.find(
      (f) => f.filename.endsWith('.cdc.json'),
    )!;
    expect(cdc.content).toContain('Lendo o anexo.');
    expect(cdc.content).toContain('notas.txt');
  });
});
