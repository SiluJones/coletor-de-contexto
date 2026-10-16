import { describe, expect, it } from 'vitest';
import { createIdGenerator, lunodaIdTime } from './ids';

describe('createIdGenerator', () => {
  it('gera 12 caracteres em base36', () => {
    const id = createIdGenerator()();
    expect(id).toMatch(/^[0-9a-z]{12}$/);
  });

  it('embute o instante nos 8 primeiros caracteres', () => {
    const before = Date.now();
    const id = createIdGenerator()();
    const after = Date.now();
    const t = lunodaIdTime(id);
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after + 1000);
  });

  it('reproduz um ID real do mapsmith 12 quando o instante bate', () => {
    // mtke7wavx3ge -> prefixo mtke7wav = 2026-09-02T17:51:44.455Z (medido em 2026-10-16)
    const t = Date.parse('2026-09-02T17:51:44.455Z');
    const id = createIdGenerator(
      () => t,
      () => 0,
    )();
    expect(id.slice(0, 8)).toBe('mtke7wav');
    expect(lunodaIdTime('mtke7wavx3ge')).toBe(t);
  });

  it('nao repete nem regride com o relogio parado (prova de vida da garantia de unicidade)', () => {
    const fixed = Date.parse('2026-10-16T12:00:00.000Z');
    const next = createIdGenerator(
      () => fixed,
      () => 0,
    ); // aleatorio sempre "0000"
    const ids = Array.from({ length: 1000 }, next);
    expect(new Set(ids).size).toBe(1000);
    // Instantes consecutivos: o gerador avanca 1 ms por ID quando o relogio nao anda.
    expect(ids.map(lunodaIdTime)).toEqual(ids.map((_, i) => fixed + i));
  });
});
