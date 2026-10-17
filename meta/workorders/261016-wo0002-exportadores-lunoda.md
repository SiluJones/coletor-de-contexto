# WO 0002 — exportadores Lunoda JSON e MD, par sintetico e oraculo privado

> **Tipo:** mista — CODIGO (`src/exporters/`, fixture sintetica, `@types/node`) e REGISTRO (DEC-009 e appends nos meta/).
> **Config sugerida:** modelo mais capaz · `/effort` medio. Codigo pronto e testado; o julgamento e parar no vermelho.
> **Pre-requisito:** HEAD `eee7fda` (`docs: registra armadilhas do dev server e do Prettier`) em `main`, igual a `origin/main`.
> Antes de aplicar, `git status --short` mostra EXATAMENTE:
> ```
>  M logs/2026-10-16.md
>  M meta/CONTEXT.md
>  M meta/GLOSSARY.md
>  M specs/261016-mvp-exportar-conversa-claude.md
> ?? meta/workorders/261016-wo0002-exportadores-lunoda.md
> ```
> Mais alguma coisa: **PARE e reporte**.
> **Base:** conversa de chat de 2026-10-16 (Conversa 5 do log): passos 4 e 5 de `specs/261016-mvp-exportar-conversa-claude.md`;
> repo publico decidido pelo dono.
> **Arquivos que o chat gravou no disco e esta WO versiona** (Edicao 0 confere):
> - `meta/CONTEXT.md` — `a6d0519c6f31b4d39b3f0ad65bcba4ce42030249`
> - `meta/GLOSSARY.md` — `685687ba0b594a89dbe63b262f201ace9fd19fd3`
> - `specs/261016-mvp-exportar-conversa-claude.md` — `94955393481eb41e99a5493c1dc2f972d458e37a`
> - `logs/2026-10-16.md` — `47620a3b86de5eec56b5cdd0f423354ffc654a79` (antes da Edicao 10, que acrescenta a sua secao)
> **Ancora semantica:** se um trecho-ancora nao bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar proximo.
> **Idempotencia:** antes de cada insercao, procure a frase-chave do texto NOVO; se ja existir, PULE e diga no relatorio.
> **Ancoras lidas em:** neste turno de chat, das copias do disco trazidas pela ponte (estado `eee7fda`): `package.json` (linha
> `"@eslint/js": "10.0.1",`), `.gitattributes` (ultima linha `*.ico binary`), `.editorconfig` (ultima linha
> `trim_trailing_whitespace = false`), `CLAUDE.md` (linha «- Instalação limpa: ...»), `meta/DECISIONS.md` (ultima linha da DEC-008),
> `meta/STATUS.md` (Versao Atual, Funcionando, Em Progresso, Backlog, Ultima conversa), `meta/CHANGELOG.md` (ultimo item de
> «Adicionado»), `meta/ROADMAP.md` (item «Exportadores» da F1). O trecho literal de cada uma esta no bloco «Ancora» da edicao.
> **Simulado:** o chat aplicou as Edicoes 1 a 3 numa copia do repo em `eee7fda`, rodou `npm install` e `npm run check` (verde:
> `Tests  27 passed | 1 skipped (28)`), e aplicou as edicoes de doc a partir do texto DESTA WO em copias dos meta/ do disco; as
> contagens da conferencia sairam dessas copias.
> **Nao testado no Windows:** o oraculo com `CDC_LUNODA_ORACLE_DIR=..` (no Linux, com a mesma pasta-pai, deu 5 passed). Se ele
> falhar so no Windows, e suspeita do instrumento: **PARE e reporte com a saida crua**, nao mexa no codigo.
> **Proximo comando:** `CDC_LUNODA_ORACLE_DIR=.. npx vitest run src/exporters/lunoda-golden.test.ts`

