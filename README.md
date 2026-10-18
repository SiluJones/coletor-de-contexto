# Coletor de Contexto (CDC)

Extensão do Chrome que exporta a conversa aberta no claude.ai para arquivos de texto: `.json` importável no [Lunoda](#lunoda), `.md` no mesmo layout, um Markdown simples para ler e um JSON com a conversa inteira. Tudo local, sob demanda, com a sessão já logada no navegador — sem servidor, sem varredura em segundo plano.

> **Versão 0.1.0.** Só o Claude por enquanto; ChatGPT e Gemini estão no [roteiro](meta/ROADMAP.md).

## O que sai

| Formato | Arquivo | Para quê |
|---|---|---|
| Lunoda | `<título>.json` + `<título>.md` | Importar no Lunoda; um bloco por mensagem (`Prompt`, `Pensamento`, `Claude`) |
| Markdown simples | `<título> (simples).md` | Ler: `## Você · N` / `## Claude · N` por turno |
| JSON do CDC | `<título>.cdc.json` | Guardar a conversa inteira, com tudo o que foi capturado |

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

«Salvar resposta bruta (depuração)» baixa a resposta da API como veio, para diagnosticar quando o formato do claude.ai mudar.

## Lunoda
Aplicação do autor para guardar textos em entradas e blocos. O `.json` exportado se importa direto nela; o `.md` é para leitura e para um importador futuro.

## Desenvolvimento

```
npm run check
```

Roda typecheck, ESLint, Prettier, testes (Vitest) e build. Os testes de fidelidade com material real ficam fora do repositório e só rodam com a pasta indicada:

- `CDC_LUNODA_ORACLE_DIR=<pasta>` — pares `.json` + `.md` exportados pelo próprio Lunoda; o exportador tem de reproduzi-los byte a byte.
- `CDC_CLAUDE_CAPTURES_DIR=<pasta>` — respostas brutas do claude.ai; nenhuma pode virar turno vazio.

Estrutura: `src/adapters/` lê cada plataforma e devolve o modelo canônico (`src/core/model.ts`); `src/exporters/` transforma o modelo em cada formato; `src/entrypoints/popup/` é a interface. Arquitetura, decisões e armadilhas em [`meta/CONTEXT.md`](meta/CONTEXT.md) e [`meta/DECISIONS.md`](meta/DECISIONS.md).

## Documentação do projeto
- `meta/` — contexto (CONTEXT, STATUS, DECISIONS, ROADMAP, IDEAS…); `meta/workorders/` — instruções de aplicação do chat para o Claude Code.
- `specs/` — uma spec por feature. `logs/` — um arquivo por dia.
- `CLAUDE.md` + `.claude/` — arranque do Claude Code. `INSTRUCOES-DO-PROJETO.md` — Instruções do Projeto no claude.ai.

Estrutura de contexto gerada pelo Kit de Contexto Universal v1.124.0.

## Aviso
Usa endpoints internos e não documentados do claude.ai, os mesmos que a página usa; podem mudar sem aviso. Use com a sua própria conta e com moderação.
