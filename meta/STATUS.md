# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-16 — fundação: ideia, decisões e documentação de contexto; ainda sem código.

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.

## 🔧 Em Progresso
- **F0 — Fundação:** falta o `git init` + primeiro commit, que o dono roda no CMD (comando no fim da conversa de 2026-10-16).

## ❌ Quebrado / Com Problema
- Nada (não há código).

## ❓ Pontos de decisão do dono (destravam a F1)
1. **`version` no Lunoda** — no `mapsmith 12` ela é o número do turno (Prompt v1, Claude v1, Prompt v2…). É esse o significado, ou o campo foi pensado para versões do mesmo bloco (ex.: regenerar uma resposta)? Recomendação: manter = turno.
2. **Onde vai o pensamento no Lunoda** — (a) bloco próprio com `subtitle: "Pensamento"`, mesma versão do turno; (b) dentro do bloco da resposta, num trecho marcado. Recomendação: (a), porque o Lunoda continua com um texto por bloco.
3. **Padrão das opções** — pensamento e arquivos vêm desligados ou ligados no primeiro uso? Recomendação: pensamento **desligado**, lista de arquivos **ligada** (custa uma linha e diz o que foi anexado).

## 📋 Backlog (curto prazo)
- [ ] Rodar `git init` + primeiro commit (dono, CMD).
- [ ] Responder os três pontos de decisão acima.
- [ ] Testar no Lunoda um `.json` feito à mão com um bloco `subtitle: "Pensamento"` e com `p-ia` preenchido (`["o4"]`) — confirma se o importador aceita os dois antes de virar código.
- [ ] Decidir se o par `mapsmith 12` (conteúdo real do dono) entra versionado como fixture de ouro — só se o repositório for privado; senão, montar um par sintético.
- [ ] F1: scaffold WXT + Vitest e primeiro adaptador (Claude), conforme a spec do MVP.

## 💬 Última conversa
**2026-10-16** — Ideia desenvolvida e documentada: extensão MV3, adaptador por plataforma via API interna, modelo canônico, exportadores Lunoda JSON/MD espelhando o `mapsmith 12` (formato medido no disco). Sete decisões registradas (DEC-001 a DEC-007), pesquisa do estado da arte em HISTORY §1. Próximo: commit inicial, os três pontos de decisão e o scaffold da F1.
