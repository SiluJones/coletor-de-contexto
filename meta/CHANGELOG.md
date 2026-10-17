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
- Exportadores Lunoda (wo0002): `buildLunodaEntry` (modelo → entrada, com pensamento e listas de arquivos), `renderLunodaJson`, `parseLunodaJson` e `renderLunodaMd`; reproduzem o `mapsmith 12` byte a byte.
- Par sintético versionado (`src/tests/fixtures/lunoda/`) e oráculo privado por `CDC_LUNODA_ORACLE_DIR` (DEC-009); `@types/node` 22.20.5; 27 testes.
- MD do Lunoda com propriedades marcadas (front matter, cabeçalho e blocos), medido no par `sintetico-lunoda-ia` (wo0003).
- Captura bruta do Claude (wo0003, DEC-010): popup reconhece `claude.ai/chat/<uuid>`, injeta a busca na aba e baixa o corpo exato para `Downloads/cdc-raw/`; permissões `activeTab`, `scripting`, `downloads`; 50 testes.
- Normalizador do Claude (wo0004, DEC-011): ramo atual, texto de `content[]`, pensamento por resumos, respostas seguidas unidas, anexos e arquivos gerados por referência; testado com resposta sintética e com capturas reais fora do repo.
- Botão «Exportar para o Lunoda» (wo0004): baixa `<título>.json` e `<título>.md`, com o link da conversa na descrição e «IA Utilizada» marcada; captura bruta passa a ter o título na frente do nome; 80 testes.