> **Canal dos meta neste ciclo = CODE.** Esta WO E o registro: aplique as Edicoes 5 a 10. CONTEXT, GLOSSARY, spec e a secao do
> chat no log ja estao gravados (conferidos na Edicao 0) — nao os edite, exceto a Edicao 10 (acrescentar a SUA secao no fim do log).

---

## 1. Por que

Os passos 4 e 5 da spec: transformar o modelo canonico nos dois arquivos do Lunoda, iguais ao que o Lunoda grava. O repositorio e
publico, entao a conversa real que serve de prova (`mapsmith 12`) nao pode ser versionada: a fidelidade vira um teste que le pares
do Lunoda numa pasta FORA do repo (oraculo privado), e o repo guarda so um par sintetico, contra regressao (DEC-009).

## 2. Contexto factual

- **[medido pelo chat, 2026-10-16]** `JSON.stringify(doc, null, 2)` reproduz o `mapsmith 12.json` byte a byte: sem quebra de linha
  final, acentos crus. O conteudo de cada bloco aparece no `.md` sem nenhuma alteracao.
- **[medido]** Com o codigo desta WO, `renderLunodaJson` e `renderLunodaMd` reproduzem `mapsmith 12.json` e `mapsmith 12.md` byte
  a byte (5 passed no arquivo de ouro com a variavel apontando para a pasta do par).
- **[medido]** Provas de vida: variavel apontando para pasta sem par -> 1 failed («a pasta tem ao menos um par»); um byte trocado no
  `.md` sintetico -> 1 failed («md bate com a fixture»).
- **[medido]** Sem `@types/node`, `tsc` falha no `lunoda-golden.test.ts` (`Cannot find name 'node:fs'`). `@types/node` 22.20.5 =
  ultima da linha 22 em 2026-10-16 (`npm view @types/node@22 version`); o Node da VM do chat ligada a esta maquina e o 22.
- **[medido]** Sha1 do par gerado pelo Vitest: `sintetico.json` = `47b4e6d03f7ea8e76ac82be44c95cd18e12ea830`,
  `sintetico.md` = `62ef1c25d89909ab16811b98d85248284c13203a`.
- **[relatado pelo dono, 2026-10-16]** Popup conferido no Chrome; repositorio publico; usar par sintetico.

---

## Edicao 0 — conferencia antes de tudo (nao edita nada)

```
git log -1 --oneline
git status --short
sha1sum meta/CONTEXT.md meta/GLOSSARY.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md
node -v
```

Esperado: `eee7fda docs: registra armadilhas do dev server e do Prettier`; o `status` do cabecalho; os hashes do cabecalho.
`node -v`: so relate (se for menor que 22, diga — nao e vermelho).

---

## Edicao 1 — `package.json` · `@types/node`

**Ancora** (em `devDependencies`):

```
    "@eslint/js": "10.0.1",
```

**Substituir por:**

```
    "@eslint/js": "10.0.1",
    "@types/node": "22.20.5",
```

## Edicao 2 — `.gitattributes` e `.editorconfig` · bytes exatos nas fixtures

### 2a — `.gitattributes`

**Ancora** (ultima linha do arquivo):

```
*.ico binary
```

**Substituir por:**

```
*.ico binary
# Fixtures do Lunoda: bytes exatos (o .json NAO termina em quebra de linha; o .md tem espacos finais).
src/tests/fixtures/** -text
```

### 2b — `.editorconfig`

**Ancora** (ultima linha do arquivo — e a UNICA ocorrencia; a do bloco `[*]` e `trim_trailing_whitespace = true`):

```
trim_trailing_whitespace = false
```

**Substituir por** (a linha em branco no meio e intencional):

```
trim_trailing_whitespace = false

# Fixtures: bytes exatos, inclusive a falta de quebra de linha final no .json do Lunoda.
[src/tests/fixtures/**]
insert_final_newline = false
trim_trailing_whitespace = false
```

---

## Edicao 3 — criar os exportadores, a conversa sintetica e os testes (8 arquivos novos)

