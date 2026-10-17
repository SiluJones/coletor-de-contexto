# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-16 — F1 em curso: o botão «Exportar para o Lunoda» baixa o `.json` e o `.md` da conversa aberta no claude.ai; falta a conferência do dono no navegador e no Lunoda.

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
- Extensão carregada à mão no Chrome do dono; popup provisório conferido (2026-10-16).
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.
- O Lunoda importou o `sintetico.json` (bloco «Pensamento» e listas de arquivos aceitos) e o devolveu byte a byte; o MD reproduz também a propriedade marcada (wo0003) e a descrição (wo0004). Oráculo: 4 pares em `CDC/oraculo-lunoda/`.
- Normalizador do Claude (wo0004): 4 capturas reais em `CDC/capturas-claude/cdc-raw/` normalizam sem turno vazio (DEC-011).

## 🔧 Em Progresso
- **F1 — MVP:** passos 1 a 8 da spec escritos (wo0001 a wo0004). Falta o passo 9: o dono exporta uma conversa real pelo botão e a importa no Lunoda.

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: exportar uma conversa real pelo botão «Exportar para o Lunoda» e importar o `.json` no Lunoda (roteiro na conversa de 2026-10-16) — fecha a F1.
- [ ] Dono: dizer de onde veio `CDC/261016-2317.txt` (página HTML do claude.ai, 268 KB) — sem uso para o projeto até agora.
- [ ] F2: popup com opções (pensamento, arquivos) e formatos «simples» (Markdown legível + JSON do CDC) — próxima WO do chat.

## 💬 Última conversa
**2026-10-16** — 4 capturas reais medidas: o texto vem em `content[]` (o campo `text` é vazio) e o pensamento só em resumos. wo0004: normalizador do Claude e botão «Exportar para o Lunoda»; arquivo com o título da conversa, link na descrição, «IA Utilizada» marcada (DEC-011). Próximo: o dono exporta e importa uma conversa real; depois, F2.
