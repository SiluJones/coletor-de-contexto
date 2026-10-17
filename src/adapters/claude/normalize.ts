/**
 * Resposta bruta do claude.ai -> Conversation (modelo canonico). Passo 7 da spec, DEC-011.
 *
 * Formato MEDIDO em 4 capturas reais (2026-10-16; CONTEXT, «Formato da resposta do Claude»):
 * - `chat_messages[]` com `uuid`, `sender` ("human" | "assistant"), `parent_message_uuid` e `content[]`;
 *   a conversa e uma arvore, e o ramo da tela vai da raiz ate `current_leaf_message_uuid`.
 * - O campo `text` da mensagem vem VAZIO; o texto real esta nos itens `content[].type === "text"`,
 *   intercalados com `thinking`, `tool_use` e `tool_result`.
 * - O pensamento completo NAO vem (`thinking` vazio, as vezes `thinking_hidden`); vem `summaries[].summary`.
 * - Anexos do usuario: `attachments[]` (`file_name`, `file_type`, `file_size`) e `files[]` (`file_name`,
 *   `file_kind`, `size_bytes`); arquivos gerados pela IA: `files[]` da mensagem da IA.
 * - Pode haver duas mensagens seguidas da IA (continuacao, ou mensagem vazia): viram UMA resposta.
 */

import type { Conversation, FileRef, Message, Turn } from '../../core/model';

/** Erro de formato: a plataforma mudou a resposta e o adaptador nao reconhece mais. */
export class ClaudeFormatError extends Error {
  override name = 'ClaudeFormatError';
  constructor(detail: string) {
    super(`Formato da conversa do Claude mudou: ${detail}`);
  }
}

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

function str(o: Obj, key: string, where: string): string {
  const v = o[key];
  if (typeof v !== 'string') throw new ClaudeFormatError(`${where}.${key} nao e texto`);
  return v;
}

/** Lista opcional: ausente vira vazia; presente e nao-lista e erro. */
function list(o: Obj, key: string, where: string): unknown[] {
  const v = o[key];
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) throw new ClaudeFormatError(`${where}.${key} nao e lista`);
  return v;
}

/** Converte `attachments[]` e `files[]` em referencias, sem nunca levar o conteudo do arquivo. */
function fileRefs(m: Obj, where: string): FileRef[] {
  const refs: FileRef[] = [];
  for (const a of list(m, 'attachments', where)) {
    if (!isObj(a) || typeof a.file_name !== 'string') continue;
    refs.push({
      name: a.file_name,
      kind: typeof a.file_type === 'string' && a.file_type ? a.file_type : 'arquivo',
      ...(typeof a.file_size === 'number' ? { size: a.file_size } : {}),
    });
  }
  for (const f of list(m, 'files', where)) {
    if (!isObj(f) || typeof f.file_name !== 'string') continue;
    refs.push({
      name: f.file_name,
      kind: typeof f.file_kind === 'string' && f.file_kind ? f.file_kind : 'arquivo',
      ...(typeof f.size_bytes === 'number' ? { size: f.size_bytes } : {}),
    });
  }
  return refs;
}

/**
 * Pensamento de um item `thinking`: o texto completo quando vier; senao, os resumos como lista.
 * Devolve '' quando nao ha nada legivel.
 */
function thinkingText(c: Obj): string {
  if (typeof c.thinking === 'string' && c.thinking.trim() !== '') return c.thinking;
  const summaries = Array.isArray(c.summaries) ? c.summaries : [];
  return summaries
    .map((s) => (isObj(s) && typeof s.summary === 'string' ? s.summary.trim() : ''))
    .filter((s) => s !== '')
    .map((s) => `- ${s}`)
    .join('\n');
}

