/**
 * Exportacao do botao «Exportar»: resposta bruta -> arquivos dos formatos escolhidos (DEC-011, DEC-012).
 * Parte pura (sem navegador), para ser testada de ponta a ponta.
 */

import { normalizeClaudeConversation } from '../adapters/claude/normalize';
import { safeFileName } from '../core/filename';
import type { Conversation, ExportOptions } from '../core/model';
import { renderCdcJson } from '../exporters/cdc-json';
import {
  buildLunodaDocument,
  buildLunodaEntry,
  type BuildContext,
} from '../exporters/lunoda-build';
import { renderLunodaJson } from '../exporters/lunoda-json';
import { renderLunodaMd } from '../exporters/lunoda-md';
import { renderSimpleMarkdown } from '../exporters/simple-md';
import type { ExportSettings } from './settings';

/** Os dois arquivos do Lunoda e o nome-base (titulo da conversa, seguro para o Windows). */
export interface ExportFiles {
  baseName: string;
  json: string;
  md: string;
  turns: number;
}

/** Um arquivo a baixar. */
export interface DownloadFile {
  filename: string;
  content: string;
  mime: string;
}

function lunodaFiles(
  conversation: Conversation,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): { json: string; md: string } {
  const entry = buildLunodaEntry(conversation, options, ctx);
  const doc = buildLunodaDocument([entry]);
  return { json: renderLunodaJson(doc), md: renderLunodaMd(entry, doc.properties, timeZone) };
}

/**
 * Gera os arquivos do Lunoda a partir da resposta bruta do Claude.
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildLunodaExport(
  raw: unknown,
  options: ExportOptions,
  ctx: BuildContext,
  timeZone?: string,
): ExportFiles {
  const conversation = normalizeClaudeConversation(raw);
  return {
    baseName: safeFileName(conversation.title),
    ...lunodaFiles(conversation, options, ctx, timeZone),
    turns: conversation.turns.length,
  };
}

/**
 * Monta TODOS os arquivos dos formatos marcados, com nomes que comecam pelo titulo da conversa:
 * `<titulo>.json` + `<titulo>.md` (Lunoda), `<titulo> (simples).md` e `<titulo>.cdc.json`.
 * Nenhum formato marcado -> lista vazia (o popup avisa).
 * @throws ClaudeFormatError quando o formato da resposta mudou.
 */
export function buildExportDownloads(
  raw: unknown,
  settings: ExportSettings,
  ctx: BuildContext,
  timeZone?: string,
): { baseName: string; turns: number; files: DownloadFile[] } {
  const conversation = normalizeClaudeConversation(raw);
  const baseName = safeFileName(conversation.title);
  const files: DownloadFile[] = [];
  if (settings.formats.lunoda) {
    const { json, md } = lunodaFiles(conversation, settings, ctx, timeZone);
    files.push({ filename: `${baseName}.json`, content: json, mime: 'application/json' });
    files.push({ filename: `${baseName}.md`, content: md, mime: 'text/markdown' });
  }
  if (settings.formats.simpleMd) {
    files.push({
      filename: `${baseName} (simples).md`,
      content: renderSimpleMarkdown(conversation, settings, { now: ctx.now, timeZone }),
      mime: 'text/markdown',
    });
  }
  if (settings.formats.cdcJson) {
    files.push({
      filename: `${baseName}.cdc.json`,
      content: renderCdcJson(conversation, ctx.now),
      mime: 'application/json',
    });
  }
  return { baseName, turns: conversation.turns.length, files };
}
