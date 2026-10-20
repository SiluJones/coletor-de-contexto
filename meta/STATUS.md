# STATUS.md — Estado Atual

> Arquivo **rolante**: só o AGORA. Resolvido sai para o CHANGELOG e para o log do dia.
> Médio e longo prazo vivem no ROADMAP.

---

## Versão Atual
**0.1.0** — 2026-10-17 — F1 (uma conversa do Claude → Lunoda) e a primeira leva da F2 (formatos «simples» e opções), conferidas pelo dono. Tag `v0.1.0` empurrada (wo0006, `1ffc2df`).

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
- **Nome do arquivo em outro perfil do Chrome** (relato do dono, 2026-10-20): exportando a conversa «KCM 1» num segundo perfil, os arquivos não saem com o nome da conversa. Causa não confirmada; suspeita: a extensão de downloads instalada naquele perfil (ícone azul na barra) troca o nome dos downloads. Aguardando os nomes que saíram e o nome da extensão.

## 📋 Backlog (curto prazo)
- [ ] Release v0.1.0 no GitHub: a tag existe (`1ffc2df`); falta a página da release com o `.zip`. Sem o `gh` no PC, o dono cria pela página (roteiro na conversa de 2026-10-17) ou instala o `gh` e o Code roda a Edição 4 da wo0006.

## 💬 Última conversa
**2026-10-18** — Release 0.1.0 aplicada (tag `v0.1.0`; a página da release no GitHub ficou para o dono: `gh` não instalado). Licença MIT. Segunda leva da F2 escrita (wo0007, DEC-013): copiar a conversa ou a última resposta. Próximo: o Code aplica; o dono confere os botões.
