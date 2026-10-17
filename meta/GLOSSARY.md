# GLOSSARY.md — Termos do Projeto

> Só o que não é óbvio para alguém de fora.

---

## Conceitos do projeto
- **CDC** — Coletor de Contexto, este projeto.
- **Lunoda** — aplicação do dono para guardar e organizar textos em entradas e blocos; importa `.json`. É o destino principal das exportações.
- **Entrada (entry)** — no Lunoda, uma conversa exportada: título, propriedades e lista de blocos.
- **Bloco (block)** — no Lunoda, uma mensagem: `subtitle` + `version` + `content`.
- **Subtítulo** — rótulo do bloco: `Prompt` (pedido do usuário) ou o nome da IA (`Claude`, `ChatGPT`, `Gemini`).
- **Versão** — no Lunoda, hoje usada como número do turno (Prompt v1, Claude v1…). Significado a confirmar (STATUS).
- **Turno** — um pedido do usuário mais a resposta da IA a ele.
- **Pensamento (thinking)** — raciocínio que a IA mostra antes da resposta; no Claude vem como item `thinking` do `content`.
- **Ramo / folha atual** — a conversa é uma árvore (editar um pedido ou regenerar uma resposta cria um ramo); a folha atual é a última mensagem do ramo que está na tela.
- **Oráculo do Lunoda** — par `.json` + `.md` exportado PELO Lunoda, guardado fora do repositório (é conteúdo real); o teste lê a pasta de `CDC_LUNODA_ORACLE_DIR` e exige reprodução byte a byte. O primeiro é o `mapsmith 12` (DEC-009).
- **Par sintético** — `src/tests/fixtures/lunoda/sintetico.*`, gerado pelo código a partir de uma conversa inventada; protege contra regressão, não prova fidelidade ao Lunoda.

## Arquiteturas / módulos
- **Adaptador (adapter)** — código de uma plataforma que lê a conversa (API interna ou DOM) e devolve o modelo canônico.
- **Modelo canônico** — `Conversation`/`Turn`/`Message`/`FileRef`; único contrato entre adaptadores e exportadores (DEC-003).
- **Exportador (exporter)** — transforma o modelo canônico num formato de saída (Lunoda JSON, Lunoda MD).
- **WXT** — framework de extensões de navegador usado no projeto (DEC-006).

## Comandos / artefatos
- **WO** — work order: instrução de aplicação que o chat escreve e o Claude Code aplica (`meta/workorders/AAMMDD-woNNNN-desc.md`, comando `/apply-wo`).
- **Spec** — o que construir e quando está pronto (`specs/AAMMDD-nome.md`).
- **KCM** — Kit de Contexto Universal, que gerou a estrutura `meta/` e o `.claude/`.
- **FlatDrop** — ferramenta do dono que achata o repositório para subir ao Projeto do claude.ai; respeita o `.flatdropignore`.

## Identificadores
- **ID Lunoda** — 12 caracteres: `Date.now()` em base36 (8) + 4 aleatórios em base36. Ex.: `mtke7wavx3ge`.
- **`p-tags` / `p-ia`** — IDs das propriedades padrão do Lunoda (Tags; IA Utilizada). Opções `o1`–`o3` (Ideia, Pesquisa, Geral) e `o4`–`o6` (Claude, Gemini, ChatGPT).
- **DEC-N / FIX-N** — entradas do DECISIONS.
