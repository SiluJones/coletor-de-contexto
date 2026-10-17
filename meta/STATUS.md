# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-17 — F1 concluída (exportar uma conversa do Claude para o Lunoda, conferida pelo dono). F2 em curso: primeira leva (formatos «simples» e opções no popup, wo0005) conferida pelo dono.

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Base de código: WXT + TypeScript + Vitest, `npm run check` verde.
- Exportadores Lunoda JSON e MD: reproduzem os pares do Lunoda byte a byte no oráculo privado (6 pares em `CDC/oraculo-lunoda/`, um deles com blocos «Pensamento», DEC-009).
- Normalizador do Claude: 6 capturas reais em `CDC/capturas-claude/cdc-raw/` sem turno vazio (DEC-011).
- Botão «Exportar» da F1: o dono exportou «CDC 1» e o Lunoda importou; a reexportação do Lunoda é igual (só título e `updatedAt` mudam). Exportações em `CDC/exportacoes-cdc/<AAMMDD-HHMM>/`.
- Formatos e opções da F2 (wo0005, DEC-012): os 4 arquivos saem, as caixas ficam lembradas, e o Lunoda importou o `.json` com pensamento e o devolveu igual (só título e `updatedAt` mudam) — conferido em 2026-10-17.

## 🔧 Em Progresso
- **F2:** primeira leva entregue e conferida. Faltam as levas «copiar para a área de transferência», «conteúdo dos artefatos gerados» e «nome de arquivo configurável» (ROADMAP); a próxima é escolha do dono.

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: escolher a próxima leva da F2 (recomendação do chat: copiar para a área de transferência).
- [ ] Dono: decidir se corta a release 0.1.0 (F1 + primeira leva da F2).
- [ ] Dono: transferir o repositório de `joaolucas-nds` para `SiluJones` no GitHub e mover a pasta de `C:\Users\alexk\Tools\CDC` para `C:\Users\alexk\Arquiteturas\CDC` (roteiro na conversa de 2026-10-17); depois, `git remote set-url` e recarregar a extensão do novo caminho.

## 💬 Última conversa
**2026-10-17** — F1 fechada pelo dono. wo0005: Markdown simples, JSON do CDC (conversa inteira) e opções no popup lembradas em `chrome.storage.local` (DEC-012). Code aplicou a wo0005 (`a8cd810`); o dono conferiu no navegador e no Lunoda. Próximo: transferência do repo para `SiluJones` e mudança da pasta para `Arquiteturas`; depois, release 0.1.0 e a próxima leva da F2.
