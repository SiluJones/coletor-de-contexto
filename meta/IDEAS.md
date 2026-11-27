# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Captura tudo, mesmo solto.
> Nunca perde: implementada vai para «Concluídas»; recusada vai para «Descartadas» com o motivo.

---

## 💡 Ideias Ativas — Usuário
### 2026-10 — Suporte a outras IAs (ChatGPT, Gemini…)
Além do Claude, coletar do ChatGPT, do Gemini e de outras. Viável: ChatGPT por API interna, Gemini só por DOM (mais frágil). Planejado na F3 do ROADMAP. O dono perguntou de novo em 2026-11-09 (nota `261109-0952`); resposta: sim — o modelo canônico já separa a plataforma do formato (DEC-002, DEC-003), cada IA é um adaptador novo.

### 2026-11-09 — Ícone próprio da extensão
Trocar o «C» cinza genérico por um ícone que identifique o Coletor de Contexto na barra do Chrome (nota `261109-0952`). Pede os PNGs 16/32/48/128 em `public/icon/` (convenção do WXT) e um desenho original.

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

### 2026-10-16 — Detectar o bloco de fecho do KCM
Reconhecer nas respostas o bloco «Próximo / Peça no próximo turno» e expô-lo à parte (ex.: copiar só a frase do próximo turno). Específico do fluxo do dono.

### 2026-10-16 — Firefox
O WXT gera build para Firefox a partir do mesmo código; custo baixo depois do MVP.

### 2026-10-16 — Outros formatos de saída
Obsidian com front matter próprio, HTML. Cada um é só mais um exportador (DEC-003) e mais uma caixa no popup (DEC-012). O pedido do dono de um formato «original/simples» (`.md` e `.json`) foi feito na wo0005 — ver «Concluídas».

### 2026-11-27 — Reprocessar uma pasta inteira
Na página «Reprocessar», escolher uma pasta (`webkitdirectory`) em vez de arquivos — por exemplo um `- Histórico - <projeto> (CDC)` inteiro, com o `cdc-raw/` dentro. Fora da primeira leva (DEC-017); volta se escolher arquivo a arquivo pesar.
### 2026-10-16 — Incluir as chamadas de ferramenta (opção)
As respostas de trabalho do Claude têm centenas de `tool_use`/`tool_result` (até 696 numa captura). Hoje ficam de fora (DEC-011); uma opção poderia listá-las resumidas (nome da ferramenta + uma linha) para quem quiser o rastro completo.

---

## 🛌 Adiadas
- **Backup automático periódico** — adiada porque automação contínua de endpoint interno é a parte mais exposta a Termos de Uso e a limite de taxa (DEC-007) — **volta quando** o dono pedir explicitamente backup sem clique.
- **Baixar os binários dos arquivos (zip)** — adiada porque exige mais endpoints, permissões e tamanho (DEC-005) — **volta quando** a referência por nome não bastar num caso real.
- **Publicar na Chrome Web Store** — adiada porque o único usuário hoje é o dono; publicar pede política de privacidade e revisão — **volta quando** a F3 estiver estável e houver interesse em público externo.

---

## ✅ Concluídas
- **Reprocessar a partir do JSON do CDC** (ideia de 2026-10-17; a fonte passou a ser a resposta bruta, DEC-015) — implementado em 2026-11-27 (DEC-017): página `reprocess.html`, aceita a bruta e o `.cdc.json`.
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1. Substituído em 2026-11-26 pela caixa «Resposta bruta» do «Exportar» (wo0011, DEC-015).
- **Preencher `p-ia` sozinho** — implementado na wo0004 (DEC-011): na entrada e nos blocos da IA, como o dono marcava à mão.
- **Link da conversa na descrição do Lunoda** (ideia do dono, 2026-10-16) — implementado na wo0004 (DEC-011).
- **Copiar para a área de transferência** — implementado na wo0007 (DEC-013): conversa em Markdown simples ou só a última resposta.
- **Formatos «simples» — Markdown simples e JSON do CDC** (pedido do dono, 2026-10-16) — implementados na wo0005 (DEC-012), escolhidos em caixas no popup.

---

## 🚫 Descartadas
- **Exportar PDF** — descartada porque o objetivo é texto reutilizável; quem quiser PDF imprime o MD.

---

