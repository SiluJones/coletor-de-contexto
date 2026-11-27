# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.2.0** — 2026-11-27 — F2 quase inteira: copiar, resposta bruta como formato (padrão «simples + bruta») e reprocessar arquivos guardados, todos conferidos pelo dono. Tag `v0.2.0` e release pelo bloco do dono e pela API do GitHub (chat). Anterior: 0.1.0 (2026-10-17, tag `v0.1.0`).

## ✅ Funcionando
- Estrutura do repositório (KCM v1.169.0, desde 2026-11-27 — DEC-014, DEC-016) com os `meta/` preenchidos para este projeto. Método C (DEC-016): o chat grava, o dono versiona pelo bloco.
- Base de código: WXT + TypeScript + Vitest, `npm run check` verde.
- Exportadores Lunoda JSON e MD: reproduzem os pares do Lunoda byte a byte no oráculo privado (6 pares em `CDC/oraculo-lunoda/`, um deles com blocos «Pensamento», DEC-009).
- Normalizador do Claude: capturas reais em `CDC/capturas-claude/cdc-raw/` (7 em 2026-10-19) sem turno vazio (DEC-011).
- «Copiar conversa» e «Copiar última resposta» (wo0007, DEC-013): conferidos pelo dono em 2026-10-19, texto colado inteiro, sem permissão `clipboardWrite`.
- Licença MIT (`LICENSE`).
- Resposta bruta como formato do «Exportar» (wo0011, DEC-015): conferida pelo dono no navegador em 2026-11-27, itens 1 a 5 ok.
- «Reprocessar arquivos guardados» (DEC-017, commit `a51da8a`): conferido pelo dono no navegador em 2026-11-27, itens 1 a 5 ok; os arquivos do teste (Hey Mother 3) conferidos pelo chat contra o histórico — `(simples).md` igual fora a data, `.cdc.json` com a conversa idêntica, Lunoda com os 20 blocos iguais.
- Release v0.1.0 no GitHub, com o `coletor-de-contexto-0.1.0-chrome.zip` anexado — publicada pelo dono em 2026-11-26 pela página de releases.
- Botão «Exportar» da F1: o dono exportou «CDC 1» e o Lunoda importou; a reexportação do Lunoda é igual (só título e `updatedAt` mudam). Exportações em `CDC/exportacoes-cdc/<AAMMDD-HHMM>/`.
- Formatos e opções da F2 (wo0005, DEC-012): os 4 arquivos saem, as caixas ficam lembradas, e o Lunoda importou o `.json` com pensamento e o devolveu igual (só título e `updatedAt` mudam) — conferido em 2026-10-17.

## 🔧 Em Progresso
- **F2:** levas «formatos e opções», «copiar», «resposta bruta» e «reprocessar» entregues e conferidas. Faltam «conteúdo dos artefatos gerados» (a bruta já tem o dado: entradas de ferramenta) e «nome de arquivo configurável» (ROADMAP).
- **Alarme do método C (DEC-016):** erros que chegaram a um commit: 0 · WOs seguidas paradas por conteúdo: 0.

## ❌ Quebrado / Com Problema
- Nada confirmado. **Em observação:** nome do arquivo em outro perfil do Chrome [relatado pelo dono, 2026-10-20]. Não reproduzido: a exportação de «KCM 1» feita no segundo perfil em 2026-10-20 23:41 saiu com o nome certo nos 4 arquivos [medido no disco, `CDC/exportacoes-cdc/261020-2341/`]. Suspeita antiga (extensão de downloads daquele perfil) não testada. Fechar se não voltar.

## 📋 Backlog (curto prazo)
- [ ] Colar o `INSTRUCOES-DO-PROJETO.md` no painel do Projeto (a linha do bloco simples, emenda da DEC-018).
- [ ] Release v0.2.0 no GitHub com o `.zip` (o chat, pela API, depois do push da tag).
- [ ] Próxima frente de produto: a decidir (candidatas no ROADMAP/IDEAS: ícone, conteúdo dos artefatos, F3 outras IAs).
- [ ] Ícone próprio da extensão (pedido do dono, IDEAS).

## 💬 Última conversa
**2026-11-27** — Conversa de chat 2: resposta bruta e reprocessar conferidos; KCM v1.169.0 com o método C (DEC-016); blocos do dono simples, rodando no CMD e no PowerShell (DEC-018 emendada); versão 0.2.0 cortada. Próximo: o dono roda o bloco (commit + tag), o chat publica a release, o dono escolhe a próxima frente.