**Criar arquivo novo** em cada caminho, com o conteudo exato. Se algum ja existir: PARE e reporte. NAO crie a pasta
`src/tests/fixtures/lunoda/` nem os arquivos `sintetico.*` a mao: quem os grava e o Vitest, na Edicao 4.

### `src/exporters/lunoda-types.ts`

```ts
/**
 * Tipos do formato de arquivo do Lunoda, medidos no par `mapsmith 12` (CONTEXT, «Formato Lunoda»).
 *
 * A ORDEM das chaves nas interfaces e a ordem em que o Lunoda as grava; os construtores deste modulo
 * montam os objetos nessa ordem para que `JSON.stringify` reproduza o arquivo byte a byte.
 */

export interface LunodaOption {
  id: string;
  name: string;
  colorId: string;
}

export interface LunodaProperty {
  id: string;
  name: string;
  options: LunodaOption[];
}

export interface LunodaBlock {
  id: string;
  /** "Prompt", "Pensamento" ou o nome da IA ("Claude"...). */
  subtitle: string;
  /** Numero do turno (DEC-008). */
  version: number;
  content: string;
  blockProps: Record<string, unknown>;
}

export interface LunodaEntry {
  id: string;
  title: string;
  description: string;
  propertyValues: Record<string, string[]>;
  propertyAutoFlags: Record<string, unknown>;
  blocks: LunodaBlock[];
  /** ISO 8601 UTC. */
  createdAt: string;
  /** ISO 8601 UTC. */
  updatedAt: string;
}

export interface LunodaDocument {
  properties: LunodaProperty[];
  entries: LunodaEntry[];
}

/** Propriedades padrao do Lunoda, como aparecem no `mapsmith 12`. Use `defaultLunodaProperties()`. */
const DEFAULT_PROPERTIES: readonly LunodaProperty[] = [
  {
    id: 'p-tags',
    name: 'Tags',
    options: [
      { id: 'o1', name: 'Ideia', colorId: 'yellow' },
      { id: 'o2', name: 'Pesquisa', colorId: 'blue' },
      { id: 'o3', name: 'Geral', colorId: 'slate' },
    ],
  },
  {
    id: 'p-ia',
    name: 'IA Utilizada',
    options: [
      { id: 'o4', name: 'Claude', colorId: 'violet' },
      { id: 'o5', name: 'Gemini', colorId: 'green' },
      { id: 'o6', name: 'ChatGPT', colorId: 'orange' },
    ],
  },
];

/** Copia nova das propriedades padrao (nunca compartilhe a constante: o chamador pode mutar). */
export function defaultLunodaProperties(): LunodaProperty[] {
  return structuredClone(DEFAULT_PROPERTIES) as LunodaProperty[];
}
```

### `src/exporters/lunoda-build.ts`

```ts
/**
 * Conversation (modelo canonico) -> entrada do Lunoda (DEC-003, DEC-004, DEC-008).
 *
 * Ordem dos blocos por turno: Prompt vN -> [Pensamento vN] -> <IA> vN. O pensamento so entra com
 * `includeThinking`; as listas de arquivos so entram com `includeFiles`.
 */

import type { Conversation, ExportOptions, FileRef, Message } from '../core/model';
import { PLATFORM_LABEL } from '../core/model';
import type { LunodaBlock, LunodaDocument, LunodaEntry } from './lunoda-types';
import { defaultLunodaProperties } from './lunoda-types';

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
  const blocks: LunodaBlock[] = [];
  const push = (subtitle: string, version: number, content: string): void => {
    blocks.push({ id: ctx.newId(), subtitle, version, content, blockProps: {} });
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
    description: '',
    propertyValues: { 'p-tags': [], 'p-ia': [] },
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
```

### `src/exporters/lunoda-json.ts`

```ts
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
```

### `src/exporters/lunoda-md.ts`

