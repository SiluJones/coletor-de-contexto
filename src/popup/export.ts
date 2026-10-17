/**
 * Exportacao do botao «Exportar para o Lunoda»: resposta bruta -> `.json` + `.md` (passo 8 da spec).
 * Parte pura (sem navegador), para ser testada de ponta a ponta.
 */

import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { safeFileName } from '../core/filename';
import type { ExportOptions } from '../core/model';
import {
  buildLunodaDocument,
  buildLunodaEntry,
  type BuildContext,
} from '../exporters/lunoda-build';
import { renderLunodaJson } from '../exporters/lunoda-json';
import { renderLunodaMd } from '../exporters/lunoda-md';

/** Os dois arquivos da exportacao e o nome-base (titulo da conversa, seguro para o Windows). */
export interface ExportFiles {
  baseName: string;
  json: string;
  md: string;
  turns: number;
}

/**
 * Gera os arquivos do Lunoda a partir da resposta bruta do Claude.
 * @param raw JSON da resposta, ja parseado.
 * @param options o que incluir alem do texto.
 * @param ctx relogio e gerador de IDs.
 * @param timeZone fuso das datas do `.md`; omitido = fuso do navegador.
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildLunodaExport(
  raw: unknown,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): ExportFiles {
  const conversation = normalizeClaudeConversation(raw);
  const entry = buildLunodaEntry(conversation, options, ctx);
  const doc = buildLunodaDocument([entry]);
  return {
    baseName: safeFileName(conversation.title),
    json: renderLunodaJson(doc),
    md: renderLunodaMd(entry, doc.properties, timeZone),
    turns: conversation.turns.length,
  };
}
