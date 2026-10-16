# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Captura tudo, mesmo solto.
> Nunca perde: implementada vai para «Concluídas»; recusada vai para «Descartadas» com o motivo.

---

## 💡 Ideias Ativas — Usuário
### 2026-10 — Suporte a outras IAs (ChatGPT, Gemini…)
Além do Claude, coletar do ChatGPT, do Gemini e de outras. Viável: ChatGPT por API interna, Gemini só por DOM (mais frágil). Planejado na F3 do ROADMAP.

### 2026-10 — Capturar o pensamento da IA
Incluir o processo de pensamento quando a plataforma o expõe. Coberto por DEC-005; falta decidir padrão e posição no Lunoda (STATUS).

### 2026-10 — Arquivos anexados e gerados
Registrar os arquivos que o usuário anexa e os que a IA gera — ou ignorá-los. Coberto por DEC-005 (referência sim, binário não).

### 2026-10 — Lunoda importar o `.md` no futuro
Hoje o Lunoda importa só `.json`. Os marcadores `<!-- CONTEUDO:INICIO/FIM -->` do MD já permitem um importador. A mudança é no Lunoda, não aqui.

---

## 🤖 Ideias Ativas — Assistente
### 2026-10-16 — Modo «continuar entrada»
Exportar só os turnos novos de uma conversa já exportada e anexá-los à entrada existente do Lunoda, preservando os IDs dos blocos antigos. Combina com o uso real: projetos longos com conversas que continuam.

### 2026-10-16 — Preencher `p-ia` sozinho
Marcar a propriedade «IA Utilizada» com a opção da plataforma de origem (`o4` Claude, `o5` Gemini, `o6` ChatGPT). No `mapsmith 12` ela veio vazia; depende do teste no Lunoda (STATUS).

### 2026-10-16 — Botão de depuração «salvar resposta bruta»
No build de desenvolvimento, um botão que baixa o JSON cru da API. É o jeito mais barato de gerar fixtures reais e de diagnosticar quando a plataforma muda o formato.

### 2026-10-16 — Exportar uma pasta de Projeto do claude.ai inteira
Várias conversas num único `.json` do Lunoda (várias `entries`), disparado à mão e com intervalo entre requisições (DEC-007).

### 2026-10-16 — Ramos como versões
Exportar respostas regeneradas ou pedidos editados (ramos da árvore) em vez de só o ramo atual. Pode ser o uso «verdadeiro» do campo `version` do Lunoda — depende do ponto de decisão 1 do STATUS.

### 2026-10-16 — Copiar para a área de transferência
Além de baixar, copiar o MD (ou só a última resposta) com um clique — útil para colar num handoff.

### 2026-10-16 — Detectar o bloco de fecho do KCM
Reconhecer nas respostas o bloco «Próximo / Peça no próximo turno» e expô-lo à parte (ex.: copiar só a frase do próximo turno). Específico do fluxo do dono.

### 2026-10-16 — Firefox
O WXT gera build para Firefox a partir do mesmo código; custo baixo depois do MVP.

### 2026-10-16 — Outros formatos de saída
Markdown simples (sem os marcadores do Lunoda), Obsidian com front matter próprio, HTML. Cada um é só mais um exportador (DEC-003).

---

## 🛌 Adiadas
- **Backup automático periódico** — adiada porque automação contínua de endpoint interno é a parte mais exposta a Termos de Uso e a limite de taxa (DEC-007) — **volta quando** o dono pedir explicitamente backup sem clique.
- **Baixar os binários dos arquivos (zip)** — adiada porque exige mais endpoints, permissões e tamanho (DEC-005) — **volta quando** a referência por nome não bastar num caso real.
- **Publicar na Chrome Web Store** — adiada porque o único usuário hoje é o dono; publicar pede política de privacidade e revisão — **volta quando** a F3 estiver estável e houver interesse em público externo.

---

## ✅ Concluídas
- (nenhuma ainda)

---

## 🚫 Descartadas
- **Exportar PDF** — descartada porque o objetivo é texto reutilizável; quem quiser PDF imprime o MD.

---

## 📮 Feedback para o Kit
- **[2026-10-16]** As Instruções e o `CLAUDE.md` gerados vieram com o nome do projeto como placeholder (`[NOME]`, `<NOME DO PROJETO>`) e o README com o título «projeto», embora o Projeto do claude.ai já se chamasse «Coletor de Contexto (CDC)». O formulário de montagem poderia preencher o nome nos três.
- **[2026-10-16]** Seção «Feedback para o ASU» removida deste IDEAS: o projeto não usa o modo ASU, e seção sem uso só ocupa leitura.
- **[2026-10-16]** O pedido de abertura listava `SPEC.md` entre os arquivos a preencher, mas no kit ele é modelo. Solução adotada: modelo especializado em `meta/SPEC.md` e a spec real em `specs/`. O kit poderia dizer isso no próprio pedido de abertura.
