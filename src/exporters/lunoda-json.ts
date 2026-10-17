/**
 * Leitura e escrita do `.json` do Lunoda.
 *
 * Escrita: `JSON.stringify(doc, null, 2)` SEM quebra de linha final e com acentos crus — medido no
 * `mapsmith 12.json`, que e reproduzido byte a byte assim.
 */

import type { LunodaBlock, LunodaDocument, LunodaEntry } from './lunoda-types';

/** Serializa o documento exatamente como o Lunoda grava. */
export function renderLunodaJson(doc: LunodaDocument): string {
  return JSON.stringify(doc, null, 2);
}

/** Erro de arquivo do Lunoda fora do formato esperado. */
export class LunodaFormatError extends Error {
  override name = 'LunodaFormatError';
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function req<T>(ok: boolean, value: T, where: string): T {
  if (!ok) throw new LunodaFormatError(`Formato do Lunoda inesperado em ${where}`);
  return value;
}

function parseBlock(b: unknown, where: string): LunodaBlock {
  req(isObject(b), b, where);
  const o = b as Record<string, unknown>;
  return {
    id: req(typeof o.id === 'string', o.id as string, `${where}.id`),
    subtitle: req(typeof o.subtitle === 'string', o.subtitle as string, `${where}.subtitle`),
    version: req(typeof o.version === 'number', o.version as number, `${where}.version`),
    content: req(typeof o.content === 'string', o.content as string, `${where}.content`),
    blockProps: req(
      isObject(o.blockProps),
      o.blockProps as Record<string, unknown>,
      `${where}.blockProps`,
    ),
  };
}

function parseEntry(e: unknown, where: string): LunodaEntry {
  req(isObject(e), e, where);
  const o = e as Record<string, unknown>;
  const blocks = req(Array.isArray(o.blocks), o.blocks as unknown[], `${where}.blocks`);
  return {
    id: req(typeof o.id === 'string', o.id as string, `${where}.id`),
    title: req(typeof o.title === 'string', o.title as string, `${where}.title`),
    description: req(
      typeof o.description === 'string',
      o.description as string,
      `${where}.description`,
    ),
    propertyValues: req(
      isObject(o.propertyValues),
      o.propertyValues as Record<string, string[]>,
      `${where}.propertyValues`,
    ),
    propertyAutoFlags: req(
      isObject(o.propertyAutoFlags),
      o.propertyAutoFlags as Record<string, unknown>,
      `${where}.propertyAutoFlags`,
    ),
    blocks: blocks.map((b, i) => parseBlock(b, `${where}.blocks[${i}]`)),
    createdAt: req(typeof o.createdAt === 'string', o.createdAt as string, `${where}.createdAt`),
    updatedAt: req(typeof o.updatedAt === 'string', o.updatedAt as string, `${where}.updatedAt`),
  };
}

/**
 * Le um `.json` do Lunoda, conferindo os campos que o projeto usa. Chaves desconhecidas sao
 * descartadas — por isso `renderLunodaJson(parseLunodaJson(x))` so devolve `x` quando o arquivo
 * tem exatamente as chaves medidas (como o `mapsmith 12`).
 * @throws LunodaFormatError quando falta campo ou o tipo nao bate.
 */
export function parseLunodaJson(text: string): LunodaDocument {
  const raw: unknown = JSON.parse(text);
  req(isObject(raw), raw, 'raiz');
  const o = raw as Record<string, unknown>;
  const properties = req(Array.isArray(o.properties), o.properties, 'properties');
  const entries = req(Array.isArray(o.entries), o.entries as unknown[], 'entries');
  return {
    // Propriedades passam como estao: o projeto nao as interpreta, so as preserva.
    properties: properties as LunodaDocument['properties'],
    entries: entries.map((e, i) => parseEntry(e, `entries[${i}]`)),
  };
}
