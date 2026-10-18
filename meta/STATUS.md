# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.1.0** — 2026-10-17 — F1 (uma conversa do Claude → Lunoda) e a primeira leva da F2 (formatos «simples» e opções), conferidas pelo dono. Release pela wo0006.

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
- [ ] Dono: publicar a release v0.1.0 no GitHub a partir da tag, com o `.zip` (roteiro na conversa de 2026-10-17).
- [ ] Dono: escolher a licença do repositório público (hoje sem `LICENSE`: ninguém pode reutilizar o código).

## 💬 Última conversa
**2026-10-17** — Repositório transferido para `SiluJones` e pasta movida para `C:\Users\alexk\Arquiteturas\CDC` (identidade e chave conferidas, `npm run check` verde, extensão recarregada). wo0006: release 0.1.0 (versão, tag, `.zip`, README). Próximo: o Code aplica; o dono publica a release no GitHub e escolhe a licença.
