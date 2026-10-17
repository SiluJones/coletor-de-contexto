import { defineConfig } from 'wxt';

// Configuracao do WXT. Permissoes minimas (DEC-007, DEC-010, DEC-012): `activeTab` + `scripting`
// rodam a busca dentro da aba do Claude so quando o usuario abre o popup; `downloads` salva os
// arquivos; `storage` lembra formatos e opcoes do popup. Nenhuma host_permission permanente.
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Coletor de Contexto',
    description: 'Exporta conversas de IA para JSON (Lunoda) e Markdown.',
    permissions: ['activeTab', 'scripting', 'downloads', 'storage'],
  },
});
