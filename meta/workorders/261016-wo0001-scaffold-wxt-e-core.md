# WO 0001 — base de codigo da F1: WXT + TypeScript + Vitest, modelo canonico, IDs e datas do Lunoda

> **Tipo:** mista — CODIGO (scaffold + `src/core/`) e REGISTRO (DEC-008 e appends nos meta/).
> **Config sugerida:** modelo mais capaz · `/effort` medio. O codigo vem pronto e testado; o julgamento e parar no vermelho.
> **Pre-requisito:** HEAD `52538ff` (`docs: inicia projeto Coletor de Contexto`) em `main`. Antes de aplicar, `git status --short` mostra
> EXATAMENTE as quatro linhas abaixo (tres ` M` e esta WO como `??`) — e, se o dono ja salvou o `.claude/settings.json` novo,
> mais uma (` M .claude/settings.json`):
> ```
>  M logs/2026-10-16.md
>  M meta/CONTEXT.md
>  M specs/261016-mvp-exportar-conversa-claude.md
> ?? meta/workorders/261016-wo0001-scaffold-wxt-e-core.md
> ```
> Mais alguma coisa: **PARE e reporte**.
> **Base:** conversa de chat de 2026-10-16 (Conversa 2 do log): decisoes do dono + passos 1 a 3 de `specs/261016-mvp-exportar-conversa-claude.md`.
> **Arquivos que o chat gravou no disco e esta WO versiona** (Edicao 0 confere):
> - `meta/CONTEXT.md` — `cf835f5cc602d379f3296edff2f04fd35f4025c8`
> - `specs/261016-mvp-exportar-conversa-claude.md` — `d003bef493881bbb6572df9892df9599eb6f52d4`
> - `logs/2026-10-16.md` — `cc9e728c3c380a3c0b82eb787166dfff97a1c67b` (antes da Edicao 11, que acrescenta a sua secao)
> - `.claude/settings.json` — **opcional**: o chat entregou para o dono salvar a mao (a ponte do chat nao grava em `.claude/`).
>   Se o hash for `aa01f50f3426396d7c3c942a4709b8779959476f`, entra no commit. Se ainda for `eb29f73ecb0b671bd12ec6310aa75958f84e79ae`
>   (o antigo), **siga sem ele**: o Code vai pedir permissao para cada `npm`, e isso nao e erro — diga no relatorio.
>   Qualquer outro hash: PARE e reporte.
> **Ancora semantica:** se um trecho-ancora nao bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar proximo.
> **Idempotencia:** antes de cada insercao nos meta/, procure a frase-chave do texto NOVO; se ja existir, PULE e diga no relatorio.
> **Ancoras lidas em:** todas as ancoras dos meta/ foram copiadas, neste turno de chat, dos arquivos cujo hash bate com o commit
> `52538ff` (o chat mediu `sha1sum` no disco e conferiu contra a copia que ele mesmo gravou): `CLAUDE.md` (secao «Build / validacao»,
> linhas que comecam com «- Build:» e «- Testes/validação:»), `meta/DECISIONS.md` (ultima linha da DEC-007), `meta/STATUS.md`
> (Versao Atual, Funcionando, Em Progresso, Quebrado, Pontos de decisao, Backlog, Ultima conversa), `meta/CHANGELOG.md`
> (ultimo item de «Adicionado»), `meta/ROADMAP.md` (titulos e itens de F0 e F1), `meta/IDEAS.md` (entradas «Capturar o pensamento
> da IA» e «Ramos como versoes»). O trecho literal de cada uma esta no bloco «Ancora» da edicao.
> **Simulado:** o chat montou os arquivos das Edicoes 1 e 2 numa pasta vazia, instalou as versoes abaixo e rodou `npm run check`:
> typecheck, lint, Prettier, **9 testes passando em 2 arquivos** e build de `chrome-mv3` com 3 arquivos. As edicoes de doc foram
> aplicadas, a partir do texto DESTA WO, numa copia dos meta/, e as contagens da conferencia sairam dessa copia.
> **Nao testado no Windows:** o teste de `dates.test.ts` que depende do fuso do AMBIENTE («usa o fuso do ambiente quando nenhum e
> passado») confia em `test.env.TZ` do `vitest.config.ts`. No Linux passou. Se so ele falhar no Windows, e suspeita do instrumento,
> nao do codigo: **PARE e reporte com a saida crua** — nao mude o teste.
> **Proximo comando:** `npm run dev`

> **Canal dos meta neste ciclo = CODE.** Esta WO E o registro: aplique as Edicoes 4 a 11. O chat ja gravou CONTEXT, spec e a secao
> dele no log (conferidos pela Edicao 0) — nao os edite, exceto a Edicao 11 (acrescentar a SUA secao no fim do log).

