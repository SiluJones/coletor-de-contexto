/**
 * Conversa SINTETICA usada como fixture (o repositorio e publico: nada de conversa real aqui).
 *
 * Cobre: acentos, bloco de codigo, tabela, linha com dois espacos no fim, pensamento, anexo do
 * usuario, arquivo gerado pela IA e uma conversa que termina num pedido sem resposta.
 */

import { createIdGenerator } from '../core/ids';
import type { Conversation } from '../core/model';

/** Instante fixo da "exportacao" da fixture. */
export const SYNTHETIC_NOW = '2026-10-16T21:30:00.000Z';

/** Gerador de IDs deterministico: relogio parado em SYNTHETIC_NOW e aleatorio por LCG com semente. */
export function syntheticIds(): () => string {
  let seed = 42;
  const random = (): number => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return createIdGenerator(() => Date.parse(SYNTHETIC_NOW), random);
}

export const SYNTHETIC_CONVERSATION: Conversation = {
  platform: 'claude',
  sourceId: '00000000-0000-4000-8000-000000000000',
  title: 'Conversa sintética — contar palavras',
  url: 'https://claude.ai/chat/00000000-0000-4000-8000-000000000000',
  createdAt: '2026-10-16T20:00:00.000Z',
  updatedAt: '2026-10-16T20:05:00.000Z',
  turns: [
    {
      index: 1,
      user: {
        text: 'Como eu conto as palavras deste arquivo no terminal?',
        thinking: [],
        attachments: [{ name: 'notas.txt', kind: 'text/plain', size: 2048 }],
        generated: [],
      },
      assistant: {
        text: [
          'No Linux ou no macOS, use o `wc`:',
          '',
          '```bash',
          'wc -w notas.txt',
          '```',
          '',
          'A saída é o número de palavras seguido do nome do arquivo.  ',
          'Para várias pastas, combine com `find`.',
        ].join('\n'),
        thinking: [
          'O usuário anexou um .txt e quer contar palavras.',
          'Resposta curta: wc -w, com um exemplo.',
        ],
        attachments: [],
        generated: [],
      },
    },
    {
      index: 2,
      user: {
        text: 'E no Windows, sem instalar nada?',
        thinking: [],
        attachments: [],
        generated: [],
      },
      assistant: {
        text: [
          'No PowerShell:',
          '',
          '| Comando | O que conta |',
          '|---|---|',
          '| `Get-Content notas.txt -Raw` + `Measure-Object -Word` | palavras |',
          '| `(Get-Content notas.txt).Count` | linhas |',
          '',
          'Deixei um script pronto.',
        ].join('\n'),
        thinking: [],
        attachments: [],
        generated: [{ name: 'contar.ps1', kind: 'text/x-powershell', size: 312 }],
      },
    },
    {
      index: 3,
      user: {
        text: 'Obrigado! E para contar só as linhas que não estão vazias?',
        thinking: [],
        attachments: [],
        generated: [],
      },
    },
  ],
};
