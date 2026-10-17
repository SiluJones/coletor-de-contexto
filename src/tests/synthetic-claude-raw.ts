/**
 * Resposta SINTETICA no formato do claude.ai (o repositorio e publico: conteudo inventado — DEC-009).
 *
 * A FORMA copia o que foi medido em 4 capturas reais em 2026-10-16 (CONTEXT, «Formato da resposta do
 * Claude»): `text` da mensagem vazio, texto em `content[]`, ferramentas intercaladas, pensamento so em
 * `summaries`, anexos em `attachments`/`files`, arvore com um pedido EDITADO (ramo abandonado),
 * duas mensagens seguidas da IA (a segunda vazia) e conversa terminando num pedido sem resposta.
 */

const ROOT = '00000000-0000-4000-8000-000000000000';

const text = (t: string) => ({
  start_timestamp: '2026-10-16T20:00:00.000000Z',
  stop_timestamp: '2026-10-16T20:00:01.000000Z',
  type: 'text',
  text: t,
  citations: [],
});

const thinking = (...summaries: string[]) => ({
  start_timestamp: '2026-10-16T20:00:00.000000Z',
  stop_timestamp: '2026-10-16T20:00:01.000000Z',
  type: 'thinking',
  thinking: '',
  summaries: summaries.map((summary) => ({ summary })),
  cut_off: false,
  truncated: false,
  hidden: false,
  thinking_hidden: true,
});

const tool = (id: string) => [
  {
    type: 'tool_use',
    id,
    name: 'bash_tool',
    input: { command: 'wc -w notas.txt' },
    message: 'Contando',
    integration_name: null,
  },
  {
    type: 'tool_result',
    tool_use_id: id,
    name: 'bash_tool',
    content: [{ type: 'text', text: '412 notas.txt' }],
    is_error: false,
  },
];

const msg = (
  uuid: string,
  parent: string,
  sender: 'human' | 'assistant',
  index: number,
  content: unknown[],
  extra: Record<string, unknown> = {},
) => ({
  uuid,
  text: '',
  content,
  sender,
  index,
  created_at: `2026-10-16T20:0${index}:00.000000Z`,
  updated_at: `2026-10-16T20:0${index}:00.000000Z`,
  truncated: false,
  attachments: [],
  files: [],
  sync_sources: [],
  parent_message_uuid: parent,
  ...(sender === 'assistant' ? { stop_reason: 'end_turn' } : {}),
  ...extra,
});

const id = (n: number) => `aaaaaaaa-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const SYNTHETIC_CLAUDE_RAW = {
  uuid: '11111111-2222-4333-8444-555555555555',
  name: 'Sintética 1 — contar palavras',
  summary: '',
  model: 'claude-x',
  created_at: '2026-10-16T20:00:00.000000Z',
  updated_at: '2026-10-16T20:09:00.000000Z',
  settings: {},
  is_starred: false,
  current_leaf_message_uuid: id(8),
  chat_messages: [
    msg(id(1), ROOT, 'human', 0, [text('Quantas palavras tem este arquivo?')], {
      attachments: [
        {
          id: 'x',
          file_name: 'notas.txt',
          file_size: 2048,
          file_type: 'text/plain',
          extracted_content: 'NAO DEVE APARECER NA EXPORTACAO',
          created_at: '2026-10-16T20:00:00.000000Z',
        },
      ],
      files: [{ file_kind: 'image', file_name: 'print.png', size_bytes: 95547, success: true }],
    }),
    msg(id(2), id(1), 'assistant', 1, [
      thinking('Lendo o anexo.', 'Escolhendo o comando.'),
      text('Vou contar com o `wc`.'),
      ...tool('t1'),
      thinking('Conferindo a saida.'),
      text('São **412** palavras.'),
    ]),
    // Pedido editado: o primeiro ramo (id 3/4) foi abandonado; o atual segue por id 5.
    msg(id(3), id(2), 'human', 2, [text('PEDIDO ANTIGO, ANTES DE EDITAR')]),
    msg(id(4), id(3), 'assistant', 3, [text('RESPOSTA DO RAMO ABANDONADO')]),
    msg(id(5), id(2), 'human', 4, [text('E sem contar as linhas vazias?')]),
    msg(
      id(6),
      id(5),
      'assistant',
      5,
      [text('Use `grep -c .` para as linhas não vazias.'), ...tool('t2')],
      {
        stop_reason: 'tool_use',
      },
    ),
    // Continuacao da mesma resposta, e uma mensagem vazia (resposta abortada) logo depois.
    msg(id(7), id(6), 'assistant', 6, [text('Deixei o script pronto.')], {
      files: [{ file_kind: 'blob', file_name: 'contar.sh', size_bytes: 312, download_source: 'x' }],
    }),
    msg(id(9), id(7), 'assistant', 7, []),
    msg(id(8), id(9), 'human', 8, [text('Obrigado! Última pergunta depois.')]),
  ],
};
