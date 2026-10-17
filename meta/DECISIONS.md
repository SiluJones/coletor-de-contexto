# DECISIONS.md — Registro de Decisões

> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> **DEC** = decisão de arquitetura/design · **FIX** = bug grave resolvido.
> Toda entrada traz `**Status:**` com valor fechado: aceita · substituída por X · resolvida · aberta.
> Entrada resolvida ou substituída vai para `DECISIONS-archive.md` por evento; ~700 linhas é só alarme.

---

## DEC-001 — Extensão de navegador Manifest V3 como forma do produto
**Data:** 2026-10-16 · **Status:** aceita (forma delegada pelo dono: «extensão do chrome, ou o que você achar melhor»)

### Contexto
A coleta precisa ler conversas de sites onde o usuário já está logado e entregar arquivos para baixar, com qualidade «profissional, completa e capaz».

### Decisão
Extensão Chrome Manifest V3, com popup de ação na barra e content script por plataforma.

### Alternativas consideradas
- **Userscript (Tampermonkey)** — mais rápido de começar, mas exige outra extensão instalada, não tem API de download nem de preferências, e soa menos produto.
- **Bookmarklet** — sem permissões, sem UI decente, limite de tamanho.
- **App desktop ou script Playwright** — teria de reautenticar nos sites (login, 2FA, captcha); a extensão já herda a sessão.
- **Export oficial das plataformas** — o do Claude e o do ChatGPT entregam a conta inteira por e-mail, sem escolher conversa; o do Gemini (Takeout) não traz as mensagens.

### Consequências
Herda a sessão sem guardar credencial; precisa de permissões de host por site; publicar na Web Store vira uma decisão separada. Melhor argumento contra: userscript entregaria um protótipo numa tarde — mas o MVP com WXT custa pouco a mais e não precisa ser refeito.

---

## DEC-002 — API interna do site primeiro, DOM como reserva, um adaptador por plataforma
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
Há dois jeitos de ler a conversa: raspar a página (DOM) ou chamar os mesmos endpoints JSON que a página usa. A pesquisa de 2026-10-16 (HISTORY §1) mostrou que as extensões maduras para Claude usam a API interna.

### Decisão
Cada plataforma tem um adaptador próprio. Claude e ChatGPT usam a API interna (com a sessão do usuário); Gemini, sem API utilizável, usa DOM. Nenhum adaptador vaza detalhe da plataforma para fora do modelo canônico.

### Alternativas consideradas
- **Só DOM, para todas** — uniforme, mas perde o markdown original, o pensamento colapsado e os metadados de arquivo, e quebra a cada redesign.
- **Só API** — deixaria o Gemini de fora para sempre.

### Consequências
Endpoints não documentados podem mudar sem aviso: cada adaptador tem fixture e teste, e falha visível em vez de silenciosa. O uso é sob demanda e de baixo volume (DEC-007), o que reduz o risco de Termos de Uso e de limite de taxa.

---

## DEC-003 — Modelo canônico próprio; Lunoda é um exportador
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
O formato do Lunoda não tem lugar para pensamento, anexos, ramos nem metadados da plataforma. Usá-lo como modelo interno jogaria informação fora antes de saber se ela será útil.

### Decisão
Os adaptadores produzem `Conversation` (esboço no CONTEXT); os exportadores (Lunoda JSON, Lunoda MD e outros futuros) consomem dele.

### Alternativas consideradas
- **Gerar o JSON do Lunoda direto no adaptador** — menos código hoje, mas multiplica o trabalho por plataforma e prende o projeto a um único destino.

### Consequências
N plataformas × M formatos custa N + M peças, não N × M. Formato novo (Obsidian, HTML) não mexe em adaptador.

---

## DEC-004 — Saída Lunoda espelha o par `mapsmith 12`
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
O dono já usa o Lunoda, que importa `.json`. O par `mapsmith 12.json`/`.md`, montado à mão, é a referência concreta do resultado esperado.

### Decisão
O JSON reproduz a estrutura medida (CONTEXT, «Formato Lunoda»): `properties` padrão, uma entrada por conversa, um bloco por mensagem, `subtitle` "Prompt"/nome da IA, `version` = número do turno, IDs `Date.now()` em base36 + 4 aleatórios. O MD reproduz o export do Lunoda byte a byte. Teste de ouro: dado o `mapsmith 12.json`, o exportador MD tem de gerar o `mapsmith 12.md` idêntico.

### Alternativas consideradas
- **Formato próprio + conversor** — mais limpo, mas adia o único uso real que existe hoje.

### Consequências
Ainda não confirmado: se o Lunoda aceita `subtitle` fora de "Prompt"/"Claude" e se `version` significa «turno» ou «versão do mesmo bloco» (STATUS, Backlog). Preencher `p-ia` automaticamente com a IA de origem é proposta, não decisão (IDEAS).

---

## DEC-005 — Pensamento e arquivos: captura sempre, exportação por opção, nunca binário
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
O dono deixou em aberto se valia obter o pensamento da IA e os arquivos (anexados e gerados).

