# WO 0010 — registra a release v0.1.0 publicada e fecha os itens do template-update no STATUS

> **Tipo:** WO de DOC (registro).
> **Config sugerida:** Sonnet · `/effort` baixo — quatro edições de uma linha no STATUS; nada de código.
> **Pré-requisito:** HEAD `ce6a668` («docs(kcm): atualiza o kit de contexto para v1.162.1»). `git status --short` mostra
> exatamente: ` M README.md`, ` M logs/2026-11-25.md`, `?? logs/2026-11-26.md`, `?? meta/workorders/261126-wo0010-release-v0-1-0-publicada.md` — e nada além.
> **Base:** conversa de chat 2 (2026-11-25/26): release publicada pelo dono pela página do GitHub.
> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1 medido ao gravar):
> - `README.md` — `13dcbac6bc75846ad0ca9cf76d48b2f99a7b98fb`
> - `logs/2026-11-25.md` — `0fb4aed82582af452a3b3b04a4d7efd2f22d3c34`
> - `logs/2026-11-26.md` (novo) — `2811757f2b24b118a818ebcf9d5e6e6d7366326a`
>
> A Edição 0 roda `sha1sum` nos três ANTES de tudo: hash diferente = **PARE e reporte**.
> **Âncora semântica:** se um trecho-âncora não bater EXATAMENTE, **PARE e reporte**.
> **Idempotência:** antes de cada edição, procure o texto NOVO INTEIRO; se ele já está no arquivo e a âncora não, PULE e diga no relatório.
> **Âncoras lidas em:** 2026-11-26, HEAD `ce6a668`, pelo chat, neste turno — todas em `meta/STATUS.md`:
> - Ed.1 «✅ Funcionando»: «- Licença MIT (`LICENSE`).»
> - Ed.2 «🔧 Em Progresso»: «- **Instruções do Projeto:** o `INSTRUCOES-DO-PROJETO.md` fundido no kit v1.162.1 (wo0009)…»
> - Ed.3 «📋 Backlog»: «- [ ] Release v0.1.0 no GitHub: a tag existe (`1ffc2df`)…»
> - Ed.4 «💬 Última conversa»: «**2026-11-25** — Conversa de chat 2: template-update do KCM…»
> **Próximo comando:** (nenhum).

> **Canal dos meta neste ciclo = CODE** para o STATUS (esta WO é o registro). `README.md` e os dois logs o chat já gravou: só entram no `git add`.

---

## 1. Por que

A release v0.1.0 foi publicada pelo dono, e o dono colou as Instruções novas no painel; o STATUS ainda dá os dois como pendentes.

## 2. Contexto factual

- **[relatado pelo dono, 2026-11-26]** «Release v0.1.0 publicada no GitHub com o .zip».
- **[medido: capturas de tela do dono, 2026-11-26 09:15–09:18]** Antes não havia release nenhuma; o formulário usou a tag existente `v0.1.0`, o título «v0.1.0 — primeira versão usável» e o anexo `coletor-de-contexto-0.1.0-chrome.zip` (0.01 MB).
- **[medido, 2026-11-25]** O painel do Projeto passou a mostrar as Instruções do kit v1.162.1 (título «Coletor de Contexto (CDC)»); o pacote foi movido para `notas-arquivadas/`.

---

## Edição 0 — conferência, sem editar

```
git log -1 --oneline
git status --short
sha1sum README.md logs/2026-11-25.md logs/2026-11-26.md
```

Esperado: HEAD `ce6a668`; o `git status` do pré-requisito; os 3 hashes iguais aos do cabeçalho. Divergência: PARE.

## Edição 1 — `meta/STATUS.md` · release em «Funcionando»

**Âncora** (linha inteira):

````
- Licença MIT (`LICENSE`).
````

**Substituir por:**

````
- Licença MIT (`LICENSE`).
- Release v0.1.0 no GitHub, com o `coletor-de-contexto-0.1.0-chrome.zip` anexado — publicada pelo dono em 2026-11-26 pela página de releases.
````

## Edição 2 — `meta/STATUS.md` · tira as Instruções de «Em Progresso»

**Âncora** (linha inteira):

````
- **Instruções do Projeto:** o `INSTRUCOES-DO-PROJETO.md` fundido no kit v1.162.1 (wo0009) ainda não foi colado pelo dono no painel do Projeto; até lá o chat lê o texto antigo. Depois de colar, a pasta do pacote `CDC/261124-kcm-update-dev-v1.162.1/` vai para `notas-arquivadas/`.
````

**Remover a linha inteira.**

## Edição 3 — `meta/STATUS.md` · tira a release do Backlog

**Âncora** (linha inteira):

````
- [ ] Release v0.1.0 no GitHub: a tag existe (`1ffc2df`); a página da release com o `.zip` não foi confirmada [relatado pelo dono: «pendente, eu acho»]. Sem o `gh` no PC, o dono cria pela página ou instala o `gh` e o Code roda a Edição 4 da wo0006.
````

**Remover a linha inteira.**

## Edição 4 — `meta/STATUS.md` · Última conversa

**Âncora** (linha inteira):

````
**2026-11-25** — Conversa de chat 2: template-update do KCM v1.124.0 → v1.162.1 (DEC-014), com o perfil transplantado em vez de regerar o pacote; wo0009 registra. Próximo: o dono cola as Instruções no painel; depois, release v0.1.0 no GitHub ou as exportações de outros projetos (Backlog).
````

**Substituir por:**

````
**2026-11-26** — Conversa de chat 2: template-update do KCM v1.162.1 fechado (DEC-014, Instruções coladas no painel) e release v0.1.0 publicada no GitHub (wo0010). Próximo: as exportações de outros projetos (Backlog), quando o dono conceder as pastas.
````

---

## Fora de escopo

- Não edite `README.md` nem os logs (são do chat). Não toque em `src/`, CHANGELOG, DECISIONS ou IDEAS.

---

## Depois de aplicar — conferência antes do commit

- [ ] `git diff --stat` mostra `README.md`, `logs/2026-11-25.md` e `meta/STATUS.md`; `git status --short` mostra só os 2 `??` (o log de hoje e esta WO).
- [ ] `grep -c "^- Release v0.1.0 no GitHub, com o" meta/STATUS.md` → **1**.
- [ ] `grep -c "^- \*\*Instruções do Projeto:\*\*" meta/STATUS.md` → **0** (negativo, em `^`).
- [ ] `grep -c "^- \[ \] Release v0.1.0" meta/STATUS.md` → **0** (negativo, em `^`).
- [ ] `grep -c "^\*\*2026-11-26\*\*" meta/STATUS.md` → **1**.
- [ ] **WO só de doc:** sem build; a rede é o `git diff`. As conferências respondem «está lá?»; o conteúdo dos arquivos do chat foi lido pelo chat.

## Relatório de aplicação *(quem aplica preenche ao terminar)*

Grave em `../AAMMDD-HHMM-code-cdc-apply-wo0010.txt` (`date +%y%m%d-%H%M`), pela ferramenta de escrita de arquivo.

## Commit — blocos separados, mensagem SEM acento

```
git add README.md logs/2026-11-25.md logs/2026-11-26.md meta/STATUS.md meta/workorders/261126-wo0010-release-v0-1-0-publicada.md
```

```
git commit -m "docs: registra a release v0.1.0 publicada no GitHub" -m "STATUS sem os itens da release e das Instrucoes; README cita o kit v1.162.1; logs de 25 e 26/11. Aplica a wo0010."
```

```
git push
```
