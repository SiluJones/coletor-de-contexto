# ROADMAP.md — Plano Intencional de Evolução

> Fases com objetivo e critério de conclusão. Estados: 🟢 concluída · 🟡 em curso/próxima · 🔵 futura · 🚫 descartada.
> Tarefas soltas ficam no STATUS; ideias, no IDEAS.

---

## 🟢 F0 — Fundação *(concluída)*
**Objetivo:** ideia desenvolvida, decisões tomadas, contexto documentado, repositório criado.
**Critério de conclusão:** primeiro commit no repositório com os `meta/` preenchidos.
- [x] Documentação de contexto e DEC-001 a DEC-007 (2026-10-16).
- [x] Spec do MVP.
- [x] `git init` + primeiro commit (`52538ff`).

## 🟡 F1 — MVP: uma conversa do Claude → Lunoda *(em curso)*
**Objetivo:** com uma conversa aberta no claude.ai, um clique baixa `.json` (importável no Lunoda) e `.md`.
**Critério de conclusão:** critérios de aceite de `specs/261016-mvp-exportar-conversa-claude.md` todos verdes, incluindo o teste de ouro do MD e a importação manual no Lunoda.
- [x] Scaffold WXT + TypeScript + Vitest + ESLint/Prettier (wo0001).
- [x] Modelo canônico (`core/model.ts`), geração de IDs e datas (wo0001).
- [x] Captura bruta da conversa do Claude, para medir o formato real (wo0003).
- [x] Adaptador Claude via API interna, só o ramo atual (wo0004).
- [x] Exportadores Lunoda JSON e Lunoda MD (wo0002).
- [x] Popup: detectar conversa, botão exportar, mensagens de erro claras (wo0004; falta a conferência do dono).

## 🔵 F2 — Fidelidade e opções
**Objetivo:** controlar o que entra no arquivo.
- Opções de pensamento e arquivos (DEC-005), lembradas entre usos.
- Conteúdo textual de artefatos gerados.
- Nome de arquivo configurável, copiar para a área de transferência (`p-ia` automático entrou na F1, DEC-011). Formatos «simples» pedidos pelo dono: Markdown legível e JSON do CDC, escolhidos no popup.

## 🔵 F3 — Outras plataformas
**Objetivo:** ChatGPT (API interna) e Gemini (DOM) produzindo o mesmo modelo canônico.
- Cada adaptador com fixture e teste próprios.

## 🔵 F4 — Lote e continuidade
**Objetivo:** várias conversas por vez e continuação de entradas já exportadas.
- Exportar uma pasta de Projeto do claude.ai; modo «continuar entrada»; intervalo entre requisições.

---

## 🚫 Itens descartados desta visão
- **Backup automático em segundo plano** — fora do escopo atual por Termos de Uso e limite de taxa (DEC-007); vive como ideia adiada no IDEAS.
