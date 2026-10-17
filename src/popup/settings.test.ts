import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings } from './settings';

describe('parseSettings', () => {
  it('sem nada salvo -> padrao do primeiro uso (so Lunoda, sem pensamento, com arquivos)', () => {
    expect(parseSettings(undefined)).toEqual({
      includeThinking: false,
      includeFiles: true,
      formats: { lunoda: true, simpleMd: false, cdcJson: false },
    });
  });

  it('le o que foi salvo', () => {
    const saved = {
      includeThinking: true,
      includeFiles: false,
      formats: { lunoda: false, simpleMd: true, cdcJson: true },
    };
    expect(parseSettings(saved)).toEqual(saved);
  });

  it('completa campo ausente ou com tipo errado com o padrao, sem lancar', () => {
    expect(parseSettings({ includeThinking: 'sim', formats: { simpleMd: true } })).toEqual({
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: true, cdcJson: false },
    });
    expect(parseSettings('lixo')).toEqual(parseSettings(undefined));
  });

  it('o padrao nao pode ser alterado por engano', () => {
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true);
    expect(Object.isFrozen(DEFAULT_SETTINGS.formats)).toBe(true);
  });
});
