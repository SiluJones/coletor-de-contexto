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
