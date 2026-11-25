# WO 0009 — registra o template-update do KCM v1.162.1 e versiona o que o chat gravou

> **Tipo:** WO de DOC (registro).
> **Config sugerida:** Sonnet · `/effort` baixo — edições mecânicas com âncora exata; nada de código.
> **Pré-requisito:** HEAD `35f5953` («docs: fecha a conversa de chat 1»), sem commit novo por cima. `git status --short`
> mostra SÓ os 11 `M` e os 3 `??` da Edição 0 (contando esta WO) e mais nada.
> **Base:** conversa de chat 2 (2026-11-25): inventário do pacote `CDC/261124-kcm-update-dev-v1.162.1/` e aprovação do dono
> («Plano aprovado como recomendado, (b)1 a (b)4 pelo pacote»; não regerar o pacote).
> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1 medido ao gravar):
> - `.claude/skills/apply-wo/SKILL.md` — `c7fa33b4651ada4fe6bc8e24ed06b4387786f0fc`
> - `.claude/skills/wrap/SKILL.md` — `dc0c81ef2af41f5c1e9564113b2cfdf901462511`
> - `.claude/skills/sondar/SKILL.md` — `76672c234e32ac4b42c474af929199f3fce8ab51`
> - `.claude/settings.json` — `77755d2ff2e67ea115d1a29a4fb732613e2fc41a`
> - `.gitignore` — `7a55a60f422610b8ac6cfafcd6ee13992769de7d`
> - `CLAUDE.md` — `4645a21220dc11169e5f7553f6ec3b0361cc6a9f`
> - `INSTRUCOES-DO-PROJETO.md` — `a95ca573519bf9c5b1693d806e7723038975ab54`
> - `meta/CEREBRO.md` — `b0b65707101577f0be5005fed6a96828f0a790f9`
> - `meta/CONTEXT.md` — `2e0852cc8bd753be1967999f2cf27f6541cbf6be`
> - `meta/GUIA-DO-KIT.md` (novo) — `0812c3b29e6cb75e3b1bd5cde7d2c51cfafe7a4d`
> - `meta/LOG-TEMPLATE.md` — `c9341b2df2f9d0872b0cbe7db3e48c648440061a`
> - `meta/workorders/_TEMPLATE.md` — `5432110b490ef0ba44f644f3363594b72f4c306d`
> - `logs/2026-11-25.md` (novo) — `4c1e92601047e172b4116d1e744331a8df7f1d93`
>
> A Edição 0 roda `sha1sum` em cada um ANTES de tudo: hash diferente = outro escritor mexeu depois do chat — **PARE e reporte**.
> **Âncora semântica:** se um trecho-âncora não bater EXATAMENTE, **PARE e reporte** — nunca chute um lugar próximo.
> **Idempotência:** antes de cada edição, procure o texto NOVO INTEIRO; se ele já está no arquivo e a âncora não, PULE e diga no relatório.
> **Âncoras lidas em:** 2026-11-25, HEAD `35f5953`, pelo chat, neste turno:
> - Ed.1 `meta/DECISIONS.md`, cabeçalho: «> Toda entrada traz `**Status:**` com valor fechado: aceita · substituída por X · resolvida · aberta.»
> - Ed.2 `meta/DECISIONS.md`, fim da DEC-013 (última linha do arquivo): «Nenhum exportador muda. A busca da conversa roda a cada cópia, como no «Exportar» (DEC-007: só sob demanda).»
> - Ed.3 `meta/IDEAS.md`, último item de «📮 Feedback para o Kit» (última linha do arquivo): «- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório…»
> - Ed.4a–4d `meta/STATUS.md`: linhas «- Estrutura do repositório (KCM v1.124.0)…», «- **Template-update do KCM v1.162.1:** pacote em…», «- [ ] Aplicar o template-update do KCM v1.162.1…», «**2026-11-24** — Conversa de chat 1…».
> - Ed.5 `meta/CHANGELOG.md`, «[Não lançado]»: «- Licença MIT (`LICENSE`) e seção no README.»
> **Próximo comando:** (nenhum — o passo seguinte é do dono no painel do Projeto, entregue pelo chat).

> **Canal dos meta neste ciclo = CODE** para DECISIONS, IDEAS, STATUS e CHANGELOG (esta WO é o registro). Os demais arquivos
> da lista acima o chat já gravou: aqui eles só entram no `git add`. Arquivo sob `.claude/`: o Code NÃO edita, só versiona.

