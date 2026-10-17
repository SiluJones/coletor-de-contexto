/**
 * Testes de ouro dos exportadores do Lunoda.
 *
 * 1. Par SINTETICO versionado (`src/tests/fixtures/lunoda/`): regressao byte a byte. Ele foi gravado
 *    pelo proprio codigo (toMatchFileSnapshot), entao prova estabilidade, nao fidelidade ao Lunoda.
 * 2. Oraculo PRIVADO, fora do repositorio: pares `<nome>.json` + `<nome>.md` exportados PELO Lunoda,
 *    numa pasta apontada por CDC_LUNODA_ORACLE_DIR. E ele que prova fidelidade. Sem a variavel, o
 *    bloco e pulado (e o resumo do Vitest mostra «skipped»).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SYNTHETIC_CONVERSATION,
  SYNTHETIC_NOW,
  syntheticIds,
} from '../tests/synthetic-conversation';
import { buildLunodaDocument, buildLunodaEntry } from './lunoda-build';
import { parseLunodaJson, renderLunodaJson } from './lunoda-json';
import { renderLunodaMd } from './lunoda-md';

const FIXTURE_DIR = '../tests/fixtures/lunoda';

describe('par sintetico versionado', () => {
  const entry = buildLunodaEntry(
    SYNTHETIC_CONVERSATION,
    { includeThinking: true, includeFiles: true },
    { newId: syntheticIds(), now: SYNTHETIC_NOW },
  );
  const doc0 = buildLunodaDocument([entry]);
  const json = renderLunodaJson(doc0);
  const md = renderLunodaMd(entry, doc0.properties, 'America/Sao_Paulo');

  it('json bate com a fixture', async () => {
    await expect(json).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.json`);
  });

  it('md bate com a fixture', async () => {
    await expect(md).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.md`);
  });

  it('json lido de volta reproduz o mesmo json e o mesmo md', () => {
    const doc = parseLunodaJson(json);
    expect(renderLunodaJson(doc)).toBe(json);
    expect(renderLunodaMd(doc.entries[0]!, doc.properties, 'America/Sao_Paulo')).toBe(md);
  });
});

const oracleDir = process.env.CDC_LUNODA_ORACLE_DIR;
const oraclePairs =
  oracleDir && existsSync(oracleDir)
    ? readdirSync(oracleDir)
        .filter(
          (f) => f.endsWith('.json') && existsSync(join(oracleDir, f.replace(/\.json$/, '.md'))),
        )
        .map((f) => f.replace(/\.json$/, ''))
    : [];

describe.skipIf(!oracleDir)('oraculo privado do Lunoda (CDC_LUNODA_ORACLE_DIR)', () => {
  it('a pasta tem ao menos um par .json + .md', () => {
    expect(oraclePairs.length).toBeGreaterThan(0);
  });

  it.each(oraclePairs)('%s: json e md reproduzidos byte a byte', (name) => {
    const json = readFileSync(join(oracleDir!, `${name}.json`), 'utf8');
    const md = readFileSync(join(oracleDir!, `${name}.md`), 'utf8');
    const doc = parseLunodaJson(json);
    expect(renderLunodaJson(doc)).toBe(json);
    expect(renderLunodaMd(doc.entries[0]!, doc.properties, 'America/Sao_Paulo')).toBe(md);
  });
});