---

## 1. Por que

A F1 precisa de uma base de extensao que compile, teste e gere a extensao carregavel antes de qualquer exportador existir. Junto vem
o nucleo que todos os passos seguintes usam: o modelo canonico (DEC-003), o gerador de IDs no formato do Lunoda e a data local do
cabecalho do MD — as duas ultimas com testes contra valores medidos no `mapsmith 12`. E o dono decidiu os tres pontos que travavam a
F1; eles viram a DEC-008.

## 2. Contexto factual

- **[medido pelo chat, 2026-10-16, `npm view`]** Versoes mais novas: wxt 0.21.4, vitest 5.0.5, eslint 10.13.0, @eslint/js 10.0.1,
  typescript-eslint 8.71.2, prettier 3.9.10, globals 17.13.0, typescript 7.0.2. O `typescript-eslint` 8.71.2 declara
  `typescript: ">=4.8.4 <6.1.0"` — por isso a WO fixa **typescript 6.0.3** (a mais nova da 6.0), nao a 7.
- **[medido]** `wxt prepare` (o `postinstall`) falha com «No entrypoints found» se `src/entrypoints/` estiver vazio. Por isso a
  Edicao 2 (arquivos) vem ANTES da Edicao 3 (`npm install`).
- **[medido]** Com tudo instalado: `npm run check` verde; o manifesto gerado e
  `{"manifest_version":3,"name":"Coletor de Contexto",...,"action":{"default_title":"Coletor de Contexto","default_popup":"popup.html"}}`.
- **[medido]** Prova de vida: trocar `const ms = Math.max(clock(), last + 1);` por `const ms = clock();` em `ids.ts` faz exatamente
  1 teste falhar («nao repete nem regride com o relogio parado...»).
- **[relatado pelo dono, 2026-10-16]** Decisoes: `version` = turno; pensamento em bloco proprio; primeiro uso com pensamento desligado
  e arquivos ligados.
- **[proposta do chat, aceita junto]** Formato da lista de arquivos no `content` do bloco (texto na DEC-008).

---

## Edicao 0 — conferencia antes de tudo (nao edita nada)

```
git log -1 --oneline
git status --short
sha1sum meta/CONTEXT.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md .claude/settings.json
```

Esperado: `52538ff docs: inicia projeto Coletor de Contexto`; o `status` do cabecalho; os hashes do cabecalho. Divergiu: PARE.

---

## Edicao 1 — criar a configuracao do projeto (arquivos novos na raiz)

**Criar arquivo novo** em cada caminho abaixo, com o conteudo exato. Se algum ja existir: PARE e reporte.
`package.json` ja traz as versoes exatas (sem `^`) — nao rode `npm install <pacote>`: a Edicao 3 instala o que esta aqui.

### `package.json`

```json
{
  "name": "coletor-de-contexto",
  "description": "Exporta conversas de IA (claude.ai) para JSON importavel no Lunoda e Markdown.",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "wxt",
    "build": "wxt build",
    "zip": "wxt zip",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "check": "npm run typecheck && npm run lint && npm run format:check && npm test && npm run build",
    "postinstall": "wxt prepare"
  },
  "devDependencies": {
    "@eslint/js": "10.0.1",
    "eslint": "10.13.0",
    "globals": "17.13.0",
    "prettier": "3.9.10",
    "typescript": "6.0.3",
    "typescript-eslint": "8.71.2",
    "vitest": "5.0.5",
    "wxt": "0.21.4"
  }
}
```

### `wxt.config.ts`

