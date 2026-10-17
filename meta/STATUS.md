# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.0.0** — 2026-10-16 — F1 em curso: núcleo e exportadores do Lunoda prontos; a extensão já busca a conversa do Claude e salva a resposta bruta, mas ainda não a traduz para o Lunoda.

## ✅ Funcionando
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
- Spec do MVP escrita: `specs/261016-mvp-exportar-conversa-claude.md`.
- Base de código (wo0001): WXT + TypeScript + Vitest, `npm run check` verde; `src/core/` com modelo canônico, IDs e datas do Lunoda e 9 testes.
- Extensão carregada à mão no Chrome do dono; popup provisório conferido (2026-10-16).
- Exportadores Lunoda JSON e MD (wo0002): reproduzem o `mapsmith 12` real byte a byte no oráculo privado (DEC-009); par sintético versionado em `src/tests/fixtures/lunoda/`.
- O Lunoda importou o `sintetico.json` (bloco «Pensamento» e listas de arquivos aceitos) e o devolveu byte a byte; o MD reproduz também a propriedade marcada (wo0003). Oráculo: 3 pares em `CDC/oraculo-lunoda/`.

## 🔧 Em Progresso
- **F1 — MVP:** passos 1 a 6 da spec escritos (wo0001 a wo0003); a captura bruta ainda não foi usada no navegador. Próximo: capturas reais → normalizador do Claude (passo 7).

## ❌ Quebrado / Com Problema
- Nada conhecido.

## 📋 Backlog (curto prazo)
- [ ] Dono: capturar 2 ou 3 conversas reais com o botão de depuração e movê-las para `CDC/capturas-claude/` — uma com pensamento, uma com anexo, uma com pedido editado (roteiro na conversa de 2026-10-16).
- [ ] Dono: dizer se «IA Utilizada» ficou só nos blocos «Claude» por herança do Lunoda ou porque foi marcada bloco a bloco — decide como o exportador preenche `p-ia` (IDEAS).
- [ ] F1: normalizador do Claude sobre as capturas (passo 7 da spec) — próxima WO do chat.

## 💬 Última conversa
**2026-10-16** — O Lunoda aceitou o `sintetico.json` e o devolveu byte a byte; com «IA Utilizada» marcada, mostrou o formato das propriedades, que o MD agora reproduz (oráculo com 3 pares). wo0003: busca da conversa do Claude e captura bruta (DEC-010). Próximo: o dono captura conversas reais; o chat escreve o normalizador sobre elas.
