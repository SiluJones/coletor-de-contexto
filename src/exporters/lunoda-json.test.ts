import { describe, expect, it } from 'vitest';
import { LunodaFormatError, parseLunodaJson, renderLunodaJson } from './lunoda-json';

const minimal = {
  properties: [],
  entries: [
    {
      id: 'mtke7wavx3ge',
      title: 't',
      description: '',
      propertyValues: { 'p-tags': [], 'p-ia': [] },
      propertyAutoFlags: {},
      blocks: [
        { id: 'mtk5dkw3d65t', subtitle: 'Prompt', version: 1, content: 'olá', blockProps: {} },
      ],
      createdAt: '2026-09-02T17:51:44.451Z',
      updatedAt: '2026-09-02T17:51:44.451Z',
    },
  ],
};

describe('renderLunodaJson', () => {
  it('indenta com 2 espacos, sem quebra de linha final e com acentos crus', () => {
    const text = renderLunodaJson(parseLunodaJson(JSON.stringify(minimal)));
    expect(text.startsWith('{\n  "properties": [],')).toBe(true);
    expect(text.endsWith('}')).toBe(true);
    expect(text).toContain('"content": "olá"');
  });
});

describe('parseLunodaJson', () => {
  it('recusa bloco sem content, dizendo onde', () => {
    const broken = structuredClone(minimal) as { entries: { blocks: Record<string, unknown>[] }[] };
    delete broken.entries[0]!.blocks[0]!.content;
    expect(() => parseLunodaJson(JSON.stringify(broken))).toThrow(LunodaFormatError);
    expect(() => parseLunodaJson(JSON.stringify(broken))).toThrow('entries[0].blocks[0].content');
  });

  it('recusa raiz sem entries', () => {
    expect(() => parseLunodaJson('{"properties": []}')).toThrow('entries');
  });
});
