/**
 * «JSON do CDC»: a conversa normalizada INTEIRA, com tudo que foi capturado (DEC-012).
 *
 * E o formato de arquivo do proprio projeto: serve para guardar e para reprocessar depois (gerar outro
 * formato sem buscar a conversa de novo). Por isso ignora as opcoes de exportacao — pensamento e
 * arquivos vao sempre. O envelope tem nome e versao do formato para leitores futuros saberem o que
 * estao lendo.
 */

import type { Conversation } from '../core/model';

/** Nome do formato no envelope. */
export const CDC_FORMAT = 'coletor-de-contexto';
/** Versao do formato. Mude so com mudanca incompativel do modelo canonico (e registre em DECISIONS). */
export const CDC_FORMAT_VERSION = 1;

/** Envelope do arquivo. */
export interface CdcFile {
  format: typeof CDC_FORMAT;
  version: typeof CDC_FORMAT_VERSION;
  /** Instante da exportacao (ISO 8601 UTC). */
  exportedAt: string;
  conversation: Conversation;
}

/**
 * Serializa a conversa no formato do CDC: 2 espacos de indentacao e quebra de linha no fim.
 * @param conversation conversa normalizada.
 * @param exportedAt instante da exportacao (ISO 8601 UTC).
 */
export function renderCdcJson(conversation: Conversation, exportedAt: string): string {
  const file: CdcFile = {
    format: CDC_FORMAT,
    version: CDC_FORMAT_VERSION,
    exportedAt,
    conversation,
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}