### Decisão
O adaptador sempre captura pensamento e referências de arquivo no modelo. O exportador inclui cada um conforme uma opção do popup, que fica lembrada. Arquivo entra só como referência (nome, tipo, tamanho); conteúdo **textual** gerado pela IA (artefato de código ou documento) pode entrar como texto; binário nunca.

### Alternativas consideradas
- **Ignorar pensamento e arquivos** — mais simples, mas perde o que custa pouco capturar.
- **Baixar os binários junto (zip)** — exige mais endpoints, mais permissões e arquivos grandes; fica para o IDEAS.

### Consequências
O padrão de cada opção (ligada ou desligada) e o lugar do pensamento no Lunoda (bloco próprio ou dentro da resposta) ficam para o dono decidir (STATUS).

---

## DEC-006 — TypeScript + WXT + Vitest
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
É preciso uma base de extensão MV3 tipada, com recarga em desenvolvimento e build para Chrome (e talvez Firefox).

### Decisão
TypeScript strict, WXT como framework de extensão, Vitest para testes com fixtures. Popup sem framework de UI no MVP.

### Alternativas consideradas
- **Vite + CRXJS** — bom, mas focado em Chrome e com manutenção menos ativa que o WXT.
- **Plasmo** — mais opinativo e mais pesado para uma extensão pequena.
- **JavaScript puro sem build** — zero ferramenta, mas sem tipos no modelo canônico, que é justamente o contrato que precisa de tipos.

### Consequências
Requer Node no ambiente do Code. Versões exatas fixadas no `package.json` na F1, conferidas na hora (não de memória).

---

## DEC-007 — Local, sob demanda, sem backend e com permissões mínimas
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
As conversas são privadas e os endpoints são internos.

### Decisão
Nenhum dado sai do navegador; sem servidor, analytics ou telemetria. A coleta acontece só quando o usuário clica. Permissões: `activeTab`, `downloads`, `storage` e host apenas dos sites suportados.

### Alternativas consideradas
- **Backup automático periódico** (como a extensão do thirdbear, a cada 8 h) — útil, mas é a automação mais exposta a Termos de Uso e a limite de taxa; fica adiada no IDEAS.

### Consequências
Exportar em lote, se vier, também será disparado à mão, com intervalo entre requisições.

---

## DEC-008 — Pensamento, arquivos e versão no formato Lunoda
**Data:** 2026-10-16 · **Status:** aceita (decidido pelo dono)

### Contexto
A DEC-004 e a DEC-005 deixaram três pontos para o dono: o significado de `version`, onde o pensamento entra no Lunoda e o padrão das opções no primeiro uso.

### Decisão
- `version` é o número do turno: pedido, pensamento e resposta do mesmo turno têm a mesma versão.
- O pensamento, quando exportado, vira um bloco próprio com `subtitle: "Pensamento"`, entre o pedido e a resposta: Prompt vN → Pensamento vN → Claude vN.
- Primeiro uso: pensamento **desligado**, arquivos **ligados** (`DEFAULT_EXPORT_OPTIONS` em `src/core/model.ts`).
- Arquivos (proposta do chat, aceita junto): lista no fim do `content` do bloco da mensagem a que pertencem, depois de uma linha em branco — `**Arquivos anexados:**` no bloco Prompt, `**Arquivos gerados:**` no bloco da resposta —, um item por arquivo: `` - `nome.ext` — tipo, tamanho ``.

### Alternativas consideradas
- **Pensamento dentro do bloco da resposta** — um bloco a menos, mas mistura dois textos de natureza diferente no mesmo `content`.
- **`version` para respostas regeneradas** — ficaria sem número de turno; ramos alternativos, se vierem, ganham outro mecanismo (IDEAS, «Ramos como versões»).

### Consequências
Ainda não testado no Lunoda: se ele aceita `subtitle` «Pensamento» e o `content` com a lista de arquivos (STATUS, Backlog). O formato da lista é o mais fácil de ajustar depois: muda só o exportador.


---

## DEC-009 — Repositório público: fixture sintética e oráculo do Lunoda fora do repo
**Data:** 2026-10-16 · **Status:** aceita (repositório público decidido pelo dono)

### Contexto
O repositório no GitHub é público. O único exemplo do que o Lunoda grava, o `mapsmith 12`, é uma conversa real do dono (de outro projeto). Os testes de ouro precisam de um par que o próprio Lunoda produziu; um par gerado pelo código só prova que o código concorda consigo mesmo.

### Decisão
- Fixture versionada é sempre sintética: `src/tests/synthetic-conversation.ts` gera `src/tests/fixtures/lunoda/sintetico.json` e `.md`, gravados pelo próprio Vitest (`toMatchFileSnapshot`). Protege contra regressão.
- A fidelidade ao Lunoda é provada por pares `.json` + `.md` exportados PELO Lunoda numa pasta fora do repositório, apontada por `CDC_LUNODA_ORACLE_DIR` (hoje a pasta-pai, com o `mapsmith 12`). Sem a variável, o bloco é pulado.
- O `sintetico.json` importado no Lunoda e exportado de volta vira oráculo do par sintético e, de quebra, testa o bloco «Pensamento» e as listas de arquivos da DEC-008.