## 📮 Feedback para o Kit
- **[2026-10-16]** As Instruções e o `CLAUDE.md` gerados vieram com o nome do projeto como placeholder (`[NOME]`, `<NOME DO PROJETO>`) e o README com o título «projeto», embora o Projeto do claude.ai já se chamasse «Coletor de Contexto (CDC)». O formulário de montagem poderia preencher o nome nos três.
- **[2026-10-16]** Seção «Feedback para o ASU» removida deste IDEAS: o projeto não usa o modo ASU, e seção sem uso só ocupa leitura.
- **[2026-10-16]** O pedido de abertura listava `SPEC.md` entre os arquivos a preencher, mas no kit ele é modelo. Solução adotada: modelo especializado em `meta/SPEC.md` e a spec real em `specs/`. O kit poderia dizer isso no próprio pedido de abertura.
- **[2026-10-17]** A skill `apply-wo` do kit manda gravar o relatório em arquivo no fim, depois do push; quando o Code PARA (divergência na Edição 0 da wo0004), ele não gravou nada e o dono teve de copiar a tela para o chat. Ajuste local: a skill e o `CLAUDE.md` dizem que a parada também gera relatório em arquivo, antes do menu. O kit poderia trazer isso de fábrica. **[2026-11-25] Absorvido no kit v1.162.1** (skill `apply-wo`, «A parada também grava o relatório em arquivo»); a linha local saiu do `CLAUDE.md` (DEC-014).
- **[2026-11-25]** **Pacote de update com o perfil vazio, de novo — e a regra do manifesto transforma isso em pedido de regerar.** O pacote v1.162.1 veio com todos os campos de perfil vazios e o SO «não informado»; em 2026-10-16 o nome já viera como placeholder. O manifesto trata campo vazio como «diferente», manda perguntar antes de fundir e nomeia «regerar o pacote» como remédio; o assistente seguiu isso e custou um turno ao dono, que não vai regerar pacote por qualquer coisa. Propostas ao kit: (1) a regra separar **vazio** (ausência: transplanta-se o valor vivo, marcado, sem pergunta) de **preenchido com valor diferente** (aí sim pergunta); (2) o texto que depende do perfil (seção «Ambiente», linha do SO nas Instruções, aviso no commit) vir em bloco marcado e transplantável, para o merge se adaptar sem regerar; (3) o gerador de pacote ler o perfil do projeto que vai atualizar, ou avisar na tela que o perfil está vazio antes de baixar. Adaptação local: DEC-014 e «Técnicas específicas deste projeto» no CEREBRO.
- **[2026-11-25]** **Sistema operacional com um terminal só não descreve este dono.** Ele cola os comandos no CMD, mas abre o Claude Code pelo PowerShell (no CMD o Code não funciona direito). O formulário poderia separar «terminal onde o dono cola comandos» de «terminal onde ele abre o Claude Code». Adaptação local: seção «Ambiente» do CEREBRO e linha do `CLAUDE.md`.
- **[2026-11-27]** **Merge pelo `_DELTA.md` (v1.162.1 → v1.169.0): funcionou.** Dos 12 trechos do CEREBRO, 11 entraram por troca exata e 1 não bateu (o aviso de sistema operacional em «Commit pronto ao final», que este projeto já tinha transplantado igual) — ajustado sem pergunta; 0 perguntas ao dono. Skills e molde de WO estavam iguais ao pacote anterior e foram trocados inteiros; nenhum arquivo «igual» precisou de comparação. A seção «Ambiente» do pacote, agora gerada com o perfil, substituiu a transplantada (mais um item do projeto). Resultado conferido: CEREBRO = pacote + transplantes, só a linha «vazio» de «Técnicas» saiu.
- **[2026-11-27]** **Bloco de git num bloco só:** o dono pediu, na mesma conversa em que o pacote chegou, que todos os comandos venham num bloco para copiar uma vez — o kit v1.169.0 já trazia a regra. Sinal de que ela estava certa; e o dono abre o Code pelo PowerShell mas cola os comandos no CMD, o que o perfil «CMD e PowerShell» do kit cobre.
- **[2026-11-27]** **O shell na 1ª linha do bloco, como comentário, atrapalha — e o bloco do dono é melhor em PowerShell.** O kit v1.169.0 manda abrir o bloco com `REM CMD`/`# PowerShell`; o dono recusou (nota `261127-1652`): texto que não faz nada dentro de algo para copiar e colar. Ele prefere PowerShell para os comandos dele (mais fácil de abrir no Windows 11). Duas armadilhas do PowerShell 5.1, que é o que vem no Windows 11: não tem `&&`, e o `npm` cai na política de execução (`npm.ps1`) — o bloco usa `npm.cmd` e `if ($LASTEXITCODE -eq 0) { … }`. Proposta ao kit: o shell se diz no texto, antes do bloco; o bloco de git sai em PowerShell compatível com o 5.1 para todos os projetos Windows; CMD só quando exigido, e avisado. Desvio local: DEC-018. Levado ao KCM no aviso de lido da carta 01.

---

> **Fim do IDEAS.** Acréscimo entra sob o título da seção certa, nunca aqui embaixo: o fim do arquivo é a seção de feedback, e o que cai nela se perde do lugar dele.
