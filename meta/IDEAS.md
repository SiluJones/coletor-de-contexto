# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Captura tudo, mesmo solto.
> Nunca perde: implementada vai para «Concluídas»; recusada vai para «Descartadas» com o motivo.

---

## 💡 Ideias Ativas — Usuário
### 2026-10 — Suporte a outras IAs (ChatGPT, Gemini…)
Além do Claude, coletar do ChatGPT, do Gemini e de outras. Viável: ChatGPT por API interna, Gemini só por DOM (mais frágil). Planejado na F3 do ROADMAP.

### 2026-10 — Capturar o pensamento da IA
Incluir o processo de pensamento quando a plataforma o expõe. Coberto por DEC-005 e DEC-008: bloco próprio «Pensamento», desligado por padrão.

### 2026-10 — Arquivos anexados e gerados
Registrar os arquivos que o usuário anexa e os que a IA gera — ou ignorá-los. Coberto por DEC-005 (referência sim, binário não).

### 2026-10 — Lunoda importar o `.md` no futuro
Hoje o Lunoda importa só `.json`. Os marcadores `<!-- CONTEUDO:INICIO/FIM -->` do MD já permitem um importador. A mudança é no Lunoda, não aqui.

---

## 🤖 Ideias Ativas — Assistente
### 2026-10-16 — Modo «continuar entrada»
Exportar só os turnos novos de uma conversa já exportada e anexá-los à entrada existente do Lunoda, preservando os IDs dos blocos antigos. Combina com o uso real: projetos longos com conversas que continuam.

### 2026-10-16 — Exportar uma pasta de Projeto do claude.ai inteira
Várias conversas num único `.json` do Lunoda (várias `entries`), disparado à mão e com intervalo entre requisições (DEC-007).

### 2026-10-16 — Ramos como versões
Exportar respostas regeneradas ou pedidos editados (ramos da árvore) em vez de só o ramo atual. Como `version` já é o número do turno (DEC-008), os ramos precisariam de outro mecanismo — por exemplo, um bloco a mais com subtítulo «Claude (alternativa 2)».

### 2026-10-16 — Copiar para a área de transferência
Além de baixar, copiar o MD (ou só a última resposta) com um clique — útil para colar num handoff.

### 2026-10-16 — Detectar o bloco de fecho do KCM
Reconhecer nas respostas o bloco «Próximo / Peça no próximo turno» e expô-lo à parte (ex.: copiar só a frase do próximo turno). Específico do fluxo do dono.

### 2026-10-16 — Firefox
O WXT gera build para Firefox a partir do mesmo código; custo baixo depois do MVP.

### 2026-10-16 — Outros formatos de saída
Markdown simples (sem os marcadores do Lunoda), Obsidian com front matter próprio, HTML. Cada um é só mais um exportador (DEC-003). **Pedido do dono (2026-10-16):** um formato «original/simples», em `.md` e `.json`. Recomendação do chat: Markdown legível (título, link, data e `## Você` / `## Claude` por turno) e JSON do CDC (o modelo canônico inteiro, com tudo que foi capturado — bom para arquivo e para reprocessar). Planejado na F2.

### 2026-10-16 — Incluir as chamadas de ferramenta (opção)
As respostas de trabalho do Claude têm centenas de `tool_use`/`tool_result` (até 696 numa captura). Hoje ficam de fora (DEC-011); uma opção poderia listá-las resumidas (nome da ferramenta + uma linha) para quem quiser o rastro completo.

---

## 🛌 Adiadas
- **Backup automático periódico** — adiada porque automação contínua de endpoint interno é a parte mais exposta a Termos de Uso e a limite de taxa (DEC-007) — **volta quando** o dono pedir explicitamente backup sem clique.
- **Baixar os binários dos arquivos (zip)** — adiada porque exige mais endpoints, permissões e tamanho (DEC-005) — **volta quando** a referência por nome não bastar num caso real.
- **Publicar na Chrome Web Store** — adiada porque o único usuário hoje é o dono; publicar pede política de privacidade e revisão — **volta quando** a F3 estiver estável e houver interesse em público externo.

---

## ✅ Concluídas
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1.
- **Preencher `p-ia` sozinho** — implementado na wo0004 (DEC-011): na entrada e nos blocos da IA, como o dono marcava à mão.
- **Link da conversa na descrição do Lunoda** (ideia do dono, 2026-10-16) — implementado na wo0004 (DEC-011).

---

## 🚫 Descartadas
- **Exportar PDF** — descartada porque o objetivo é texto reutilizável; quem quiser PDF imprime o MD.

---

## 📮 Feedback para o Kit
- **[2026-10-16]** As Instruções e o `CLAUDE.md` gerados vieram com o nome do projeto como placeholder (`[NOME]`, `<NOME DO PROJETO>`) e o README com o título «projeto», embora o Projeto do claude.ai já se chamasse «Coletor de Contexto (CDC)». O formulário de montagem poderia preencher o nome nos três.
- **[2026-10-16]** Seção «Feedback para o ASU» removida deste IDEAS: o projeto não usa o modo ASU, e seção sem uso só ocupa leitura.
- **[2026-10-16]** O pedido de abertura listava `SPEC.md` entre os arquivos a preencher, mas no kit ele é modelo. Solução adotada: modelo especializado em `meta/SPEC.md` e a spec real em `specs/`. O kit poderia dizer isso no próprio pedido de abertura.
- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório em arquivo no fim, depois do push; quando o Code PARA (divergência na Edição 0 da wo0004), ele não gravou nada e o dono teve de copiar a tela para o chat. Ajuste local: a skill e o `CLAUDE.md` dizem que a parada também gera relatório em arquivo, antes do menu. O kit poderia trazer isso de fábrica.
