import { describe, expect, it } from 'vitest';
import { rawDumpFilename, summarizeRaw } from './raw-dump';

describe('rawDumpFilename', () => {
  it('poe a captura em cdc-raw/ com uuid e carimbo UTC', () => {
    expect(
      rawDumpFilename('d41adc75-87c7-4a84-87ee-0b95f7ed0a5c', new Date('2026-10-17T01:23:25.562Z')),
    ).toBe('cdc-raw/claude-d41adc75-87c7-4a84-87ee-0b95f7ed0a5c-20261017T012325Z.json');
  });
});

describe('summarizeRaw', () => {
  it('resume objeto JSON em KB (bytes UTF-8) e numero de chaves', () => {
    const text = JSON.stringify({ a: 'é'.repeat(1024), b: 1 });
    expect(summarizeRaw(text)).toEqual({ ok: true, kb: '2,0', topKeys: 2 });
  });

  it('recusa HTML (sessao expirada, pagina de verificacao)', () => {
    expect(summarizeRaw('<!doctype html><html>')).toMatchObject({ ok: false });
  });

  it('recusa JSON que nao e objeto', () => {
    expect(summarizeRaw('[1,2]')).toMatchObject({ ok: false });
  });
});
