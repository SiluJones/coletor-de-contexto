# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

## [Não lançado]
### Modificado
- Página «Reprocessar»: a página inteira recebe o arquivo arrastado, não só a caixa pontilhada (pedido do dono, 2026-11-27).

## [0.2.0] — 2026-11-27
Guardar sem perder nada: a resposta bruta vira formato do «Exportar», e o «Reprocessar» gera os outros formatos dela depois. Também «Copiar» e a licença MIT.

### Adicionado
- «Copiar conversa» (Markdown simples, com as opções) e «Copiar última resposta» (texto cru da IA) no popup (wo0007, DEC-013); conferidos pelo dono em 2026-10-19.
- Licença MIT (`LICENSE`) e seção no README.
- Formato «Resposta bruta» no «Exportar»: a resposta da API como veio, em `cdc-raw/`, salva antes de normalizar — o único formato sem perda (wo0011, DEC-015).
- «Reprocessar arquivos guardados…»: página da extensão que gera os formatos a partir de respostas brutas ou JSONs do CDC já guardados, em `Downloads/cdc-reprocessado/<AAMMDD-HHMM>/` (DEC-017).

### Modificado
- Kit de contexto (KCM) atualizado de v1.124.0 para v1.162.1: CEREBRO e Instruções fundidos com o perfil do projeto transplantado, `meta/GUIA-DO-KIT.md` novo, skills `apply-wo`/`wrap`/`sondar` e molde de WO do kit, permissões do Code ampliadas (DEC-014). Nada muda na extensão.
- Padrão de primeiro uso do popup: Markdown simples + resposta bruta (antes: só Lunoda) (DEC-015).
- Kit de contexto atualizado de v1.162.1 para v1.169.0, com o método C: o chat grava, o dono versiona pelo bloco, a WO só quando se paga (DEC-016). Nada muda na extensão.
- Teste das capturas reais aceita resposta da IA sem texto quando há pensamento ou arquivo; reprova a conversa sem nenhum texto da IA.

### Removido
- Botão «Salvar resposta bruta (depuração)»: virou a caixa «Resposta bruta» (DEC-015).

## [0.1.0] — 2026-10-17
Primeira versão usável: F1 (uma conversa do Claude → Lunoda) e a primeira leva da F2 (formatos «simples» e opções).

### Adicionado
- **Exportar** a conversa aberta no claude.ai com um clique no popup, nos formatos marcados (DEC-011, DEC-012):
  - **Lunoda** — `<título>.json` (importável) e `<título>.md`, no layout do Lunoda; link da conversa na descrição e «IA Utilizada» marcada na entrada e nos blocos da IA.
  - **Markdown simples** — `<título> (simples).md`, para ler: `## Você · N` / `## Claude · N` por turno.
  - **JSON do CDC** — `<título>.cdc.json`, a conversa normalizada inteira, para guardar e reprocessar.
- Opções **pensamento** (resumos, em bloco próprio — DEC-008) e **lista de arquivos** anexados e gerados (por referência, nunca o binário — DEC-005), lembradas entre usos. Primeiro uso: só Lunoda, sem pensamento, com arquivos.
- Normalizador do Claude sobre o formato medido em capturas reais: só o ramo atual, texto de `content[]`, respostas seguidas unidas, mensagens vazias fora (DEC-011).
- Botão de depuração «Salvar resposta bruta» para capturar o formato real da API (DEC-010).
- Permissões mínimas: `activeTab`, `scripting`, `downloads`, `storage`; nenhuma permissão de site permanente (DEC-007, DEC-010).
- Base de desenvolvimento: WXT 0.21 + TypeScript 6.0 + Vitest 5, ESLint e Prettier; `npm run check` com 90 testes; par sintético versionado e oráculo privado do Lunoda e capturas reais fora do repositório (DEC-009).
- Documentação de contexto do KCM v1.124.0 (`meta/`, `specs/`, `logs/`, `CLAUDE.md`, `.claude/`), DEC-001 a DEC-012.

### Conferido
- O Lunoda importou exportações reais (com e sem pensamento) e as devolveu iguais — só o título e o `updatedAt` mudam.