---

## 1. Por que

O projeto estava no kit v1.124.0. O pacote v1.162.1 foi fundido pelo chat (CEREBRO e Instruções a partir do pacote, com o
conteúdo do projeto transplantado; GUIA-DO-KIT novo; skills e molde de WO do kit; permissões do Code). Falta registrar a
decisão, o feedback ao kit e o estado, e versionar tudo num commit.

## 2. Contexto factual

- **[medido]** Pacote `261124-kcm-update-dev-v1.162.1/`: Kit v1.162.1, modos Code sim · ASU não · compartilhado não; perfil com todos os campos vazios e sistema operacional «(nao informado)» (`_UPDATE-MANIFEST.md`, «Perfil com que o pacote foi gerado»).
- **[medido]** CEREBRO e Instruções do pacote não citam Windows nem CMD (`grep -oi windows` = 0 nos dois).
- **[medido]** Em 2026-10-16 o IDEAS já registrou o nome do projeto chegando como placeholder do kit (`[NOME]`); o painel do Projeto ainda mostra `# Projeto: [NOME]`.
- **[relatado pelo dono, 2026-11-25]** Ele abre o Claude Code pelo PowerShell (no CMD o Code não funciona direito, causa desconhecida) e cola os comandos dele no CMD; não vai regerar o pacote por isso.
- **[medido]** Depois da fusão: os 6 carimbos (`CEREBRO`, `GUIA-DO-KIT`, 3 skills, `_TEMPLATE`) dizem v1.162.1; `INSTRUCOES-DO-PROJETO.md` = 5670 caracteres (`LC_ALL=C.UTF-8 wc -m`).

---

## Edição 0 — conferência, sem editar

Rode e relate a saída crua:

```
git log -1 --oneline
git status --short
sha1sum .claude/skills/apply-wo/SKILL.md .claude/skills/wrap/SKILL.md .claude/skills/sondar/SKILL.md .claude/settings.json .gitignore CLAUDE.md INSTRUCOES-DO-PROJETO.md meta/CEREBRO.md meta/CONTEXT.md meta/GUIA-DO-KIT.md meta/LOG-TEMPLATE.md meta/workorders/_TEMPLATE.md logs/2026-11-25.md
```

Esperado: HEAD `35f5953`; `git status` com exatamente 11 `M` — `CLAUDE.md`, `INSTRUCOES-DO-PROJETO.md`, `.gitignore`, `.claude/settings.json`, as 3 skills, `meta/CEREBRO.md`, `meta/CONTEXT.md`, `meta/LOG-TEMPLATE.md`, `meta/workorders/_TEMPLATE.md` — e 3 `??` (`logs/2026-11-25.md`, `meta/GUIA-DO-KIT.md`, esta WO). Os 13 hashes iguais aos do cabeçalho. Qualquer divergência: PARE.

---

## Edição 1 — `meta/DECISIONS.md` · valor de Status novo

**Âncora** (cabeçalho, linha inteira):

````
> Toda entrada traz `**Status:**` com valor fechado: aceita · substituída por X · resolvida · aberta.
````

**Substituir por:**

````
> Toda entrada traz `**Status:**` com valor fechado: aceita · aceita — emendada por DEC-X · substituída por X · resolvida · aberta.
````

## Edição 2 — `meta/DECISIONS.md` · DEC-014 no fim

**Âncora** (última linha da DEC-013, linha inteira):

````
Nenhum exportador muda. A busca da conversa roda a cada cópia, como no «Exportar» (DEC-007: só sob demanda).
````

**Substituir por:**

````
Nenhum exportador muda. A busca da conversa roda a cada cópia, como no «Exportar» (DEC-007: só sob demanda).

---

## DEC-014 — Template-update do KCM v1.124.0 → v1.162.1 com o perfil transplantado
**Data:** 2026-11-25 · **Status:** aceita

### Contexto
O pacote `261124-kcm-update-dev-v1.162.1` foi gerado com o perfil vazio: nome vazio e sistema operacional «não informado». Com isso o CEREBRO e as Instruções do pacote saem sem a seção «Ambiente», sem a linha do CMD e sem o nome. O manifesto manda tratar campo de perfil diferente como pergunta ao dono antes de fundir, e diz que o remédio é regerar o pacote — a regra existe para impedir que um pacote feito com o formulário de outro projeto copie o perfil errado. O chat aplicou a regra ao pé da letra (vazio lido como diferente) e perguntou «regerar ou transplantar», recomendando regerar. O dono recusou regerar por um campo vazio — é a segunda vez que o perfil chega vazio (o nome já viera como placeholder em 2026-10-16) — e corrigiu o perfil: abre o Claude Code pelo PowerShell (no CMD o Code não funciona direito, causa desconhecida) e cola os comandos dele no CMD [relatado pelo dono].

