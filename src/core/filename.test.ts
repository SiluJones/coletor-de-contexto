import { describe, expect, it } from 'vitest';
import { safeFileName } from './filename';

describe('safeFileName', () => {
  it.each([
    ['CDC 1', 'CDC 1'],
    ['mapsmith 10 - v4', 'mapsmith 10 - v4'],
    ['Conversa sintética — contar palavras', 'Conversa sintética — contar palavras'],
    ['Parte 2: A/B?', 'Parte 2_ A_B_'],
    ['  muitos    espaços  ', 'muitos espaços'],
    ['termina com ponto.', 'termina com ponto'],
    ['CON', '_CON'],
    ['', 'conversa'],
    ['???', '___'],
  ])('%j -> %j', (title, name) => {
    expect(safeFileName(title)).toBe(name);
  });

  it('corta em 120 caracteres', () => {
    expect(safeFileName('a'.repeat(300))).toHaveLength(120);
  });
});
