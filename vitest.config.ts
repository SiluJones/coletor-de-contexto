import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    // Fuso fixo: as datas do MD do Lunoda sao em hora local, e o teste tem de dar o mesmo resultado
    // em qualquer maquina (armadilha 4 do CONTEXT).
    env: { TZ: 'America/Sao_Paulo' },
  },
});