### Decisão
- Fusão a partir do pacote (CEREBRO e Instruções), com transplante marcado do que é deste projeto: os 4 itens de «Técnicas específicas deste projeto»; a seção «Ambiente (sistema operacional)», agora com CMD (comandos do dono) e PowerShell (onde ele abre o Code); o aviso de sistema operacional em «Commit pronto ao final»; o título e a linha do Windows nas Instruções.
- Duas regras locais novas em «Técnicas específicas»: (1) campo de perfil VAZIO no pacote e já declarado aqui = transplante sem pergunta; só campo PREENCHIDO com valor diferente é pergunta; (2) os insumos permanentes da pasta-pai são `oraculo-lunoda/`, `capturas-claude/cdc-raw/` e `exportacoes-cdc/<AAMMDD-HHMM>/` — desvio da convenção `material/` do kit; `exportacoes-cdc/` é dado de teste do produto, não a «pasta de histórico das conversas» do kit, e o chat arquiva nela movendo.
- Os choques do inventário foram resolvidos pelo pacote: o bloco de commit é da WO quando houver WO; a config sai sempre, por raia; skill muda por WO e o `settings.json` o chat grava inteiro e confere; a pasta-pai segue o desvio acima.
- Entram inteiros do pacote: `meta/GUIA-DO-KIT.md` (novo), as skills `apply-wo`/`wrap`/`sondar` e `meta/workorders/_TEMPLATE.md`. `settings.json` ganha `git show`, `git cat-file`, `wc`, `grep`, `head`; `.gitignore` ganha `.claude/settings.local.json`; `CLAUDE.md` ganha a seção «Auditoria das instruções» e a linha do terminal do dono, e perde a linha «Parou…» (a skill nova grava o relatório também na parada); CONTEXT ganha «Build e validação»; LOG-TEMPLATE ganha «Entregas».

### Alternativas consideradas
- **Regerar o pacote com nome e SO** — recusada pelo dono: regerar por campo vazio é custo recorrente, e o projeto já declara o perfil.
- **Fundir sem o transplante** — apagaria o perfil e as técnicas que este projeto aprendeu.
- **Ficar no kit v1.124.0** — perderia as correções (relatório na parada, idempotência das WOs, contagem de caracteres com locale) e o GUIA.

### Consequências
Os 6 carimbos do kit dizem v1.162.1. O perfil vive no CEREBRO e nas Instruções como transplante marcado, e o próximo update o transplanta de novo sem perguntar. As Instruções novas só valem para o chat depois que o dono as colar no painel do Projeto. Feedback ao kit no IDEAS.
````

## Edição 3 — `meta/IDEAS.md` · feedback ao kit + marcador de fim

**Âncora** (último item de «📮 Feedback para o Kit», linha inteira):

````
- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório em arquivo no fim, depois do push; quando o Code PARA (divergência na Edição 0 da wo0004), ele não gravou nada e o dono teve de copiar a tela para o chat. Ajuste local: a skill e o `CLAUDE.md` dizem que a parada também gera relatório em arquivo, antes do menu. O kit poderia trazer isso de fábrica.
````

**Substituir por:**