/** Uma mensagem bruta -> Message (ferramentas ficam de fora: `tool_use`/`tool_result`). */
function toMessage(m: Obj, where: string): { sender: 'human' | 'assistant'; msg: Message } {
  const sender = m.sender;
  if (sender !== 'human' && sender !== 'assistant') {
    throw new ClaudeFormatError(`${where}.sender inesperado (${String(sender)})`);
  }
  const texts: string[] = [];
  const thinking: string[] = [];
  list(m, 'content', where).forEach((c, i) => {
    if (!isObj(c)) throw new ClaudeFormatError(`${where}.content[${i}] nao e objeto`);
    if (c.type === 'text') {
      const t = str(c, 'text', `${where}.content[${i}]`);
      if (t.trim() !== '') texts.push(t);
    } else if (c.type === 'thinking') {
      const t = thinkingText(c);
      if (t !== '') thinking.push(t);
    }
  });
  const files = fileRefs(m, where);
  const createdAt = typeof m.created_at === 'string' ? m.created_at : undefined;
  return {
    sender,
    msg: {
      text: texts.join('\n\n'),
      thinking,
      attachments: sender === 'human' ? files : [],
      generated: sender === 'assistant' ? files : [],
      ...(createdAt ? { createdAt } : {}),
    },
  };
}

const isEmpty = (m: Message): boolean =>
  m.text === '' &&
  m.thinking.length === 0 &&
  m.attachments.length === 0 &&
  m.generated.length === 0;

/** Junta a continuacao de uma resposta na resposta anterior do mesmo turno. */
function merge(a: Message, b: Message): Message {
  return {
    text: [a.text, b.text].filter((t) => t !== '').join('\n\n'),
    thinking: [...a.thinking, ...b.thinking],
    attachments: [...a.attachments, ...b.attachments],
    generated: [...a.generated, ...b.generated],
    ...(a.createdAt ? { createdAt: a.createdAt } : {}),
  };
}

/**
 * Normaliza a resposta de `chat_conversations/{id}?tree=True&rendering_mode=messages`.
 * @param raw o JSON da resposta, ja parseado.
 * @throws ClaudeFormatError quando falta campo essencial ou o ramo atual nao fecha.
 */
export function normalizeClaudeConversation(raw: unknown): Conversation {
  if (!isObj(raw)) throw new ClaudeFormatError('a resposta nao e um objeto');
  const uuid = str(raw, 'uuid', 'conversa');
  const name = str(raw, 'name', 'conversa');
  const createdAt = str(raw, 'created_at', 'conversa');
  const updatedAt = str(raw, 'updated_at', 'conversa');
  const leaf = str(raw, 'current_leaf_message_uuid', 'conversa');
  const all = raw.chat_messages;
  if (!Array.isArray(all)) throw new ClaudeFormatError('conversa.chat_messages nao e lista');

  const byId = new Map<string, Obj>();
  all.forEach((m, i) => {
    if (!isObj(m)) throw new ClaudeFormatError(`chat_messages[${i}] nao e objeto`);
    byId.set(str(m, 'uuid', `chat_messages[${i}]`), m);
  });

  // Ramo atual: da folha ate a raiz, seguindo parent_message_uuid; depois inverte.
  const path: Obj[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined = leaf;
  if (!byId.has(leaf))
    throw new ClaudeFormatError('current_leaf_message_uuid nao esta nas mensagens');
  while (cursor !== undefined && byId.has(cursor)) {
    if (seen.has(cursor)) throw new ClaudeFormatError('ciclo em parent_message_uuid');
    seen.add(cursor);
    const m: Obj = byId.get(cursor)!;
    path.push(m);
    cursor = typeof m.parent_message_uuid === 'string' ? m.parent_message_uuid : undefined;
  }
  path.reverse();

  const turns: Turn[] = [];
  path.forEach((m, i) => {
    const { sender, msg } = toMessage(m, `ramo[${i}]`);
    if (isEmpty(msg)) return; // mensagem vazia (resposta abortada): nao vira bloco
    const current = turns[turns.length - 1];
    if (sender === 'human') {
      turns.push({ index: turns.length + 1, user: msg });
    } else if (!current) {
      // Resposta sem pedido antes (nao visto nas capturas): turno com pedido vazio.
      turns.push({
        index: 1,
        user: { text: '', thinking: [], attachments: [], generated: [] },
        assistant: msg,
      });
    } else {
      current.assistant = current.assistant ? merge(current.assistant, msg) : msg;
    }
  });

  return {
    platform: 'claude',
    sourceId: uuid,
    title: name.trim() || 'Conversa sem título',
    url: `https://claude.ai/chat/${uuid}`,
    ...(typeof raw.model === 'string' && raw.model ? { model: raw.model } : {}),
    createdAt,
    updatedAt,
    turns,
  };
}
