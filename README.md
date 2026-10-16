# Coletor de Contexto (CDC)

Extensão de navegador que exporta conversas do claude.ai (e, depois, ChatGPT e Gemini) para `.json` importável no Lunoda e `.md` no mesmo layout. Tudo local, sob demanda.

> **Estado:** fundação — documentação e decisões prontas, ainda sem código. Este README ganha instalação, uso e prints quando o MVP (F1) existir; escrito agora, nasceria velho.

## Estrutura
- `meta/` — arquivos de contexto (CEREBRO define COMO o assistente age; CONTEXT, O QUE o projeto é; STATUS, DECISIONS, IDEAS, ROADMAP…).
- `specs/` — uma spec por feature.
- `INSTRUCOES-DO-PROJETO.md` — cole em Projeto → Instruções no claude.ai.
- `logs/` — um arquivo por dia (`AAAA-MM-DD.md`).
- `CLAUDE.md` + `.claude/` — arranque do Claude Code (skills `apply-wo`, `wrap`, `sondar`).
- `meta/workorders/` — WOs do chat para o Code.
- `.gitignore` / `.flatdropignore` — o segundo enxuga o que sobe ao Projeto do Claude sem tirar o versionamento.

Estrutura gerada pelo Kit de Contexto Universal v1.124.0 em 2026-10-16.