````
- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório em arquivo no fim, depois do push; quando o Code PARA (divergência na Edição 0 da wo0004), ele não gravou nada e o dono teve de copiar a tela para o chat. Ajuste local: a skill e o `CLAUDE.md` dizem que a parada também gera relatório em arquivo, antes do menu. O kit poderia trazer isso de fábrica. **[2026-11-25] Absorvido no kit v1.162.1** (skill `apply-wo`, «A parada também grava o relatório em arquivo»); a linha local saiu do `CLAUDE.md` (DEC-014).
- **[2026-11-25]** **Pacote de update com o perfil vazio, de novo — e a regra do manifesto transforma isso em pedido de regerar.** O pacote v1.162.1 veio com todos os campos de perfil vazios e o SO «não informado»; em 2026-10-16 o nome já viera como placeholder. O manifesto trata campo vazio como «diferente», manda perguntar antes de fundir e nomeia «regerar o pacote» como remédio; o assistente seguiu isso e custou um turno ao dono, que não vai regerar pacote por qualquer coisa. Propostas ao kit: (1) a regra separar **vazio** (ausência: transplanta-se o valor vivo, marcado, sem pergunta) de **preenchido com valor diferente** (aí sim pergunta); (2) o texto que depende do perfil (seção «Ambiente», linha do SO nas Instruções, aviso no commit) vir em bloco marcado e transplantável, para o merge se adaptar sem regerar; (3) o gerador de pacote ler o perfil do projeto que vai atualizar, ou avisar na tela que o perfil está vazio antes de baixar. Adaptação local: DEC-014 e «Técnicas específicas deste projeto» no CEREBRO.
- **[2026-11-25]** **Sistema operacional com um terminal só não descreve este dono.** Ele cola os comandos no CMD, mas abre o Claude Code pelo PowerShell (no CMD o Code não funciona direito). O formulário poderia separar «terminal onde o dono cola comandos» de «terminal onde ele abre o Claude Code». Adaptação local: seção «Ambiente» do CEREBRO e linha do `CLAUDE.md`.

---

> **Fim do IDEAS.** Acréscimo entra sob o título da seção certa, nunca aqui embaixo: o fim do arquivo é a seção de feedback, e o que cai nela se perde do lugar dele.
````

## Edição 4a — `meta/STATUS.md` · versão do kit

**Âncora** (linha inteira):

````
- Estrutura do repositório (KCM v1.124.0) com os `meta/` preenchidos para este projeto.
````

**Substituir por:**

````
- Estrutura do repositório (KCM v1.162.1, desde 2026-11-25 — DEC-014) com os `meta/` preenchidos para este projeto.
````

## Edição 4b — `meta/STATUS.md` · Em Progresso

**Âncora** (linha inteira):

````
- **Template-update do KCM v1.162.1:** pacote em `CDC/261124-kcm-update-dev-v1.162.1/` (pasta-pai), ainda não aplicado; o projeto está no kit v1.124.0. Roteiro no `_UPDATE-PROMPT.md` do pacote.
````

**Substituir por:**

````
- **Instruções do Projeto:** o `INSTRUCOES-DO-PROJETO.md` fundido no kit v1.162.1 (wo0009) ainda não foi colado pelo dono no painel do Projeto; até lá o chat lê o texto antigo. Depois de colar, a pasta do pacote `CDC/261124-kcm-update-dev-v1.162.1/` vai para `notas-arquivadas/`.
````

## Edição 4c — `meta/STATUS.md` · tira o item do backlog

**Âncora** (linha inteira):

````
- [ ] Aplicar o template-update do KCM v1.162.1 (primeira tarefa do próximo chat; pede o texto do painel de Instruções colado pelo dono).
````

**Remover a linha inteira** (o resto do Backlog fica como está).

## Edição 4d — `meta/STATUS.md` · Última conversa

**Âncora** (linha inteira):

````
**2026-11-24** — Conversa de chat 1 (iniciada em 2026-10-16) encerrada por tamanho: F1, F2 (formatos, opções, copiar), release 0.1.0, transferência para `SiluJones` e mudança para `Arquiteturas`. Brief de arranque em `CDC/261124-HANDOFF-BRIEF.md` (pasta-pai). Próximo: template-update do KCM v1.162.1.
````

**Substituir por:**

````
**2026-11-25** — Conversa de chat 2: template-update do KCM v1.124.0 → v1.162.1 (DEC-014), com o perfil transplantado em vez de regerar o pacote; wo0009 registra. Próximo: o dono cola as Instruções no painel; depois, release v0.1.0 no GitHub ou as exportações de outros projetos (Backlog).
````

## Edição 5 — `meta/CHANGELOG.md` · «Não lançado»

**Âncora** (linha inteira):

````
- Licença MIT (`LICENSE`) e seção no README.
````

**Substituir por:**

````
- Licença MIT (`LICENSE`) e seção no README.

### Modificado
- Kit de contexto (KCM) atualizado de v1.124.0 para v1.162.1: CEREBRO e Instruções fundidos com o perfil do projeto transplantado, `meta/GUIA-DO-KIT.md` novo, skills `apply-wo`/`wrap`/`sondar` e molde de WO do kit, permissões do Code ampliadas (DEC-014). Nada muda na extensão.
````