### Alternativas consideradas
- **Repositório privado com o `mapsmith 12` versionado** — o dono preferiu público.
- **Anonimizar o `mapsmith 12`** — trocar o texto muda justamente o que o teste mede (conteúdo longo, acentos, blocos reais).
- **Só o par sintético** — circular: o código gravaria o que ele mesmo confere.

### Consequências
O `npm test` comum não prova fidelidade; quem mexe em `src/exporters/` roda também o oráculo (comando no `CLAUDE.md`). Medido em 2026-10-16: `mapsmith 12.json` e `.md` reproduzidos byte a byte.

---

## DEC-010 — Claude: busca injetada na aba e captura bruta antes do normalizador
**Data:** 2026-10-16 · **Status:** aceita

### Contexto
O normalizador do Claude (passo 7 da spec) depende do formato da resposta de `chat_conversations`, que o projeto só conhece por relato de terceiro (HISTORY §1). Escrevê-lo em cima disso seria deduzir um formato não lido, e o erro apareceria em silêncio: arquivo exportado faltando partes.

### Decisão
- A busca roda DENTRO da aba do claude.ai: o popup injeta `fetchClaudeConversationRaw` com `chrome.scripting.executeScript` — mesma origem e mesma sessão da página. Permissões: `activeTab`, `scripting`, `downloads`; nenhuma host_permission permanente.
- Primeiro, a captura bruta (passo 6): o botão «Salvar resposta bruta (depuração)» baixa o corpo exato da API para `Downloads/cdc-raw/`; o dono move para `CDC/capturas-claude/`, fora do repo. O normalizador é escrito sobre capturas reais, e as fixtures versionadas do Claude serão sintéticas no MESMO formato (DEC-009).
- O botão fica visível em todo build durante a F1: o único usuário é o dono, e o build de desenvolvimento só funciona com o dev server rodando. Sai antes de qualquer publicação.
- O oráculo do Lunoda mudou para `CDC/oraculo-lunoda/` (a DEC-009 citava a pasta-pai).

### Alternativas consideradas
- **Fetch feito pelo próprio popup, com host_permission do claude.ai** — mais permissão permanente, e a origem da extensão pode ser tratada pelo site como terceira (cookies, verificação anti-robô).
- **Content script fixo no claude.ai** — rodaria em toda página do site sem o usuário pedir.
- **Normalizador já, pela memória do formato** — exatamente a dedução que o método proíbe.

### Consequências
A função injetada tem de ser autocontida (armadilha 14 do CONTEXT; um teste a recria só do próprio texto). Há um ciclo a mais — capturas do dono — antes do botão «Exportar».

---

## DEC-011 — Normalizador do Claude sobre o formato medido; o que vai para o Lunoda
**Data:** 2026-10-16 · **Status:** aceita (itens de nome, descrição e «IA Utilizada» pedidos pelo dono)

### Contexto
As 4 capturas reais (CONTEXT, «Formato da resposta do Claude») mostraram que o texto da mensagem não está no campo `text` e que o pensamento completo não vem. O dono pediu o título da conversa na frente do nome do arquivo, sugeriu o link na descrição do Lunoda e contou que marcava «IA Utilizada» à mão nos blocos da IA.

### Decisão
- Ramo atual: da raiz até `current_leaf_message_uuid`. Texto: itens `content[].text`, juntos com linha em branco. Ferramentas (`tool_use`/`tool_result`) ficam de fora.
- Pensamento: o texto completo quando vier; senão, os resumos (`summaries`) em lista. Hoje só vêm os resumos.
- Mensagens vazias ficam de fora; respostas seguidas da IA viram uma resposta só.
- Arquivos: só referência (nome, tipo, tamanho); `extracted_content` nunca vai para a exportação.
- Lunoda: descrição = link da conversa; «IA Utilizada» marcada na entrada e nos blocos da IA.
- Nome de arquivo: `<título>.json` e `<título>.md`, com o título seguro para o Windows; a captura bruta vira `<título> — claude-<uuid8>-<carimbo>.json`.
- Teste com as capturas reais fora do repo, por `CDC_CLAUDE_CAPTURES_DIR` (mesmo desenho do oráculo do Lunoda, DEC-009).

### Alternativas consideradas
- **Ler `text` da mensagem** — vem vazio: exportaria conversas em branco sem erro.
- **Incluir as chamadas de ferramenta** — em conversas de trabalho são centenas por resposta (até 696 numa captura); viram ruído. Fica como opção futura (IDEAS).
- **Uuid no nome do arquivo** — atrapalha a ordem por título que o dono usa; o link vai na descrição.

### Consequências
A exportação reproduz o que a tela mostra, menos o raciocínio completo, que a API web não entrega. Mudança no formato do claude.ai aparece como erro «Formato da conversa do Claude mudou», e o teste das capturas reais reprova turno vazio.

