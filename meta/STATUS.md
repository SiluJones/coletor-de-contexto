# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.1.0** — 2026-10-17 — F1 (uma conversa do Claude → Lunoda) e a primeira leva da F2 (formatos «simples» e opções), conferidas pelo dono. Tag `v0.1.0` empurrada (wo0006, `1ffc2df`).

## ✅ Funcionando
- Estrutura do repositório (KCM v1.162.1, desde 2026-11-25 — DEC-014) com os `meta/` preenchidos para este projeto.
- Base de código: WXT + TypeScript + Vitest, `npm run check` verde.
- Exportadores Lunoda JSON e MD: reproduzem os pares do Lunoda byte a byte no oráculo privado (6 pares em `CDC/oraculo-lunoda/`, um deles com blocos «Pensamento», DEC-009).
- Normalizador do Claude: capturas reais em `CDC/capturas-claude/cdc-raw/` (7 em 2026-10-19) sem turno vazio (DEC-011).
- «Copiar conversa» e «Copiar última resposta» (wo0007, DEC-013): conferidos pelo dono em 2026-10-19, texto colado inteiro, sem permissão `clipboardWrite`.
- Licença MIT (`LICENSE`).
- Botão «Exportar» da F1: o dono exportou «CDC 1» e o Lunoda importou; a reexportação do Lunoda é igual (só título e `updatedAt` mudam). Exportações em `CDC/exportacoes-cdc/<AAMMDD-HHMM>/`.
- Formatos e opções da F2 (wo0005, DEC-012): os 4 arquivos saem, as caixas ficam lembradas, e o Lunoda importou o `.json` com pensamento e o devolveu igual (só título e `updatedAt` mudam) — conferido em 2026-10-17.

## 🔧 Em Progresso
- **F2:** levas «formatos e opções» e «copiar» entregues e conferidas. Faltam «conteúdo dos artefatos gerados» (pede medir antes onde a API entrega o texto) e «nome de arquivo configurável» (ROADMAP).
- **Instruções do Projeto:** o `INSTRUCOES-DO-PROJETO.md` fundido no kit v1.162.1 (wo0009) ainda não foi colado pelo dono no painel do Projeto; até lá o chat lê o texto antigo. Depois de colar, a pasta do pacote `CDC/261124-kcm-update-dev-v1.162.1/` vai para `notas-arquivadas/`.

## ❌ Quebrado / Com Problema
- Nada confirmado. **Em observação:** nome do arquivo em outro perfil do Chrome [relatado pelo dono, 2026-10-20]. Não reproduzido: a exportação de «KCM 1» feita no segundo perfil em 2026-10-20 23:41 saiu com o nome certo nos 4 arquivos [medido no disco, `CDC/exportacoes-cdc/261020-2341/`]. Suspeita antiga (extensão de downloads daquele perfil) não testada. Fechar se não voltar.

## 📋 Backlog (curto prazo)
- [ ] Release v0.1.0 no GitHub: a tag existe (`1ffc2df`); a página da release com o `.zip` não foi confirmada [relatado pelo dono: «pendente, eu acho»]. Sem o `gh` no PC, o dono cria pela página ou instala o `gh` e o Code roda a Edição 4 da wo0006.
- [ ] Olhar as exportações de outros projetos que usaram o CDC, inclusive de outros perfis do Chrome [relatado pelo dono, 2026-11-24: ele vai dar acesso às pastas] — validar o normalizador e os formatos em conversas variadas.
- [ ] Ícone próprio da extensão (pedido do dono, IDEAS).

## 💬 Última conversa
**2026-11-25** — Conversa de chat 2: template-update do KCM v1.124.0 → v1.162.1 (DEC-014), com o perfil transplantado em vez de regerar o pacote; wo0009 registra. Próximo: o dono cola as Instruções no painel; depois, release v0.1.0 no GitHub ou as exportações de outros projetos (Backlog).
