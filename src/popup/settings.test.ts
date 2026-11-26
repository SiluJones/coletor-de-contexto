import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, needsNormalization, parseSettings } from './settings';

describe('parseSettings', () => {
  it('sem nada salvo -> padrao do primeiro uso (simples + bruta, sem pensamento, com arquivos)', () => {
    expect(parseSettings(undefined)).toEqual({
      includeThinking: false,
      includeFiles: true,
      formats: { lunoda: false, simpleMd: true, cdcJson: false, raw: true },
    });
  });

  it('le o que foi salvo', () => {
    const saved = {
      includeThinking: true,
      includeFiles: false,
      formats: { lunoda: false, simpleMd: true, cdcJson: true, raw: false },
    };
    expect(parseSettings(saved)).toEqual(saved);
  });

  it('completa campo ausente ou com tipo errado com o padrao, sem lancar', () => {
    expect(parseSettings({ includeThinking: 'sim', formats: { lunoda: true } })).toEqual({
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: true, cdcJson: false, raw: true },
    });
    expect(parseSettings('lixo')).toEqual(parseSettings(undefined));
  });

  it('preferencia salva antes da caixa da bruta existir ganha a bruta ligada', () => {
    const v010 = {
      includeThinking: true,
      includeFiles: true,
      formats: { lunoda: true, simpleMd: true, cdcJson: true },
    };
    expect(parseSettings(v010).formats).toEqual({
      lunoda: true,
      simpleMd: true,
      cdcJson: true,
      raw: true,
    });
  });

  it('so a bruta nao precisa normalizar; qualquer outro formato precisa', () => {
    const none = { lunoda: false, simpleMd: false, cdcJson: false, raw: false };
    expect(needsNormalization({ ...none, raw: true })).toBe(false);
    expect(needsNormalization({ ...none, simpleMd: true })).toBe(true);
    expect(needsNormalization({ ...none, lunoda: true })).toBe(true);
    expect(needsNormalization({ ...none, cdcJson: true })).toBe(true);
  });

  it('o padrao nao pode ser alterado por engano', () => {
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true);
    expect(Object.isFrozen(DEFAULT_SETTINGS.formats)).toBe(true);
  });
});