```ts
/**
 * Escrita do `.md` no layout do export do Lunoda, reproduzido byte a byte do `mapsmith 12.md`.
 *
 * Detalhes que o teste de ouro protege: LF; dois espacos no fim das linhas de metadado (quebra de
 * linha em Markdown); separador de 40 × U+2501 depois do cabecalho e de cada bloco; front matter em
 * ISO UTC e corpo em hora local `dd/mm/aa HH:MM`; conteudo do bloco copiado sem nenhuma alteracao.
 * Nao verificado (o oraculo nao tem): titulo com aspas, descricao preenchida, propriedades marcadas.
 */

import { formatLunodaLocal } from '../core/dates';
import type { LunodaBlock, LunodaEntry } from './lunoda-types';

/** Separador do Lunoda: 40 × «━» (U+2501). */
export const LUNODA_SEPARATOR = '━'.repeat(40);

function blockSection(block: LunodaBlock, n: number): string {
  return [
    `## [Bloco ${n}] ${block.subtitle} · v${block.version}`,
    '',
    `<!-- BLOCO ${n} -->`,
    `**Subtítulo:** ${block.subtitle}  `,
    `**Versão:** v${block.version}  `,
    '',
    '**Conteúdo:**',
    '',
    `<!-- CONTEUDO:INICIO bloco=${n} -->`,
    block.content,
    `<!-- CONTEUDO:FIM bloco=${n} -->`,
    '',
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
}

/**
 * Gera o `.md` de uma entrada.
 * @param entry entrada do Lunoda.
 * @param timeZone fuso IANA das datas do corpo; omitido = fuso do ambiente (o do usuario).
 */
export function renderLunodaMd(entry: LunodaEntry, timeZone?: string): string {
  const header = [
    '---',
    `title: ${JSON.stringify(entry.title)}`,
    `id: ${JSON.stringify(entry.id)}`,
    `created: ${JSON.stringify(entry.createdAt)}`,
    `updated: ${JSON.stringify(entry.updatedAt)}`,
    `blocks: ${entry.blocks.length}`,
    '---',
    `# ${entry.title}`,
    '',
    '<!-- ENTRADA -->',
    `**ID:** \`${entry.id}\`  `,
    `**Criado em:** ${formatLunodaLocal(entry.createdAt, timeZone)}  `,
    `**Modificado em:** ${formatLunodaLocal(entry.updatedAt, timeZone)}  `,
    `**Total de blocos:** ${entry.blocks.length}  `,
    '',
    LUNODA_SEPARATOR,
    '',
    '',
  ].join('\n');
  return header + entry.blocks.map((b, i) => blockSection(b, i + 1)).join('');
}
```

### `src/tests/synthetic-conversation.ts`

```ts
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
```

### `src/exporters/lunoda-build.test.ts`

```ts
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
```

### `src/exporters/lunoda-json.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { LunodaFormatError, parseLunodaJson, renderLunodaJson } from './lunoda-json';

const minimal = {
  properties: [],
  entries: [
    {
      id: 'mtke7wavx3ge',
      title: 't',
      description: '',
      propertyValues: { 'p-tags': [], 'p-ia': [] },
      propertyAutoFlags: {},
      blocks: [
        { id: 'mtk5dkw3d65t', subtitle: 'Prompt', version: 1, content: 'olá', blockProps: {} },
      ],
      createdAt: '2026-09-02T17:51:44.451Z',
      updatedAt: '2026-09-02T17:51:44.451Z',
    },
  ],
};

describe('renderLunodaJson', () => {
  it('indenta com 2 espacos, sem quebra de linha final e com acentos crus', () => {
    const text = renderLunodaJson(parseLunodaJson(JSON.stringify(minimal)));
    expect(text.startsWith('{\n  "properties": [],')).toBe(true);
    expect(text.endsWith('}')).toBe(true);
    expect(text).toContain('"content": "olá"');
  });
});

