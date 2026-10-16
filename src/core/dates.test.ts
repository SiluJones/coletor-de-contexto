import { describe, expect, it } from 'vitest';
import { formatLunodaLocal } from './dates';

describe('formatLunodaLocal', () => {
  it('reproduz o cabecalho do mapsmith 12 (truncando os segundos)', () => {
    // created "2026-09-02T17:51:44.451Z" -> "Criado em: 02/09/26 14:51" (medido em 2026-10-16)
    expect(formatLunodaLocal('2026-09-02T17:51:44.451Z', 'America/Sao_Paulo')).toBe(
      '02/09/26 14:51',
    );
  });

  it('vira o dia e o ano quando a hora local cai antes da meia-noite', () => {
    expect(formatLunodaLocal('2026-01-01T02:30:59.999Z', 'America/Sao_Paulo')).toBe(
      '31/12/25 23:30',
    );
  });

  it('usa 00 e nao 24 para meia-noite', () => {
    expect(formatLunodaLocal('2026-03-10T03:05:00.000Z', 'America/Sao_Paulo')).toBe(
      '10/03/26 00:05',
    );
  });

  it('usa o fuso do ambiente quando nenhum e passado (o vitest.config fixa America/Sao_Paulo)', () => {
    expect(formatLunodaLocal('2026-09-02T17:51:44.451Z')).toBe('02/09/26 14:51');
  });

  it('recusa data invalida em vez de escrever "NaN" no arquivo', () => {
    expect(() => formatLunodaLocal('ontem')).toThrow(RangeError);
  });
});