---

## Fora de escopo

- Não edite nenhum arquivo da lista do cabeçalho (são do chat); não toque em `src/`.
- Não mova a pasta do pacote: isso espera o dono colar as Instruções no painel.
- `/doctor prompt-audit` (seção nova do `CLAUDE.md`) não roda nesta WO.

## Armadilhas desta WO

- Arquivos sob `.claude/` só entram no `git add`; editar ali é bloqueado para o Code, e não há edição a fazer.
- A Ed.3 e a Ed.2 caem na última linha do arquivo: o arquivo tem de terminar com quebra de linha depois do texto novo, como antes.

---

## Depois de aplicar — conferência antes do commit

- [ ] `git diff --stat` mostra 15 arquivos modificados: os 11 do chat + `meta/DECISIONS.md`, `meta/IDEAS.md`, `meta/STATUS.md`, `meta/CHANGELOG.md`; e `git status --short` mostra os 3 `??` (log, GUIA, esta WO) e nada além.
- [ ] `grep -c "^## DEC-014" meta/DECISIONS.md` → **1** (linha).
- [ ] `grep -c "^- \*\*\[2026-11-25\]" meta/IDEAS.md` → **2** (linhas; o item absorvido começa com `[2026-10-17]` e não conta).
- [ ] `grep -c "^> \*\*Fim do IDEAS.\*\*" meta/IDEAS.md` → **1**.
- [ ] `grep -c "^- \[ \] Aplicar o template-update" meta/STATUS.md` → **0** (negativo, ancorado em `^`).
- [ ] `grep -c "^### Modificado" meta/CHANGELOG.md` → **1**.
- [ ] Carimbos (lista explícita: esta WO cita as duas frases, e varrer `meta/` a contaria): `grep -l "Gerado pelo Kit de Contexto Universal v1.162.1" meta/CEREBRO.md meta/GUIA-DO-KIT.md meta/workorders/_TEMPLATE.md .claude/skills/apply-wo/SKILL.md .claude/skills/wrap/SKILL.md .claude/skills/sondar/SKILL.md | wc -l` → **6**; `grep -l "Gerado pelo Kit de Contexto Universal v1.124" meta/CEREBRO.md meta/GUIA-DO-KIT.md meta/workorders/_TEMPLATE.md .claude/skills/apply-wo/SKILL.md .claude/skills/wrap/SKILL.md .claude/skills/sondar/SKILL.md | wc -l` → **0**.
- [ ] `LC_ALL=C.UTF-8 wc -m INSTRUCOES-DO-PROJETO.md` → **5670** (teto do projeto: 7600 com o Modo Code).
- [ ] **WO só de doc:** sem build; a rede é o `git diff`. Nenhuma das conferências acima abre o CONTEÚDO dos arquivos do chat: elas respondem «está lá?», não «presta?» — essa leitura foi do chat ao fundir.
- [ ] Nada criado fora do repositório além do relatório.

## Relatório de aplicação *(quem aplica preenche ao terminar)*

Grave em `../AAMMDD-HHMM-code-cdc-apply-wo0009.txt` (o `AAMMDD-HHMM` de `date +%y%m%d-%H%M`), pela ferramenta de escrita de arquivo.

## Commit — blocos separados, mensagem SEM acento

```
git add .claude/skills/apply-wo/SKILL.md .claude/skills/wrap/SKILL.md .claude/skills/sondar/SKILL.md .claude/settings.json .gitignore CLAUDE.md INSTRUCOES-DO-PROJETO.md meta/CEREBRO.md meta/CONTEXT.md meta/GUIA-DO-KIT.md meta/LOG-TEMPLATE.md meta/workorders/_TEMPLATE.md logs/2026-11-25.md meta/DECISIONS.md meta/IDEAS.md meta/STATUS.md meta/CHANGELOG.md meta/workorders/261125-wo0009-template-update-kcm-v1-162-1.md
```

```
git commit -m "docs(kcm): atualiza o kit de contexto para v1.162.1" -m "Funde CEREBRO e Instrucoes a partir do pacote com o perfil do projeto transplantado (DEC-014): CMD para os comandos do dono, PowerShell para abrir o Code. GUIA-DO-KIT novo, skills e molde de WO do kit, permissoes do Code ampliadas. Registra feedback ao kit sobre o perfil vazio. Aplica a wo0009."
```

```
git push
```
