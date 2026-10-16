# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

## [Não lançado]
### Adicionado
- Estrutura do repositório gerada pelo KCM v1.124.0 (`meta/`, `logs/`, `CLAUDE.md`, `.claude/`).
- Documentação de contexto preenchida para o Coletor de Contexto: CONTEXT, STATUS, DECISIONS (DEC-001 a DEC-007), IDEAS, ROADMAP, GLOSSARY, HISTORY, LOG-TEMPLATE e modelo de SPEC.
- Spec do MVP: `specs/261016-mvp-exportar-conversa-claude.md`.
- `.gitignore` do stack Node/TypeScript/WXT.
- Log do dia `logs/2026-10-16.md`.
- Base de código da F1 (wo0001): WXT 0.21 + TypeScript 6.0 + Vitest 5, ESLint, Prettier, `.editorconfig` e `.gitattributes` (tudo em LF); popup provisório.
- `src/core/`: modelo canônico com `DEFAULT_EXPORT_OPTIONS` (`model.ts`), IDs do Lunoda únicos e crescentes (`ids.ts`) e data local do cabeçalho do MD (`dates.ts`), com 9 testes.
- DEC-008: `version` = turno, pensamento em bloco próprio, padrão pensamento desligado e arquivos ligados.
