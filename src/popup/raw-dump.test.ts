import { describe, expect, it } from 'vitest';
import { rawDumpFilename, summarizeRaw } from './raw-dump';

const ID = 'd41adc75-87c7-4a84-87ee-0b95f7ed0a5c';
const NOW = new Date('2026-10-17T01:23:25.562Z');

describe('rawDumpFilename', () => {
  it('poe o titulo na frente, depois o comeco do uuid e o carimbo UTC', () => {
    expect(rawDumpFilename(ID, NOW, 'CDC 1')).toBe(
      'cdc-raw/CDC 1 — claude-d41adc75-20261017T012325Z.json',
    );
  });

  it('titulo com caractere proibido no Windows vira nome seguro', () => {
    expect(rawDumpFilename(ID, NOW, 'Parte 2: A/B')).toBe(
      'cdc-raw/Parte 2_ A_B — claude-d41adc75-20261017T012325Z.json',
    );
  });

  it('sem titulo, comeca pelo uuid inteiro', () => {
    expect(rawDumpFilename(ID, NOW)).toBe(`cdc-raw/claude-${ID}-20261017T012325Z.json`);
    expect(rawDumpFilename(ID, NOW, '  ')).toBe(`cdc-raw/claude-${ID}-20261017T012325Z.json`);
  });
});

describe('summarizeRaw', () => {
  it('resume objeto JSON em KB (bytes UTF-8), numero de chaves e titulo', () => {
    const text = JSON.stringify({ name: 'CDC 1', a: 'é'.repeat(1024) });
    expect(summarizeRaw(text)).toEqual({ ok: true, kb: '2,0', topKeys: 2, title: 'CDC 1' });
  });

  it('sem name, sem titulo', () => {
    expect(summarizeRaw('{"a":1}')).toEqual({ ok: true, kb: '0,0', topKeys: 1 });
  });

  it('recusa HTML (sessao expirada, pagina de verificacao)', () => {
    expect(summarizeRaw('<!doctype html><html>')).toMatchObject({ ok: false });
  });

  it('recusa JSON que nao e objeto', () => {
    expect(summarizeRaw('[1,2]')).toMatchObject({ ok: false });
  });
});