describe('parseLunodaJson', () => {
  it('recusa bloco sem content, dizendo onde', () => {
    const broken = structuredClone(minimal) as { entries: { blocks: Record<string, unknown>[] }[] };
    delete broken.entries[0]!.blocks[0]!.content;
    expect(() => parseLunodaJson(JSON.stringify(broken))).toThrow(LunodaFormatError);
    expect(() => parseLunodaJson(JSON.stringify(broken))).toThrow('entries[0].blocks[0].content');
  });

  it('recusa raiz sem entries', () => {
    expect(() => parseLunodaJson('{"properties": []}')).toThrow('entries');
  });
});
```

### `src/exporters/lunoda-golden.test.ts`

```ts
/**
 * Testes de ouro dos exportadores do Lunoda.
 *
 * 1. Par SINTETICO versionado (`src/tests/fixtures/lunoda/`): regressao byte a byte. Ele foi gravado
 *    pelo proprio codigo (toMatchFileSnapshot), entao prova estabilidade, nao fidelidade ao Lunoda.
 * 2. Oraculo PRIVADO, fora do repositorio: pares `<nome>.json` + `<nome>.md` exportados PELO LUNODA,
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
  const json = renderLunodaJson(buildLunodaDocument([entry]));
  const md = renderLunodaMd(entry, 'America/Sao_Paulo');

  it('json bate com a fixture', async () => {
    await expect(json).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.json`);
  });

  it('md bate com a fixture', async () => {
    await expect(md).toMatchFileSnapshot(`${FIXTURE_DIR}/sintetico.md`);
  });

  it('json lido de volta reproduz o mesmo json e o mesmo md', () => {
    const doc = parseLunodaJson(json);
    expect(renderLunodaJson(doc)).toBe(json);
    expect(renderLunodaMd(doc.entries[0]!, 'America/Sao_Paulo')).toBe(md);
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
    expect(renderLunodaMd(doc.entries[0]!, 'America/Sao_Paulo')).toBe(md);
  });
});
```

---

## Edicao 4 — instalar, gerar o par sintetico e validar

```
npm install
npm test
sha1sum src/tests/fixtures/lunoda/sintetico.json src/tests/fixtures/lunoda/sintetico.md
npm run check
```

- `npm install` atualiza o `package-lock.json` (entra no commit).
- O primeiro `npm test` GRAVA o par: a saida traz `Snapshots  2 written` e `Tests  27 passed | 1 skipped (28)`.
  Se em vez de gravar ele reprovar por «snapshot ausente» (modo CI), rode uma vez
  `npx vitest run -u src/exporters/lunoda-golden.test.ts` e siga.
- Os dois `sha1sum` TEM de ser `47b4e6d03f7ea8e76ac82be44c95cd18e12ea830` (json) e `62ef1c25d89909ab16811b98d85248284c13203a` (md).
  Diferente: **PARE e reporte** os dois hashes e o `head -c 400` de cada arquivo.
- `npm run check` -> codigo 0, `Tests  27 passed | 1 skipped (28)`, `All matched files use Prettier code style!`, build verde.
- **Oraculo privado (a prova de fidelidade):**
  `CDC_LUNODA_ORACLE_DIR=.. npx vitest run src/exporters/lunoda-golden.test.ts` -> nenhum teste falha e o oraculo lista o par
  `mapsmith 12` (esperado com a pasta-pai de hoje: `Tests  5 passed (5)`; se o dono tiver posto outro par `.json`+`.md` la, cada
  um soma 1 — relate a lista).
- **Prova de vida do oraculo:** `CDC_LUNODA_ORACLE_DIR=src/tests npx vitest run src/exporters/lunoda-golden.test.ts` -> `1 failed`
  («a pasta tem ao menos um par .json + .md»), porque `src/tests` nao tem par. Nada a desfazer.
- Vermelho fora dessa prova de vida: **PARE e reporte com a saida crua**. Nao «conserte» o codigo da WO para passar.

---

## Edicao 5 — `CLAUDE.md` · como rodar o oraculo

**Ancora** (secao «Build / validação»):

```
- Instalação limpa: `npm ci` (usa o `package-lock.json`). Projeto WXT sem entrypoint falha no `npm install` (armadilha 8 do CONTEXT).
```

**Substituir por:**

```
- Instalação limpa: `npm ci` (usa o `package-lock.json`). Projeto WXT sem entrypoint falha no `npm install` (armadilha 8 do CONTEXT).
- Mudou `src/exporters/`? Rode também o oráculo privado do Lunoda (DEC-009): `CDC_LUNODA_ORACLE_DIR=.. npx vitest run src/exporters/lunoda-golden.test.ts` — pares exportados pelo Lunoda na pasta-pai, fora do repo. O `npm test` comum pula esse bloco.
```

---

## Edicao 6 — `meta/DECISIONS.md` · nova DEC-009 no fim

**Ancora** (ultima linha da DEC-008, ultima linha do arquivo):

```
Ainda não testado no Lunoda: se ele aceita `subtitle` «Pensamento» e o `content` com a lista de arquivos (STATUS, Backlog). O formato da lista é o mais fácil de ajustar depois: muda só o exportador.
```

**Substituir por** (a ancora repetida + a entrada nova):

```
Ainda não testado no Lunoda: se ele aceita `subtitle` «Pensamento» e o `content` com a lista de arquivos (STATUS, Backlog). O formato da lista é o mais fácil de ajustar depois: muda só o exportador.

---

## DEC-009 — Repositório público: fixture sintética e oráculo do Lunoda fora do repo
**Data:** 2026-10-16 · **Status:** aceita (repositório público decidido pelo dono)

### Contexto
O repositório no GitHub é público. O único exemplo do que o Lunoda grava, o `mapsmith 12`, é uma conversa real do dono (de outro projeto). Os testes de ouro precisam de um par que o próprio Lunoda produziu; um par gerado pelo código só prova que o código concorda consigo mesmo.

### Decisão
- Fixture versionada é sempre sintética: `src/tests/synthetic-conversation.ts` gera `src/tests/fixtures/lunoda/sintetico.json` e `.md`, gravados pelo próprio Vitest (`toMatchFileSnapshot`). Protege contra regressão.
- A fidelidade ao Lunoda é provada por pares `.json` + `.md` exportados PELO Lunoda numa pasta fora do repositório, apontada por `CDC_LUNODA_ORACLE_DIR` (hoje a pasta-pai, com o `mapsmith 12`). Sem a variável, o bloco é pulado.
- O `sintetico.json` importado no Lunoda e exportado de volta vira oráculo do par sintético e, de quebra, testa o bloco «Pensamento» e as listas de arquivos da DEC-008.

### Alternativas consideradas
- **Repositório privado com o `mapsmith 12` versionado** — o dono preferiu público.
- **Anonimizar o `mapsmith 12`** — trocar o texto muda justamente o que o teste mede (conteúdo longo, acentos, blocos reais).
- **Só o par sintético** — circular: o código gravaria o que ele mesmo confere.

### Consequências
O `npm test` comum não prova fidelidade; quem mexe em `src/exporters/` roda também o oráculo (comando no `CLAUDE.md`). Medido em 2026-10-16: `mapsmith 12.json` e `.md` reproduzidos byte a byte.
```

---

## Edicao 7 — `meta/STATUS.md` (cinco trechos)

### 7a — Versao Atual

**Ancora:**

```
**0.0.0** — 2026-10-16 — base de código da F1 (scaffold, modelo canônico, IDs e datas do Lunoda); ainda não exporta nada.
```

**Substituir por:**

```
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos e testados; ainda não lê conversa do Claude (sem adaptador nem botão).
```

### 7b — Funcionando

**Ancora:**

```
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
```

**Substituir por:**

```
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
- Extensão carregada à mão no Chrome do dono; popup provisório conferido (2026-10-16).
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.
```

### 7c — Em Progresso

**Ancora:**

```
- **F1 — MVP:** passos 1 a 3 da spec prontos (wo0001). Próximo: exportadores Lunoda MD e JSON com o teste de ouro (passos 4 e 5).
```

**Substituir por:**

```
- **F1 — MVP:** passos 1 a 5 da spec prontos (wo0001, wo0002). Próximo: botão de depuração «salvar resposta bruta» e adaptador Claude (passos 6 e 7).
```

### 7d — Backlog (as quatro linhas do Backlog, inteiras)

**Ancora:**

```
- [ ] Dono: carregar `.output/chrome-mv3` no Chrome (modo desenvolvedor) e conferir o popup provisório.
- [ ] Testar no Lunoda um `.json` feito à mão com um bloco `subtitle: "Pensamento"` e com `p-ia` preenchido (`["o4"]`) — confirma se o importador aceita os dois antes de virar código.
- [ ] Decidir se o par `mapsmith 12` (conteúdo real do dono) entra versionado como fixture de ouro — só se o repositório for privado; senão, montar um par sintético.
- [ ] F1: exportadores Lunoda MD e JSON + teste de ouro (passos 4 e 5 da spec) — próxima WO do chat.
```

**Substituir por:**

```
- [ ] Dono: importar `src/tests/fixtures/lunoda/sintetico.json` no Lunoda e exportar de volta (roteiro na conversa de 2026-10-16) — confirma se o Lunoda aceita o bloco «Pensamento» e as listas de arquivos, e mostra como ele grava `p-ia` preenchido.
- [ ] F1: botão «salvar resposta bruta» + adaptador Claude (passos 6 e 7 da spec) — próxima WO do chat.
```

### 7e — Ultima conversa

**Ancora** (o paragrafo inteiro, uma linha so):

```
**2026-10-16** — Commit inicial feito (`52538ff`). Dono decidiu: `version` = turno, pensamento em bloco próprio, pensamento desligado e arquivos ligados por padrão (DEC-008). wo0001 montou a base da F1 (WXT + TypeScript 6.0 + Vitest; modelo canônico, IDs e datas com 9 testes). Próximo: o dono confere o popup no Chrome; o chat escreve a WO dos exportadores Lunoda com o teste de ouro.
```

**Substituir por:**

```
**2026-10-16** — Popup conferido no Chrome. Repositório público → DEC-009: fixture sintética versionada e oráculo do Lunoda fora do repo. wo0002 entregou os exportadores Lunoda JSON e MD, que reproduzem o `mapsmith 12` byte a byte. Próximo: o dono testa o `sintetico.json` no Lunoda; o chat escreve a WO do adaptador Claude.
```

---

## Edicao 8 — `meta/CHANGELOG.md` · itens em «Nao lancado»

**Ancora** (ultimo item de «Adicionado»):

```
- DEC-008: `version` = turno, pensamento em bloco próprio, padrão pensamento desligado e arquivos ligados.
```

**Substituir por:**

```
- DEC-008: `version` = turno, pensamento em bloco próprio, padrão pensamento desligado e arquivos ligados.
- Exportadores Lunoda (wo0002): `buildLunodaEntry` (modelo → entrada, com pensamento e listas de arquivos), `renderLunodaJson`, `parseLunodaJson` e `renderLunodaMd`; reproduzem o `mapsmith 12` byte a byte.
- Par sintético versionado (`src/tests/fixtures/lunoda/`) e oráculo privado por `CDC_LUNODA_ORACLE_DIR` (DEC-009); `@types/node` 22.20.5; 27 testes.
```

---

## Edicao 9 — `meta/ROADMAP.md` · item da F1

**Ancora:**

```
- [ ] Exportadores Lunoda JSON e Lunoda MD.
```

**Substituir por:**

```
- [x] Exportadores Lunoda JSON e Lunoda MD (wo0002).
```

---

## Edicao 10 — `logs/2026-10-16.md` · a SUA secao, no fim

Acrescente no FIM do arquivo (depois de `## Conversa 5 — chat — ...`, sem tocar nela) a secao
`## Conversa 6 — Code — aplicacao da wo0002`, no formato de `meta/LOG-TEMPLATE.md`, com o que aconteceu DE FATO: os hashes do
par, a saida do `npm run check`, o oraculo e a prova de vida, o `node -v`, e qualquer desvio desta WO.

---

## Fora de escopo

- Adaptador do Claude, botao «salvar resposta bruta», permissoes no manifesto, popup de verdade: proximas WOs.
- Copiar o `mapsmith 12` (ou qualquer conversa real) para dentro do repo: proibido pela DEC-009.
- Preencher `p-ia` automaticamente: depende do roteiro do dono no Lunoda.
- Formatar com Prettier qualquer arquivo de `src/tests/fixtures/` (ja esta no `.prettierignore`).

## Armadilhas desta WO

- **Fim de linha das fixtures:** com a Edicao 2a, `git ls-files --eol src/tests/fixtures` mostra `attr/-text`. O `.json` NAO termina em
  quebra de linha e o `.md` tem linhas com dois espacos no fim — editor que «arruma» isso quebra o teste. Nao abra as fixtures num
  editor que salve automaticamente.
- **Ancoras de uma linha longa** (6, 7e, 7d): paragrafos inteiros numa linha so; substitua a linha inteira.

---

## Depois de aplicar — conferencia antes do commit

- [ ] `git status --short` mostra exatamente: ` M` `.editorconfig`, `.gitattributes`, `CLAUDE.md`, `logs/2026-10-16.md`,
      `meta/CHANGELOG.md`, `meta/CONTEXT.md`, `meta/DECISIONS.md`, `meta/GLOSSARY.md`, `meta/ROADMAP.md`, `meta/STATUS.md`,
      `package-lock.json`, `package.json`, `specs/261016-mvp-exportar-conversa-claude.md`; `??` `src/exporters/`, `src/tests/` e
      esta WO. Nada de `.output/`, `.wxt/`, `node_modules/`. Diferente: PARE.
- [ ] `find src -type f | sort | wc -l` -> **17** (7 de antes + 8 desta WO + 2 fixtures).
- [ ] `sha1sum src/tests/fixtures/lunoda/*` -> os dois hashes da Edicao 4.
- [ ] `grep -c "^## DEC-" meta/DECISIONS.md` -> **9**. `grep -c "^## DEC-009" meta/DECISIONS.md` -> **1**.
- [ ] `grep -c "^- \[ \]" meta/STATUS.md` -> **2** (unidade: linhas; o Backlog fica com dois itens).
- [ ] `grep -c "^- \[x\]" meta/ROADMAP.md` -> **6**.
- [ ] `grep -c "^## Conversa" logs/2026-10-16.md` -> **6**.
- [ ] `git ls-files --eol` depois do `git add` -> nenhuma linha com `i/crlf`; as duas fixtures com `attr/-text`.

## Relatorio de aplicacao *(quem aplica preenche ao terminar)*

O que foi feito, edicao por edicao · a SAIDA CRUA das conferencias (numero + comando) · o que fugiu do texto literal da WO ·
`node -v` · arquivos tocados · `npm run check` · oraculo e prova de vida · commit e push. Escreva-o DEPOIS de resolver o push.

## Commit — blocos separados, mensagem SEM acento

```
git add .editorconfig .gitattributes CLAUDE.md package.json package-lock.json src/exporters src/tests meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/STATUS.md meta/CHANGELOG.md meta/ROADMAP.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md meta/workorders/261016-wo0002-exportadores-lunoda.md
```

```
git commit -m "feat(exporters): exporta entrada do Lunoda em JSON e MD" -m "buildLunodaEntry, renderLunodaJson, parseLunodaJson e renderLunodaMd reproduzem o par real mapsmith 12 byte a byte. Par sintetico versionado e oraculo privado por CDC_LUNODA_ORACLE_DIR (DEC-009); @types/node; 27 testes."
```

```
git push
```
