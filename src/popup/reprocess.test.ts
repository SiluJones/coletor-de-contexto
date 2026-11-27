import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderSimpleMarkdown } from '../exporters/simple-md';
import { SYNTHETIC_CLAUDE_RAW } from '../tests/synthetic-claude-raw';
import { SYNTHETIC_NOW, syntheticIds } from '../tests/synthetic-conversation';
import { buildExportDownloads } from './export';
import { parseSavedFile, reprocessFile, reprocessFolder } from './reprocess';

const all = {
  includeThinking: true,
  includeFiles: true,
  formats: { lunoda: true, simpleMd: true, cdcJson: true, raw: true },
};
const ctx = () => ({ newId: syntheticIds(), now: SYNTHETIC_NOW });
const fixture = (name: string) =>
  readFileSync(new URL(`../tests/fixtures/claude/${name}`, import.meta.url), 'utf8');

describe('reprocessFile', () => {
  it('resposta bruta -> os mesmos arquivos do «Exportar»', () => {
    const r = reprocessFile(JSON.stringify(SYNTHETIC_CLAUDE_RAW), all, ctx(), 'America/Sao_Paulo');
    const e = buildExportDownloads(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      all,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(r).toEqual({ ok: true, kind: 'raw', ...e });
  });

  it('JSON do CDC da fixture -> Markdown simples igual a fixture', () => {
    const simple = {
      ...all,
      formats: { lunoda: false, simpleMd: true, cdcJson: false, raw: false },
    };
    const r = reprocessFile(
      fixture('sintetico-claude.cdc.json'),
      simple,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(r.ok && r.kind).toBe('cdc');
    expect(r.ok && r.files.map((f) => [f.filename, f.content])).toEqual([
      ['Sintética 1 — contar palavras (simples).md', fixture('sintetico-claude.simples.md')],
    ]);
  });

  it('a caixa «Resposta bruta» nao gera arquivo no reprocessar', () => {
    const onlyRaw = {
      ...all,
      formats: { lunoda: false, simpleMd: false, cdcJson: false, raw: true },
    };
    const r = reprocessFile(JSON.stringify(SYNTHETIC_CLAUDE_RAW), onlyRaw, ctx());
    expect(r.ok && r.files).toEqual([]);
  });
});

describe('parseSavedFile (entradas ruins viram erro do arquivo, sem lancar)', () => {
  it.each([
    ['nao e JSON', '<!doctype html>', 'não é JSON'],
    ['JSON que nao e objeto', '[1,2]', 'não é um objeto'],
    ['objeto desconhecido', '{"a":1}', 'nem um JSON do CDC'],
    ['JSON do CDC de outra versao', '{"format":"coletor-de-contexto","version":2}', 'versão 2'],
    ['JSON do CDC sem conversa', '{"format":"coletor-de-contexto","version":1}', 'sem a conversa'],
    ['bruta quebrada', '{"chat_messages":[]}', 'formato que o CDC não lê'],
  ])('%s', (_, text, piece) => {
    const r = parseSavedFile(text);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toContain(piece);
  });
});

describe('reprocessFolder', () => {
  it('subpasta da rodada em hora local (os testes rodam em America/Sao_Paulo)', () => {
    expect(reprocessFolder(new Date('2026-11-27T18:05:00Z'))).toBe('cdc-reprocessado/261127-1505');
  });
});

// Fidelidade em historicos reais (DEC-017): pasta no formato «- Historico - <projeto> (CDC)», com as
// brutas em `cdc-raw/` e o `(simples).md` de cada conversa ao lado. O reprocessado tem de ser igual
// ao guardado, fora a data de exportacao e o tamanho de imagem (que a API as vezes omite — medido em
// 2026-11-27: 128 de 140 iguais e 12 so com essa diferenca). Fica fora do repositorio: conteudo real.
const pairsDir = process.env.CDC_REPROCESS_PAIRS_DIR;
const rawDir = pairsDir ? join(pairsDir, 'cdc-raw') : '';
const pairs =
  pairsDir && existsSync(rawDir)
    ? readdirSync(rawDir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => ({
          raw: join(rawDir, f),
          simple: join(pairsDir, `${f.split(' — claude-')[0]} (simples).md`),
        }))
        .filter((p) => existsSync(p.simple))
    : [];

describe.skipIf(!pairsDir)('fidelidade em historico real (CDC_REPROCESS_PAIRS_DIR)', () => {
  const normalize = (s: string) =>
    s
      .replace(/ · \*\*Exportada em:\*\* [^\n]*/, '')
      .replace(/^(- `[^`]+` — image), [\d,]+ (B|KB|MB)$/gm, '$1');

  it('a pasta tem ao menos um par bruta + (simples).md', () => {
    expect(pairs.length).toBeGreaterThan(0);
  });

  it.each(pairs.map((p) => [basename(p.raw), p] as const))('%s', (_, p) => {
    const stored = readFileSync(p.simple, 'utf8');
    const parsed = parseSavedFile(readFileSync(p.raw, 'utf8'));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const thinking = stored.includes('### Pensamento');
    const outs = [true, false].map((includeFiles) =>
      normalize(
        renderSimpleMarkdown(
          parsed.conversation,
          { includeThinking: thinking, includeFiles },
          {
            now: SYNTHETIC_NOW,
            timeZone: 'America/Sao_Paulo',
          },
        ),
      ),
    );
    expect(outs).toContain(normalize(stored));
  });
});