```ts
import { defineConfig } from 'wxt';

// Configuracao do WXT. Permissoes e host_permissions entram com o adaptador do Claude (DEC-007:
// so o minimo, e so quando uma feature precisar).
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Coletor de Contexto',
    description: 'Exporta conversas de IA para JSON (Lunoda) e Markdown.',
  },
});
```

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    // Fuso fixo: as datas do MD do Lunoda sao em hora local, e o teste tem de dar o mesmo resultado
    // em qualquer maquina (armadilha 4 do CONTEXT).
    env: { TZ: 'America/Sao_Paulo' },
  },
});
```

### `tsconfig.json`

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### `eslint.config.js`

```js
// ESLint (flat config): regras recomendadas de JS e de TypeScript.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.output/', '.wxt/', 'node_modules/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
);
```

### `.prettierrc.json`

```json
{
  "singleQuote": true,
  "printWidth": 100
}
```

### `.prettierignore`

```
# Markdown fica fora do Prettier: o MD do Lunoda depende de dois espacos no fim da linha
# (armadilha 5 do CONTEXT), e os meta/ sao escritos a mao.
**/*.md
.output/
.wxt/
node_modules/
coverage/
src/tests/fixtures/
```

### `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

# Markdown: dois espacos no fim da linha sao quebra de linha (formato do Lunoda) — nao apagar.
[*.md]
trim_trailing_whitespace = false
```

### `.gitattributes`

```
# Tudo em LF no repositorio E na copia de trabalho, inclusive no Windows com core.autocrlf ligado.
# Motivo: o teste de ouro compara o MD gerado byte a byte com a fixture (DEC-004); CRLF na fixture
# quebraria o teste sem nenhum defeito no codigo.
* text=auto eol=lf
*.png binary
*.ico binary
```

---

## Edicao 2 — criar o popup provisorio e o nucleo `src/core/` (arquivos novos)

**Criar arquivo novo** em cada caminho. Se algum ja existir: PARE e reporte. A pasta `src/tests/fixtures/` NAO nasce agora (so com a
primeira fixture, na WO dos exportadores).

### `src/entrypoints/popup/index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coletor de Contexto</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### `src/entrypoints/popup/main.ts`

```ts
// Popup provisorio do scaffold: so prova que o build gera uma extensao carregavel.
// A deteccao de conversa e o botao de exportar entram no passo 8 da spec do MVP.
const app = document.querySelector<HTMLElement>('#app');
if (app) {
  app.textContent = 'Coletor de Contexto: em construção.';
}
```

### `src/core/model.ts`

```ts
/**
 * Modelo canonico do Coletor de Contexto (DEC-003).
 *
 * Unico contrato entre adaptadores (que leem uma plataforma) e exportadores (que geram um formato).
 * O adaptador guarda TUDO o que a plataforma oferece; quem decide o que entra no arquivo e o
 * exportador, conforme as ExportOptions (DEC-005).
 */

/** Plataformas suportadas (ou planejadas). */
export type Platform = 'claude' | 'chatgpt' | 'gemini';

/** Nome da IA como aparece no subtitulo do bloco de resposta no Lunoda. */
export const PLATFORM_LABEL: Record<Platform, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
};

/** Referencia a um arquivo anexado pelo usuario ou gerado pela IA. Nunca carrega binario. */
export interface FileRef {
  name: string;
  /** Tipo MIME ou rotulo da plataforma (ex.: "application/pdf", "artifact"). */
  kind: string;
  /** Tamanho em bytes, quando a plataforma informa. */
  size?: number;
  /** Conteudo textual (ex.: artefato de codigo gerado pela IA); ausente para binarios. */
  textContent?: string;
}

/** Uma mensagem (do usuario ou da IA). */
export interface Message {
  /** Texto em markdown, como a plataforma devolve. */
  text: string;
  /** Blocos de pensamento, em ordem. Vazio quando a plataforma nao expoe ou nao houve. */
  thinking: string[];
  /** Arquivos anexados pelo usuario nesta mensagem. */
  attachments: FileRef[];
  /** Arquivos criados pela IA nesta mensagem. */
  generated: FileRef[];
  /** Instante da mensagem (ISO 8601 UTC), quando a plataforma informa. */
  createdAt?: string;
}

/** Um turno: o pedido do usuario e a resposta da IA a ele. */
export interface Turn {
  /** 1, 2, 3... — vira a "versao" do bloco no Lunoda (decidido em 2026-10-16: version = turno). */
  index: number;
  user: Message;
  /** Ausente quando a conversa termina num pedido ainda sem resposta. */
  assistant?: Message;
}

/** Uma conversa ja normalizada, so com o ramo atual. */
export interface Conversation {
  platform: Platform;
  /** Id da conversa na plataforma (uuid no Claude). */
  sourceId: string;
  title: string;
  url: string;
  /** ISO 8601 UTC. */
  createdAt: string;
  /** ISO 8601 UTC. */
  updatedAt: string;
  turns: Turn[];
}

/** O que o exportador inclui alem do texto das mensagens. */
export interface ExportOptions {
  includeThinking: boolean;
  includeFiles: boolean;
}

/** Padrao do primeiro uso, decidido pelo dono em 2026-10-16 (DEC-008). */
export const DEFAULT_EXPORT_OPTIONS: Readonly<ExportOptions> = Object.freeze({
  includeThinking: false,
  includeFiles: true,
});
```

### `src/core/ids.ts`

```ts
/**
 * IDs no formato do Lunoda: Date.now() em base36 (8 caracteres) + 4 caracteres aleatorios em base36.
 * Formato medido no par `mapsmith 12` (CONTEXT, «Formato Lunoda»).
 */

