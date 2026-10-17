# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos e testados; ainda não lê conversa do Claude (sem adaptador nem botão).

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
- Extensão carregada à mão no Chrome do dono; popup provisório conferido (2026-10-16).
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.

## 🔧 Em Progresso
- **F1 — MVP:** passos 1 a 5 da spec prontos (wo0001, wo0002). Próximo: botão de depuração «salvar resposta bruta» e adaptador Claude (passos 6 e 7).

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: importar `src/tests/fixtures/lunoda/sintetico.json` no Lunoda e exportar de volta (roteiro na conversa de 2026-10-16) — confirma se o Lunoda aceita o bloco «Pensamento» e as listas de arquivos, e mostra como ele grava `p-ia` preenchido.
- [ ] F1: botão «salvar resposta bruta» + adaptador Claude (passos 6 e 7 da spec) — próxima WO do chat.

## 💬 Última conversa
**2026-10-16** — Popup conferido no Chrome. Repositório público → DEC-009: fixture sintética versionada e oráculo do Lunoda fora do repo. wo0002 entregou os exportadores Lunoda JSON e MD, que reproduzem o `mapsmith 12` byte a byte. Próximo: o dono testa o `sintetico.json` no Lunoda; o chat escreve a WO do adaptador Claude.
