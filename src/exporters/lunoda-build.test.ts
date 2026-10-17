import { describe, expect, it } from 'vitest';
import { DEFAULT_EXPORT_OPTIONS, type Conversation } from '../core/model';
import {
  SYNTHETIC_CONVERSATION,
  SYNTHETIC_NOW,
  syntheticIds,
} from '../tests/synthetic-conversation';
import { buildLunodaDocument, buildLunodaEntry, formatFileSize } from './lunoda-build';

const ctx = () => ({ newId: syntheticIds(), now: SYNTHETIC_NOW });
const both = { includeThinking: true, includeFiles: true };
const none = { includeThinking: false, includeFiles: false };

const shape = (c: Conversation, opts = both) =>
  buildLunodaEntry(c, opts, ctx()).blocks.map((b) => `${b.subtitle} v${b.version}`);

describe('buildLunodaEntry', () => {
  it('ordena Prompt -> Pensamento -> Claude por turno e termina no pedido sem resposta', () => {
    expect(shape(SYNTHETIC_CONVERSATION)).toEqual([
      'Prompt v1',
      'Pensamento v1',
      'Claude v1',
      'Prompt v2',
      'Claude v2',
      'Prompt v3',
    ]);
  });

  it('sem includeThinking nao gera bloco Pensamento (padrao do primeiro uso)', () => {
    expect(DEFAULT_EXPORT_OPTIONS.includeThinking).toBe(false);
    expect(shape(SYNTHETIC_CONVERSATION, { ...DEFAULT_EXPORT_OPTIONS })).not.toContain(
      'Pensamento v1',
    );
  });

  it('junta varios blocos de pensamento com uma linha em branco', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(entry.blocks[1]?.content).toBe(
      'O usuário anexou um .txt e quer contar palavras.\n\nResposta curta: wc -w, com um exemplo.',
    );
  });

  it('acrescenta as listas de arquivos so com includeFiles', () => {
    const on = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx()).blocks;
    expect(on[0]?.content).toBe(
      'Como eu conto as palavras deste arquivo no terminal?\n\n**Arquivos anexados:**\n- `notas.txt` — text/plain, 2,0 KB',
    );
    expect(
      on[4]?.content.endsWith(
        '\n\n**Arquivos gerados:**\n- `contar.ps1` — text/x-powershell, 312 B',
      ),
    ).toBe(true);
    const off = buildLunodaEntry(SYNTHETIC_CONVERSATION, none, ctx()).blocks;
    expect(off[0]?.content).toBe('Como eu conto as palavras deste arquivo no terminal?');
  });

  it('mensagem so com anexo vira so a lista, sem linhas em branco na frente', () => {
    const c: Conversation = {
      ...SYNTHETIC_CONVERSATION,
      turns: [
        {
          index: 1,
          user: {
            text: '',
            thinking: [],
            attachments: [{ name: 'a.pdf', kind: 'application/pdf' }],
            generated: [],
          },
        },
      ],
    };
    expect(buildLunodaEntry(c, both, ctx()).blocks[0]?.content).toBe(
      '**Arquivos anexados:**\n- `a.pdf` — application/pdf',
    );
  });

  it('preenche a entrada no formato medido, com IDs unicos', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(Object.keys(entry)).toEqual([
      'id',
      'title',
      'description',
      'propertyValues',
      'propertyAutoFlags',
      'blocks',
      'createdAt',
      'updatedAt',
    ]);
    expect(Object.keys(entry.blocks[0]!)).toEqual([
      'id',
      'subtitle',
      'version',
      'content',
      'blockProps',
    ]);
    expect(entry.createdAt).toBe(SYNTHETIC_NOW);
    const ids = [entry.id, ...entry.blocks.map((b) => b.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('poe o link na descricao e marca «IA Utilizada» na entrada e so nos blocos da IA', () => {
    const entry = buildLunodaEntry(SYNTHETIC_CONVERSATION, both, ctx());
    expect(entry.description).toBe(SYNTHETIC_CONVERSATION.url);
    expect(entry.propertyValues['p-ia']).toEqual(['o4']);
    expect(entry.blocks.map((b) => [b.subtitle, b.blockProps])).toEqual([
      ['Prompt', {}],
      ['Pensamento', {}],
      ['Claude', { 'p-ia': ['o4'] }],
      ['Prompt', {}],
      ['Claude', { 'p-ia': ['o4'] }],
      ['Prompt', {}],
    ]);
  });

  it('documento traz as propriedades padrao sem compartilhar referencia', () => {
    const a = buildLunodaDocument([]);
    const b = buildLunodaDocument([]);
    expect(a.properties.map((p) => p.id)).toEqual(['p-tags', 'p-ia']);
    a.properties[0]!.name = 'mudou';
    expect(b.properties[0]!.name).toBe('Tags');
  });
});

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1,0 KB'],
    [1536, '1,5 KB'],
    [5 * 1024 * 1024, '5,0 MB'],
  ])('%i bytes -> %s', (bytes, text) => {
    expect(formatFileSize(bytes)).toBe(text);
  });
});
