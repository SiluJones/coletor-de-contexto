/**
 * Escrita do `.md` no layout do export do Lunoda, reproduzido byte a byte do `mapsmith 12.md`.
 *
 * Detalhes que o teste de ouro protege: LF; dois espacos no fim das linhas de metadado (quebra de
 * linha em Markdown); separador de 40 × U+2501 depois do cabecalho e de cada bloco; front matter em
 * ISO UTC e corpo em hora local `dd/mm/aa HH:MM`; conteudo do bloco copiado sem nenhuma alteracao.
 * Nao verificado (o oraculo nao tem): titulo com aspas, descricao preenchida, propriedades marcadas.
 */

import { formatLunodaLocal } from '../core/dates';
import type { LunodaBlock, LunodaEntry } from './lunoda-types';

/** Separador do Lunoda: 40 × «━» (U+2501). */
export const LUNODA_SEPARATOR = '━'.repeat(40);

function blockSection(block: LunodaBlock, n: number): string {
  return [
    `## [Bloco ${n}] ${block.subtitle} · v${block.version}`,
    '',
    `<!-- BLOCO ${n} -->`,
    `**Subtítulo:** ${block.subtitle}  `,
    `**Versão:** v${block.version}  `,
    '',
    '**Conteúdo:**',
    '',
    `<!-- CONTEUDO:INICIO bloco=${n} -->`,
    block.content,
    `<!-- CONTEUDO:FIM bloco=${n} -->`,
    '',
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
}

/**
 * Gera o `.md` de uma entrada.
 * @param entry entrada do Lunoda.
 * @param timeZone fuso IANA das datas do corpo; omitido = fuso do ambiente (o do usuario).
 */
export function renderLunodaMd(entry: LunodaEntry, timeZone?: string): string {
  const header = [
    '---',
    `title: ${JSON.stringify(entry.title)}`,
    `id: ${JSON.stringify(entry.id)}`,
    `created: ${JSON.stringify(entry.createdAt)}`,
    `updated: ${JSON.stringify(entry.updatedAt)}`,
    `blocks: ${entry.blocks.length}`,
    '---',
    `# ${entry.title}`,
    '',
    '<!-- ENTRADA -->',
    `**ID:** \`${entry.id}\`  `,
    `**Criado em:** ${formatLunodaLocal(entry.createdAt, timeZone)}  `,
    `**Modificado em:** ${formatLunodaLocal(entry.updatedAt, timeZone)}  `,
    `**Total de blocos:** ${entry.blocks.length}  `,
    '',
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
  return header + entry.blocks.map((b, i) => blockSection(b, i + 1)).join('');
}
