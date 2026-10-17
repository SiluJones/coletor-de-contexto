# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-17 — F1 concluída (exportar uma conversa do Claude para o Lunoda, conferida pelo dono). F2 em curso: formatos «simples» e opções no popup (wo0005).

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Base de código: WXT + TypeScript + Vitest, `npm run check` verde.
- Exportadores Lunoda JSON e MD: reproduzem os pares do Lunoda byte a byte no oráculo privado (5 pares em `CDC/oraculo-lunoda/`, DEC-009).
- Normalizador do Claude: 5 capturas reais em `CDC/capturas-claude/cdc-raw/` sem turno vazio (DEC-011).
- Botão «Exportar» da F1: o dono exportou «CDC 1» e o Lunoda importou; a reexportação do Lunoda é igual (só título e `updatedAt` mudam). Exportações em `CDC/exportacoes-cdc/`.

## 🔧 Em Progresso
- **F2 — primeira leva (wo0005):** caixas de formato (Lunoda, Markdown simples, JSON do CDC) e de opção (pensamento, arquivos), lembradas entre usos (DEC-012). Falta o Code aplicar e o dono conferir no navegador.

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: no navegador, marcar os 3 formatos e as 2 opções, exportar (4 arquivos), reabrir o popup (caixas mantidas) e importar no Lunoda o `.json` com pensamento.
- [ ] Dono: decidir se corta a release 0.1.0 com a F1 (e a F2 em curso no «Não lançado»).
- [ ] Dono: dizer de onde veio `CDC/261016-2317.txt` (página HTML do claude.ai, 268 KB) — sem uso para o projeto até agora.

## 💬 Última conversa
**2026-10-17** — F1 fechada pelo dono. wo0005: Markdown simples, JSON do CDC (conversa inteira) e opções no popup lembradas em `chrome.storage.local` (DEC-012). Próximo: o Code aplica; o dono confere no navegador.
