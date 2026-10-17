/**
 * Conversation (modelo canonico) -> entrada do Lunoda (DEC-003, DEC-004, DEC-008).
 *
 * Ordem dos blocos por turno: Prompt vN -> [Pensamento vN] -> <IA> vN. O pensamento so entra com
 * `includeThinking`; as listas de arquivos so entram com `includeFiles`.
 * A descricao da entrada e o link da conversa, e a propriedade «IA Utilizada» vem marcada na entrada e
 * nos blocos da IA — o mesmo que o dono fazia a mao no Lunoda (DEC-011).
 */

import type { Conversation, ExportOptions, FileRef, Message } from '../core/model';
import { PLATFORM_LABEL } from '../core/model';
import type { Platform } from '../core/model';
import type { LunodaBlock, LunodaDocument, LunodaEntry } from './lunoda-types';
import { defaultLunodaProperties } from './lunoda-types';

/** Opcao de «IA Utilizada» (`p-ia`) de cada plataforma, nas propriedades padrao do Lunoda. */
export const PLATFORM_IA_OPTION: Record<Platform, string> = {
  claude: 'o4',
  gemini: 'o5',
  chatgpt: 'o6',
};

/** Dependencias injetaveis da montagem (relogio e IDs), para os testes serem deterministicos. */
export interface BuildContext {
  /** Gera um ID do Lunoda (ver `createIdGenerator` em `core/ids.ts`). */
  newId: () => string;
  /** Instante da exportacao em ISO 8601 UTC; vira `createdAt` e `updatedAt` da entrada. */
  now: string;
}

/** Subtitulo do bloco de pensamento (DEC-008). */
export const THINKING_SUBTITLE = 'Pensamento';
/** Subtitulo do bloco do pedido do usuario. */
export const PROMPT_SUBTITLE = 'Prompt';

/**
 * Tamanho legivel em pt-BR: `512 B`, `1,5 KB`, `2,3 MB`. Uma casa decimal a partir de KB.
 * @param bytes tamanho em bytes (inteiro >= 0).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(1).replace('.', ',')} ${units[unit]}`;
}

/** Uma linha da lista de arquivos: `` - `nome` — tipo, tamanho `` (sem tamanho quando desconhecido). */
function fileLine(file: FileRef): string {
  const size = file.size === undefined ? '' : `, ${formatFileSize(file.size)}`;
  return `- \`${file.name}\` — ${file.kind}${size}`;
}

/** Acrescenta uma secao de arquivos ao texto, separada por uma linha em branco (DEC-008). */
function withFiles(text: string, heading: string, files: FileRef[]): string {
  if (files.length === 0) return text;
  const section = [`**${heading}:**`, ...files.map(fileLine)].join('\n');
  return text === '' ? section : `${text}\n\n${section}`;
}

function userContent(msg: Message, options: ExportOptions): string {
  return options.includeFiles
    ? withFiles(msg.text, 'Arquivos anexados', msg.attachments)
    : msg.text;
}

function assistantContent(msg: Message, options: ExportOptions): string {
  return options.includeFiles ? withFiles(msg.text, 'Arquivos gerados', msg.generated) : msg.text;
}

/**
 * Monta a entrada do Lunoda de uma conversa.
 * @param conversation conversa ja normalizada (so o ramo atual).
 * @param options o que incluir alem do texto.
 * @param ctx relogio e gerador de IDs.
 */
export function buildLunodaEntry(
  conversation: Conversation,
  options: ExportOptions,
  ctx: BuildContext,
): LunodaEntry {
  const entryId = ctx.newId();
  const aiLabel = PLATFORM_LABEL[conversation.platform];
  const iaOption = PLATFORM_IA_OPTION[conversation.platform];
  const blocks: LunodaBlock[] = [];
  const push = (subtitle: string, version: number, content: string): void => {
    // So o bloco da IA leva «IA Utilizada»; Prompt e Pensamento ficam sem (como o dono marcava).
    const blockProps = subtitle === aiLabel ? { 'p-ia': [iaOption] } : {};
    blocks.push({ id: ctx.newId(), subtitle, version, content, blockProps });
  };

  for (const turn of conversation.turns) {
    push(PROMPT_SUBTITLE, turn.index, userContent(turn.user, options));
    const reply = turn.assistant;
    if (!reply) continue;
    if (options.includeThinking && reply.thinking.length > 0) {
      push(THINKING_SUBTITLE, turn.index, reply.thinking.join('\n\n'));
    }
    push(aiLabel, turn.index, assistantContent(reply, options));
  }

  return {
    id: entryId,
    title: conversation.title,
    description: conversation.url,
    propertyValues: { 'p-tags': [], 'p-ia': [iaOption] },
    propertyAutoFlags: {},
    blocks,
    createdAt: ctx.now,
    updatedAt: ctx.now,
  };
}

/** Documento do Lunoda com as propriedades padrao e as entradas dadas. */
export function buildLunodaDocument(entries: LunodaEntry[]): LunodaDocument {
  return { properties: defaultLunodaProperties(), entries };
}
