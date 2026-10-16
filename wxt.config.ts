import { defineConfig } from 'wxt';

// Configuracao do WXT. Permissoes e host_permissions entram com o adaptador do Claude (DEC-007:
// so o minimo, e so quando uma feature precisar).
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Coletor de Contexto',
    description: 'Exporta conversas de IA para JSON (Lunoda) e Markdown.',
  },
});
