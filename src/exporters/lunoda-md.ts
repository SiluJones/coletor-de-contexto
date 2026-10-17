/**
 * Escrita do `.md` no layout do export do Lunoda, reproduzido byte a byte dos pares do oraculo
 * (`mapsmith 12`, `sintetico-lunoda`, `sintetico-lunoda-ia` — DEC-009).
 *
 * Detalhes que o teste de ouro protege: LF; dois espacos no fim das linhas de metadado (quebra de
 * linha em Markdown); separador de 40 × U+2501 depois do cabecalho e de cada bloco; front matter em
 * ISO UTC e corpo em hora local `dd/mm/aa HH:MM`; conteudo do bloco copiado sem nenhuma alteracao;
 * propriedade marcada (medido so com UMA propriedade e UM valor: «IA Utilizada = Claude») aparece no
 * front matter, no cabecalho e em cada bloco que a tem no `blockProps`.
 * Nao verificado (o oraculo nao tem): titulo com aspas, descricao preenchida, duas propriedades ou
 * dois valores marcados ao mesmo tempo, nome de propriedade com acento (chave do front matter).
 */

import { formatLunodaLocal } from '../core/dates';
import type { LunodaBlock, LunodaEntry, LunodaProperty } from './lunoda-types';

/** Separador do Lunoda: 40 × «━» (U+2501). */
export const LUNODA_SEPARATOR = '━'.repeat(40);

/** Uma propriedade marcada, ja traduzida de ids para nomes. */
interface MarkedProperty {
  name: string;
  values: string[];
}

/**
 * Traduz `{ "p-ia": ["o4"] }` em `[{ name: "IA Utilizada", values: ["Claude"] }]`, na ordem das
 * propriedades do documento. Propriedade sem valor marcado fica de fora; id sem cadastro aparece cru.
 */
function markedProperties(
  values: Record<string, unknown>,
  properties: LunodaProperty[],
): MarkedProperty[] {
  const marked: MarkedProperty[] = [];
  for (const prop of properties) {
    const ids = values[prop.id];
    if (!Array.isArray(ids) || ids.length === 0) continue;
    marked.push({
      name: prop.name,
      values: ids.map((id) => prop.options.find((o) => o.id === id)?.name ?? String(id)),
    });
  }
  return marked;
}

/** Chave do front matter: «IA Utilizada» -> «ia_utilizada» (medido). */
function frontMatterKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_');
}

/** Linhas `**Nome:** valor  ` seguidas de uma linha em branco; nada quando nao ha propriedade. */
function propertyLines(marked: MarkedProperty[]): string[] {
  if (marked.length === 0) return [];
  return [...marked.map((p) => `**${p.name}:** ${p.values.join(', ')}  `), ''];
}

function blockSection(block: LunodaBlock, n: number, properties: LunodaProperty[]): string {
  return [
    `## [Bloco ${n}] ${block.subtitle} · v${block.version}`,
    '',
    `<!-- BLOCO ${n} -->`,
    `**Subtítulo:** ${block.subtitle}  `,
    `**Versão:** v${block.version}  `,
    '',
    ...propertyLines(markedProperties(block.blockProps, properties)),
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
 * @param properties propriedades do documento (para traduzir ids marcados em nomes).
 * @param timeZone fuso IANA das datas do corpo; omitido = fuso do ambiente (o do usuario).
 */
export function renderLunodaMd(
  entry: LunodaEntry,
  properties: LunodaProperty[],
  timeZone?: string,
): string {
  const marked = markedProperties(entry.propertyValues, properties);
  const header = [
    '---',
    `title: ${JSON.stringify(entry.title)}`,
    `id: ${JSON.stringify(entry.id)}`,
    `created: ${JSON.stringify(entry.createdAt)}`,
    `updated: ${JSON.stringify(entry.updatedAt)}`,
    `blocks: ${entry.blocks.length}`,
    ...marked.flatMap((p) => [
      `${frontMatterKey(p.name)}:`,
      ...p.values.map((v) => `  - ${JSON.stringify(v)}`),
    ]),
    '---',
    `# ${entry.title}`,
    '',
    '<!-- ENTRADA -->',
    `**ID:** \`${entry.id}\`  `,
    `**Criado em:** ${formatLunodaLocal(entry.createdAt, timeZone)}  `,
    `**Modificado em:** ${formatLunodaLocal(entry.updatedAt, timeZone)}  `,
    `**Total de blocos:** ${entry.blocks.length}  `,
    '',
    ...propertyLines(marked),
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
  return header + entry.blocks.map((b, i) => blockSection(b, i + 1, properties)).join('');
}
