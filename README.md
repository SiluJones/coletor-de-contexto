# Coletor de Contexto (CDC)

Extensão do Chrome que exporta a conversa aberta no claude.ai para arquivos de texto: `.json` importável no [Lunoda](#lunoda), `.md` no mesmo layout, um Markdown simples para ler e um JSON com a conversa inteira. Tudo local, sob demanda, com a sessão já logada no navegador — sem servidor, sem varredura em segundo plano.

> **Versão 0.1.0.** Só o Claude por enquanto; ChatGPT e Gemini estão no [roteiro](meta/ROADMAP.md).

## O que sai

| Formato | Arquivo | Para quê |
|---|---|---|
| Markdown simples | `<título> (simples).md` | Ler: `## Você · N` / `## Claude · N` por turno |
| Resposta bruta | `cdc-raw/<título> — claude-<id>-<data>.json` | Guardar sem perda: a resposta da API como veio, com o que a IA fez por ferramenta e os ramos editados |
| Lunoda | `<título>.json` + `<título>.md` | Importar no Lunoda; um bloco por mensagem (`Prompt`, `Pensamento`, `Claude`) |
| JSON do CDC | `<título>.cdc.json` | A conversa normalizada inteira (o que os outros formatos usam) |

No primeiro uso vêm marcados o Markdown simples e a resposta bruta: um para ler, outro para não perder nada.

Opções no popup, lembradas entre usos: **pensamento** (os resumos que o claude.ai mostra) e **lista de arquivos** anexados e gerados (nome, tipo e tamanho — nunca o conteúdo). Só o ramo da conversa que está na tela é exportado.

## Instalar (Chrome, sem loja)

Requer Node.js 22.13 ou mais novo (o Vitest 5 pede `^22.12`, o ESLint 10 `^22.13`, o WXT `>=22`).

```
git clone git@github.com:SiluJones/coletor-de-contexto.git
cd coletor-de-contexto
npm ci
npm run build
```

Depois, em `chrome://extensions`: ligue o **Modo do desenvolvedor**, clique em **Carregar sem compactação** e escolha a pasta `.output\chrome-mv3`. Fixe o ícone na barra.

> A extensão descompactada ganha o ID pelo caminho da pasta: se mudar a pasta de lugar, remova e carregue de novo (as preferências do popup voltam ao padrão).

## Usar

1. Abra uma conversa em `claude.ai/chat/…`.
2. Clique no ícone do Coletor de Contexto, marque os formatos e as opções.
3. **Exportar** — os arquivos caem em `Downloads/`, com o título da conversa na frente do nome.

**Copiar conversa** põe a conversa inteira em Markdown simples na área de transferência (com as mesmas opções); **Copiar última resposta** copia só o texto da última resposta da IA — bom para colar num handoff.

**Reprocessar arquivos guardados…** (no popup, em qualquer aba) abre uma página onde você escolhe ou arrasta respostas brutas (`cdc-raw/…json`) ou JSONs do CDC (`.cdc.json`) já guardados e gera deles os outros formatos — sem buscar a conversa de novo, mesmo que ela não exista mais no claude.ai. Os arquivos caem em `Downloads/cdc-reprocessado/<data-hora>/`.

A resposta bruta é salva antes de qualquer outro formato: se o claude.ai mudar o formato e a exportação falhar, ela já está em `Downloads/cdc-raw/` — é o que serve para consertar.

## Lunoda
Aplicação do autor para guardar textos em entradas e blocos. O `.json` exportado se importa direto nela; o `.md` é para leitura e para um importador futuro.

## Desenvolvimento

```
npm run check
```

Roda typecheck, ESLint, Prettier, testes (Vitest) e build. Os testes de fidelidade com material real ficam fora do repositório e só rodam com a pasta indicada:

- `CDC_LUNODA_ORACLE_DIR=<pasta>` — pares `.json` + `.md` exportados pelo próprio Lunoda; o exportador tem de reproduzi-los byte a byte.
- `CDC_CLAUDE_CAPTURES_DIR=<pasta>` — respostas brutas do claude.ai; nenhuma pode virar turno vazio.
- `CDC_REPROCESS_PAIRS_DIR=<pasta>` — um histórico com `cdc-raw/` e os `(simples).md`; o reprocessado tem de ser igual ao guardado.

Estrutura: `src/adapters/` lê cada plataforma e devolve o modelo canônico (`src/core/model.ts`); `src/exporters/` transforma o modelo em cada formato; `src/entrypoints/popup/` é a interface. Arquitetura, decisões e armadilhas em [`meta/CONTEXT.md`](meta/CONTEXT.md) e [`meta/DECISIONS.md`](meta/DECISIONS.md).

## Documentação do projeto
- `meta/` — contexto (CONTEXT, STATUS, DECISIONS, ROADMAP, IDEAS…); `meta/workorders/` — instruções de aplicação do chat para o Claude Code.
- `specs/` — uma spec por feature. `logs/` — um arquivo por dia.
- `CLAUDE.md` + `.claude/` — arranque do Claude Code. `INSTRUCOES-DO-PROJETO.md` — Instruções do Projeto no claude.ai.

Estrutura de contexto gerada pelo Kit de Contexto Universal v1.169.0.

## Licença
[MIT](LICENSE).

## Aviso
Usa endpoints internos e não documentados do claude.ai, os mesmos que a página usa; podem mudar sem aviso. Use com a sua própria conta e com moderação.
