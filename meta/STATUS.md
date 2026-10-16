# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-16 — base de código da F1 (scaffold, modelo canônico, IDs e datas do Lunoda); ainda não exporta nada.

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.

## 🔧 Em Progresso
- **F1 — MVP:** passos 1 a 3 da spec prontos (wo0001). Próximo: exportadores Lunoda MD e JSON com o teste de ouro (passos 4 e 5).

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: carregar `.output/chrome-mv3` no Chrome (modo desenvolvedor) e conferir o popup provisório.
- [ ] Testar no Lunoda um `.json` feito à mão com um bloco `subtitle: "Pensamento"` e com `p-ia` preenchido (`["o4"]`) — confirma se o importador aceita os dois antes de virar código.
- [ ] Decidir se o par `mapsmith 12` (conteúdo real do dono) entra versionado como fixture de ouro — só se o repositório for privado; senão, montar um par sintético.
- [ ] F1: exportadores Lunoda MD e JSON + teste de ouro (passos 4 e 5 da spec) — próxima WO do chat.

## 💬 Última conversa
**2026-10-16** — Commit inicial feito (`52538ff`). Dono decidiu: `version` = turno, pensamento em bloco próprio, pensamento desligado e arquivos ligados por padrão (DEC-008). wo0001 montou a base da F1 (WXT + TypeScript 6.0 + Vitest; modelo canônico, IDs e datas com 9 testes). Próximo: o dono confere o popup no Chrome; o chat escreve a WO dos exportadores Lunoda com o teste de ouro.
