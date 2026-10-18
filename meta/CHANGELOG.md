# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

## [Não lançado]

## [0.1.0] — 2026-10-17
Primeira versão usável: F1 (uma conversa do Claude → Lunoda) e a primeira leva da F2 (formatos «simples» e opções).

### Adicionado
- **Exportar** a conversa aberta no claude.ai com um clique no popup, nos formatos marcados (DEC-011, DEC-012):
  - **Lunoda** — `<título>.json` (importável) e `<título>.md`, no layout do Lunoda; link da conversa na descrição e «IA Utilizada» marcada na entrada e nos blocos da IA.
  - **Markdown simples** — `<título> (simples).md`, para ler: `## Você · N` / `## Claude · N` por turno.
  - **JSON do CDC** — `<título>.cdc.json`, a conversa normalizada inteira, para guardar e reprocessar.
- Opções **pensamento** (resumos, em bloco próprio — DEC-008) e **lista de arquivos** anexados e gerados (por referência, nunca o binário — DEC-005), lembradas entre usos. Primeiro uso: só Lunoda, sem pensamento, com arquivos.
- Normalizador do Claude sobre o formato medido em capturas reais: só o ramo atual, texto de `content[]`, respostas seguidas unidas, mensagens vazias fora (DEC-011).
- Botão de depuração «Salvar resposta bruta» para capturar o formato real da API (DEC-010).
- Permissões mínimas: `activeTab`, `scripting`, `downloads`, `storage`; nenhuma permissão de site permanente (DEC-007, DEC-010).
- Base de desenvolvimento: WXT 0.21 + TypeScript 6.0 + Vitest 5, ESLint e Prettier; `npm run check` com 90 testes; par sintético versionado e oráculo privado do Lunoda e capturas reais fora do repositório (DEC-009).
- Documentação de contexto do KCM v1.124.0 (`meta/`, `specs/`, `logs/`, `CLAUDE.md`, `.claude/`), DEC-001 a DEC-012.

### Conferido
- O Lunoda importou exportações reais (com e sem pensamento) e as devolveu iguais — só o título e o `updatedAt` mudam.