const TIME_LENGTH = 8;
const RANDOM_LENGTH = 4;

/** Codifica o instante em base36 com 8 caracteres (cabe ate o ano 2059). */
function encodeTime(ms: number): string {
  return ms.toString(36).padStart(TIME_LENGTH, '0');
}

/**
 * Cria um gerador de IDs do Lunoda.
 *
 * O instante de cada ID e estritamente crescente dentro do mesmo gerador: se duas chamadas caem no
 * mesmo milissegundo, a segunda usa o milissegundo seguinte. Sem isso, so os 4 caracteres aleatorios
 * separariam os blocos de uma exportacao (36^4 combinacoes), e 1000 blocos ja teriam ~25% de chance
 * de colisao. De quebra, a ordem dos IDs acompanha a ordem dos blocos, como no processo manual.
 *
 * @param clock fonte do instante (injetavel para teste).
 * @param random fonte de aleatoriedade em [0, 1) (injetavel para teste).
 */
export function createIdGenerator(
  clock: () => number = Date.now,
  random: () => number = Math.random,
): () => string {
  let last = -1;
  return () => {
    const ms = Math.max(clock(), last + 1);
    last = ms;
    let suffix = '';
    for (let i = 0; i < RANDOM_LENGTH; i++) {
      suffix += Math.floor(random() * 36).toString(36);
    }
    return encodeTime(ms) + suffix;
  };
}

/** Devolve o instante (ms desde a epoca) embutido nos 8 primeiros caracteres de um ID do Lunoda. */
export function lunodaIdTime(id: string): number {
  return parseInt(id.slice(0, TIME_LENGTH), 36);
}
```

### `src/core/dates.ts`

```ts
/**
 * Datas no formato do cabecalho do MD do Lunoda: `dd/mm/aa HH:MM`, em hora LOCAL.
 * O front matter e o JSON usam ISO 8601 UTC; so este campo usa hora local (armadilha 4 do CONTEXT).
 */

/**
 * Formata um instante ISO 8601 como `dd/mm/aa HH:MM` no fuso dado.
 *
 * Os segundos sao TRUNCADOS, nao arredondados: no `mapsmith 12`, `17:51:44Z` aparece como `14:51`.
 *
 * @param iso instante em ISO 8601 (ex.: "2026-09-02T17:51:44.451Z").
 * @param timeZone fuso IANA; se omitido, o fuso do ambiente (o do navegador do usuario).
 */
export function formatLunodaLocal(iso: string, timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Data invalida: ${iso}`);
  }
  // formatToParts evita depender da pontuacao que cada versao do ICU poe entre data e hora.
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}
```

### `src/core/ids.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { createIdGenerator, lunodaIdTime } from './ids';

describe('createIdGenerator', () => {
  it('gera 12 caracteres em base36', () => {
    const id = createIdGenerator()();
    expect(id).toMatch(/^[0-9a-z]{12}$/);
  });

  it('embute o instante nos 8 primeiros caracteres', () => {
    const before = Date.now();
    const id = createIdGenerator()();
    const after = Date.now();
    const t = lunodaIdTime(id);
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(after + 1000);
  });

  it('reproduz um ID real do mapsmith 12 quando o instante bate', () => {
    // mtke7wavx3ge -> prefixo mtke7wav = 2026-09-02T17:51:44.455Z (medido em 2026-10-16)
    const t = Date.parse('2026-09-02T17:51:44.455Z');
    const id = createIdGenerator(
      () => t,
      () => 0,
    )();
    expect(id.slice(0, 8)).toBe('mtke7wav');
    expect(lunodaIdTime('mtke7wavx3ge')).toBe(t);
  });

  it('nao repete nem regride com o relogio parado (prova de vida da garantia de unicidade)', () => {
    const fixed = Date.parse('2026-10-16T12:00:00.000Z');
    const next = createIdGenerator(
      () => fixed,
      () => 0,
    ); // aleatorio sempre "0000"
    const ids = Array.from({ length: 1000 }, next);
    expect(new Set(ids).size).toBe(1000);
    // Instantes consecutivos: o gerador avanca 1 ms por ID quando o relogio nao anda.
    expect(ids.map(lunodaIdTime)).toEqual(ids.map((_, i) => fixed + i));
  });
});
```

### `src/core/dates.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { formatLunodaLocal } from './dates';

describe('formatLunodaLocal', () => {
  it('reproduz o cabecalho do mapsmith 12 (truncando os segundos)', () => {
    // created "2026-09-02T17:51:44.451Z" -> "Criado em: 02/09/26 14:51" (medido em 2026-10-16)
    expect(formatLunodaLocal('2026-09-02T17:51:44.451Z', 'America/Sao_Paulo')).toBe(
      '02/09/26 14:51',
    );
  });

  it('vira o dia e o ano quando a hora local cai antes da meia-noite', () => {
    expect(formatLunodaLocal('2026-01-01T02:30:59.999Z', 'America/Sao_Paulo')).toBe(
      '31/12/25 23:30',
    );
  });

  it('usa 00 e nao 24 para meia-noite', () => {
    expect(formatLunodaLocal('2026-03-10T03:05:00.000Z', 'America/Sao_Paulo')).toBe(
      '10/03/26 00:05',
    );
  });

  it('usa o fuso do ambiente quando nenhum e passado (o vitest.config fixa America/Sao_Paulo)', () => {
    expect(formatLunodaLocal('2026-09-02T17:51:44.451Z')).toBe('02/09/26 14:51');
  });

  it('recusa data invalida em vez de escrever "NaN" no arquivo', () => {
    expect(() => formatLunodaLocal('ontem')).toThrow(RangeError);
  });
});
```

---

## Edicao 3 — instalar e validar

```
npm install
npm run check
```

- `npm install` gera `package-lock.json` (entra no commit) e `.wxt/` + `node_modules/` (ignorados pelo `.gitignore`, que ja os lista).
- `npm run check` precisa sair com codigo 0. Na saida: `Tests  9 passed (9)`, `All matched files use Prettier code style!` e o build
  listando `manifest.json`, `popup.html` e um `chunks/popup-*.js`.
- Vermelho em qualquer etapa: **PARE e reporte com a saida crua**. Nao «conserte» o codigo da WO para passar.
- **Prova de vida (reversivel):** troque, em `src/core/ids.ts`, a linha `    const ms = Math.max(clock(), last + 1);` por
  `    const ms = clock();`, rode `npx vitest run` e confira `Tests  1 failed | 8 passed (9)`. **Desfaca** a troca, confira
  `grep -c "const ms = Math.max(clock(), last + 1);" src/core/ids.ts` -> **1**, e rode `npm test` de novo: `Tests  9 passed (9)`.

---

## Edicao 4 — `CLAUDE.md` · comandos reais de build e validacao

**Ancora** (secao «Build / validação»):

```
- Build: `npm run build` (WXT) — **ainda não existe**: nasce no passo 1 da F1 (`specs/261016-mvp-exportar-conversa-claude.md`).
- Testes/validação: `npm test` (Vitest) — rode antes de commitar mudança de código. Também nasce na F1.
```

**Substituir por:**

```
- Validação completa: `npm run check` (typecheck + lint + Prettier + testes + build) — rode antes de commitar mudança de código; tem de sair com 0 erros.
- Partes: `npm run build` (WXT → `.output/chrome-mv3/`) · `npm test` (Vitest) · `npm run lint` · `npm run typecheck` · `npm run format` (corrige o Prettier).
- Instalação limpa: `npm ci` (usa o `package-lock.json`). Projeto WXT sem entrypoint falha no `npm install` (armadilha 8 do CONTEXT).
```

---

## Edicao 5 — `meta/DECISIONS.md` · nova DEC-008 no fim

**Ancora** (ultima linha da DEC-007, ultima linha do arquivo):

```
Exportar em lote, se vier, também será disparado à mão, com intervalo entre requisições.
```

**Substituir por** (a ancora repetida + a entrada nova):

```
Exportar em lote, se vier, também será disparado à mão, com intervalo entre requisições.

---

## DEC-008 — Pensamento, arquivos e versão no formato Lunoda
**Data:** 2026-10-16 · **Status:** aceita (decidido pelo dono)

### Contexto
A DEC-004 e a DEC-005 deixaram três pontos para o dono: o significado de `version`, onde o pensamento entra no Lunoda e o padrão das opções no primeiro uso.

### Decisão
- `version` é o número do turno: pedido, pensamento e resposta do mesmo turno têm a mesma versão.
- O pensamento, quando exportado, vira um bloco próprio com `subtitle: "Pensamento"`, entre o pedido e a resposta: Prompt vN → Pensamento vN → Claude vN.
- Primeiro uso: pensamento **desligado**, arquivos **ligados** (`DEFAULT_EXPORT_OPTIONS` em `src/core/model.ts`).
- Arquivos (proposta do chat, aceita junto): lista no fim do `content` do bloco da mensagem a que pertencem, depois de uma linha em branco — `**Arquivos anexados:**` no bloco Prompt, `**Arquivos gerados:**` no bloco da resposta —, um item por arquivo: `` - `nome.ext` — tipo, tamanho ``.

### Alternativas consideradas
- **Pensamento dentro do bloco da resposta** — um bloco a menos, mas mistura dois textos de natureza diferente no mesmo `content`.
- **`version` para respostas regeneradas** — ficaria sem número de turno; ramos alternativos, se vierem, ganham outro mecanismo (IDEAS, «Ramos como versões»).

### Consequências
Ainda não testado no Lunoda: se ele aceita `subtitle` «Pensamento» e o `content` com a lista de arquivos (STATUS, Backlog). O formato da lista é o mais fácil de ajustar depois: muda só o exportador.
```

---

## Edicao 6 — `meta/STATUS.md` (seis trechos)

### 6a — Versao Atual

**Ancora:**

```
**0.0.0** — 2026-10-16 — fundação: ideia, decisões e documentação de contexto; ainda sem código.
```

**Substituir por:**

```
**0.0.0** — 2026-10-16 — base de código da F1 (scaffold, modelo canônico, IDs e datas do Lunoda); ainda não exporta nada.
```

### 6b — Funcionando

**Ancora:**

```
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
```

**Substituir por:**

```
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
```

### 6c — Em Progresso

**Ancora:**

```
- **F0 — Fundação:** falta o `git init` + primeiro commit, que o dono roda no CMD (comando no fim da conversa de 2026-10-16).
```

**Substituir por:**

```
- **F1 — MVP:** passos 1 a 3 da spec prontos (wo0001). Próximo: exportadores Lunoda MD e JSON com o teste de ouro (passos 4 e 5).
```

### 6d — Quebrado

**Ancora:**

```
- Nada (não há código).
```

**Substituir por:**

```
- Nada conhecido.
```

### 6e — remover a secao de pontos de decisao (resolvidos pela DEC-008)

**Remover o bloco inteiro** — as quatro linhas abaixo **mais a linha em branco logo depois delas**, de modo que `## 📋 Backlog`
fique separado de `## ❌ Quebrado` por uma linha em branco so:

```
## ❓ Pontos de decisão do dono (destravam a F1)
1. **`version` no Lunoda** — no `mapsmith 12` ela é o número do turno (Prompt v1, Claude v1, Prompt v2…). É esse o significado, ou o campo foi pensado para versões do mesmo bloco (ex.: regenerar uma resposta)? Recomendação: manter = turno.
2. **Onde vai o pensamento no Lunoda** — (a) bloco próprio com `subtitle: "Pensamento"`, mesma versão do turno; (b) dentro do bloco da resposta, num trecho marcado. Recomendação: (a), porque o Lunoda continua com um texto por bloco.
3. **Padrão das opções** — pensamento e arquivos vêm desligados ou ligados no primeiro uso? Recomendação: pensamento **desligado**, lista de arquivos **ligada** (custa uma linha e diz o que foi anexado).
```

### 6f — Backlog

**Ancora** (tres linhas consecutivas no inicio do Backlog):

```
- [ ] Rodar `git init` + primeiro commit (dono, CMD).
- [ ] Responder os três pontos de decisão acima.
- [ ] Testar no Lunoda um `.json` feito à mão com um bloco `subtitle: "Pensamento"` e com `p-ia` preenchido (`["o4"]`) — confirma se o importador aceita os dois antes de virar código.
```

**Substituir por:**

```
- [ ] Dono: carregar `.output/chrome-mv3` no Chrome (modo desenvolvedor) e conferir o popup provisório.
- [ ] Testar no Lunoda um `.json` feito à mão com um bloco `subtitle: "Pensamento"` e com `p-ia` preenchido (`["o4"]`) — confirma se o importador aceita os dois antes de virar código.
```

**E a ancora** (ultimo item do Backlog):

```
- [ ] F1: scaffold WXT + Vitest e primeiro adaptador (Claude), conforme a spec do MVP.
```

**Substituir por:**

```
- [ ] F1: exportadores Lunoda MD e JSON + teste de ouro (passos 4 e 5 da spec) — próxima WO do chat.
```

### 6g — Ultima conversa

**Ancora** (o paragrafo inteiro, uma linha so):

```
**2026-10-16** — Ideia desenvolvida e documentada: extensão MV3, adaptador por plataforma via API interna, modelo canônico, exportadores Lunoda JSON/MD espelhando o `mapsmith 12` (formato medido no disco). Sete decisões registradas (DEC-001 a DEC-007), pesquisa do estado da arte em HISTORY §1. Próximo: commit inicial, os três pontos de decisão e o scaffold da F1.
```

**Substituir por:**

```
**2026-10-16** — Commit inicial feito (`52538ff`). Dono decidiu: `version` = turno, pensamento em bloco próprio, pensamento desligado e arquivos ligados por padrão (DEC-008). wo0001 montou a base da F1 (WXT + TypeScript 6.0 + Vitest; modelo canônico, IDs e datas com 9 testes). Próximo: o dono confere o popup no Chrome; o chat escreve a WO dos exportadores Lunoda com o teste de ouro.
```

---

## Edicao 7 — `meta/CHANGELOG.md` · itens em «Nao lancado»

**Ancora** (ultimo item de «Adicionado»):

```
- Log do dia `logs/2026-10-16.md`.
```

**Substituir por:**

```
- Log do dia `logs/2026-10-16.md`.
- Base de código da F1 (wo0001): WXT 0.21 + TypeScript 6.0 + Vitest 5, ESLint, Prettier, `.editorconfig` e `.gitattributes` (tudo em LF); popup provisório.
- `src/core/`: modelo canônico com `DEFAULT_EXPORT_OPTIONS` (`model.ts`), IDs do Lunoda únicos e crescentes (`ids.ts`) e data local do cabeçalho do MD (`dates.ts`), com 9 testes.
- DEC-008: `version` = turno, pensamento em bloco próprio, padrão pensamento desligado e arquivos ligados.
```

---

## Edicao 8 — `meta/ROADMAP.md` (cinco linhas, cada uma substituida por inteiro)

Cada linha do primeiro bloco e uma ancora de linha inteira; substitua-a pela linha de MESMA posicao do segundo bloco. Texto literal
das cinco ancoras, um por linha:

```
## 🟡 F0 — Fundação *(em curso)*
- [ ] `git init` + primeiro commit.
## 🔵 F1 — MVP: uma conversa do Claude → Lunoda
- [ ] Scaffold WXT + TypeScript + Vitest + ESLint/Prettier.
- [ ] Modelo canônico (`core/model.ts`), geração de IDs e datas.
```

E os cinco textos novos, na mesma ordem:

```
## 🟢 F0 — Fundação *(concluída)*
- [x] `git init` + primeiro commit (`52538ff`).
## 🟡 F1 — MVP: uma conversa do Claude → Lunoda *(em curso)*
- [x] Scaffold WXT + TypeScript + Vitest + ESLint/Prettier (wo0001).
- [x] Modelo canônico (`core/model.ts`), geração de IDs e datas (wo0001).
```

---

## Edicao 9 — `meta/IDEAS.md` · entrada «Capturar o pensamento da IA»

**Ancora:**

```
Incluir o processo de pensamento quando a plataforma o expõe. Coberto por DEC-005; falta decidir padrão e posição no Lunoda (STATUS).
```

**Substituir por:**

```
Incluir o processo de pensamento quando a plataforma o expõe. Coberto por DEC-005 e DEC-008: bloco próprio «Pensamento», desligado por padrão.
```

## Edicao 10 — `meta/IDEAS.md` · entrada «Ramos como versoes»

**Ancora:**

```
Exportar respostas regeneradas ou pedidos editados (ramos da árvore) em vez de só o ramo atual. Pode ser o uso «verdadeiro» do campo `version` do Lunoda — depende do ponto de decisão 1 do STATUS.
```

**Substituir por:**

```
Exportar respostas regeneradas ou pedidos editados (ramos da árvore) em vez de só o ramo atual. Como `version` já é o número do turno (DEC-008), os ramos precisariam de outro mecanismo — por exemplo, um bloco a mais com subtítulo «Claude (alternativa 2)».
```

---

## Edicao 11 — `logs/2026-10-16.md` · a SUA secao, no fim

Acrescente no FIM do arquivo (depois da secao `## Conversa 2 — chat — ...`, sem tocar nela) uma secao
`## Conversa 3 — Code — aplicacao da wo0001`, no formato de `meta/LOG-TEMPLATE.md`, com o que aconteceu DE FATO: saida do
`npm run check`, a prova de vida, se o `.claude/settings.json` entrou ou nao, e qualquer desvio desta WO. Texto seu — e o unico
trecho desta WO que voce redige.

---

## Fora de escopo

- Exportadores (Lunoda MD/JSON), fixtures, adaptador do Claude, permissoes no manifesto (`activeTab`, `downloads`, `storage`,
  host do claude.ai): entram com as WOs seguintes, quando forem usadas (DEC-007).
- Copiar o par `mapsmith 12` para o repositorio: decisao do dono ainda aberta (STATUS).
- `README.md`: continua provisorio de proposito.
- Subir qualquer versao alem das fixadas no `package.json`, mesmo que o `npm` sugira.

## Armadilhas desta WO

- **Fim de linha:** a Edicao 1 cria `.gitattributes` com `* text=auto eol=lf`. Todo arquivo do repo ja esta em LF (`git ls-files --eol`
  no commit `52538ff`: 23 `w/lf` + 1 `w/none`, o `.gitkeep`). Se, depois do `git add`, aparecer qualquer `i/crlf`, PARE e reporte.
- **Ancoras de uma linha longa** (6g, 9, 10): sao paragrafos inteiros numa linha so. Substitua a linha inteira.

---

## Depois de aplicar — conferencia antes do commit

- [ ] `git status --short` mostra exatamente: modificados (` M`) `CLAUDE.md`, `logs/2026-10-16.md`, `meta/CHANGELOG.md`,
      `meta/CONTEXT.md`, `meta/DECISIONS.md`, `meta/IDEAS.md`, `meta/ROADMAP.md`, `meta/STATUS.md`,
      `specs/261016-mvp-exportar-conversa-claude.md` (+ `.claude/settings.json` se o hash novo bateu); nao rastreados (`??`)
      `.editorconfig`, `.gitattributes`, `.prettierignore`, `.prettierrc.json`, `eslint.config.js`, `package-lock.json`,
      `package.json`, `src/`, `tsconfig.json`, `vitest.config.ts`, `wxt.config.ts` e esta WO. Nada de `.output/`, `.wxt/` ou
      `node_modules/`. Diferente disso: PARE.
- [ ] `find src -type f | sort | wc -l` -> **7** (2 do popup + 5 do core).
- [ ] `npm run check` -> codigo 0, `Tests  9 passed (9)`.
- [ ] `grep -c "^## DEC-" meta/DECISIONS.md` -> **8** (unidade: linhas). `grep -c "^## DEC-008" meta/DECISIONS.md` -> **1**.
- [ ] `grep -c "^## ❓" meta/STATUS.md` -> **0** (a secao 6e saiu). `grep -c "^## " meta/STATUS.md` -> **6**
      (Versao Atual, Funcionando, Em Progresso, Quebrado, Backlog, Ultima conversa).
- [ ] `grep -c "^- \[x\]" meta/ROADMAP.md` -> **5** (2 de antes no F0 + 3 desta WO). `grep -c "^## 🟢" meta/ROADMAP.md` -> **1**.
- [ ] `grep -c "ponto de decisão" meta/IDEAS.md` -> **0** (unidade: linhas; as duas mencoes saem nas Edicoes 9 e 10).
- [ ] `grep -c "^## Conversa" logs/2026-10-16.md` -> **3**.
- [ ] `git ls-files --eol` depois do `git add` -> nenhuma linha com `i/crlf`.
- [ ] O que esta tarefa criou fora do repositorio foi fechado (nenhum `npm run dev` deixado rodando).

## Relatorio de aplicacao *(quem aplica preenche ao terminar)*

O que foi feito, edicao por edicao · a SAIDA CRUA das conferencias (numero + comando) · o que fugiu do texto literal da WO · se o
`.claude/settings.json` entrou · arquivos tocados · `npm run check` · commit e push. Escreva-o DEPOIS de resolver o push.

## Commit — blocos separados, mensagem SEM acento

Se o `.claude/settings.json` NAO estiver com o hash novo, tire-o do `add`.

```
git add .editorconfig .gitattributes .prettierignore .prettierrc.json eslint.config.js package.json package-lock.json tsconfig.json vitest.config.ts wxt.config.ts src CLAUDE.md meta/CONTEXT.md meta/DECISIONS.md meta/STATUS.md meta/CHANGELOG.md meta/ROADMAP.md meta/IDEAS.md specs/261016-mvp-exportar-conversa-claude.md logs/2026-10-16.md .claude/settings.json meta/workorders/261016-wo0001-scaffold-wxt-e-core.md
```

```
git commit -m "feat(scaffold): cria base WXT com modelo canonico, ids e datas do Lunoda" -m "WXT 0.21 + TypeScript 6.0 + Vitest 5, ESLint e Prettier; popup provisorio; src/core com modelo canonico, gerador de ids e data local do MD, 9 testes. Registra DEC-008 (versao = turno, pensamento em bloco proprio, padroes) e atualiza STATUS, CHANGELOG, ROADMAP e IDEAS."
```

```
git push
```

**Sem remoto:** o repositorio nasceu local (`52538ff`, sem `origin`). Se `git remote` vier vazio, nao ha push — isso NAO e vermelho:
commite, escreva «sem remoto configurado» no campo do push e siga.
