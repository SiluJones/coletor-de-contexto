# ANALISE — Levar ao histórico os arquivos que a IA escreveu

> **Status:** Em discussao
> **Data:** 2026-11-28 (data de criacao; nao muda depois)

## Problema

O `(simples).md`, que é o que os projetos do dono leem do histórico, mostra o texto das respostas e os resumos do pensamento, mas não os arquivos que a IA escreveu na conversa — documentos e códigos entregues, rascunhos, edições. Esse conteúdo só existe na resposta bruta (DEC-015), onde ninguém lê. É o item «conteúdo dos artefatos gerados» da F2. Se nada for feito: quem relê um histórico vê «gravei o STATUS» e não vê o STATUS que foi gravado.

## Restricoes / o que foi medido

Medido pelo chat em 2026-11-28, só leitura, nas 140 respostas brutas dos 49 históricos (lista de `find` por área, todas com código de saída 0; leitura em 4 lotes de 35 por causa do teto de tempo por comando). Script: ramo atual de cada conversa; arquivos criados por `create_file` e `Write`; edições por `str_replace` e `Edit` aplicadas em ordem sobre o arquivo criado na própria conversa.

- **Quem escreve:** das entradas de ferramenta (45,9 milhões de caracteres), `create_file` é 33,6%; comandos de shell (`device_bash`, `bash_tool`, `Bash`) 48,6%; `str_replace` 8,8%; `Write` 5,7%; o resto abaixo de 1% cada. Arquivo escrito por comando de shell (heredoc, script) não é reconstruível com segurança e fica de fora desta medição.
- **Quanto:** 122 de 140 conversas criam arquivos — **2.016 arquivos**, 16,8 milhões de caracteres na versão final, contra **8,0 milhões** de texto das respostas da IA (2,1×). Por conversa: mediana 1,9×, p75 4,7×, p90 9,6×, máximo 41×. Arquivos por conversa: mediana 11, máximo 77. Extensões: `.md` 78%, depois `.py`, `.ts`, `.json`, `.gd`, `.html`, `.lua`.
- **Onde foram gravados:** entrega (`/mnt/user-data/outputs`) 47% dos arquivos e 50% dos caracteres; rascunho (`/home/claude`, `/tmp`) 51% e 47%; mount do Projeto e outros, menos de 3%. Ou seja: a maioria é da época do canal de reserva (o chat gerava para download e o dono punha no projeto) ou rascunho de trabalho — **não** é cópia do que já está num repositório.
- **Entregues ao dono** (`present_files`): 1.134 arquivos, 9,9 milhões de caracteres (1,2× o texto; mediana por conversa 0,65×).
- **Edições:** 36,8% se aplicam sobre o arquivo criado na conversa; 9,0% falham (o trecho antigo não é único na reconstrução — o arquivo mudou por outro caminho, como um comando de shell); **54,2% são em arquivos que a conversa não criou** (317 arquivos, 2,1 milhões de caracteres de trecho): desses só existe o trecho trocado, não o arquivo.
- **O que NÃO foi olhado:** o conteúdo dos arquivos escritos por shell; os `files[]` com `download_source` (o binário não vem na resposta); se os arquivos entregues foram mesmo parar num repositório (muitos projetos do mapa não têm Git).

## Opcoes consideradas

1. **Tudo dentro do `(simples).md`, no turno em que foi escrito.** Fiel ao tempo da conversa, mas o arquivo cresce ~3× no total e até 10× no p90; o `(simples).md` deixa de ser leitura. Descartada como padrão.
2. **Um arquivo à parte, `<título> (arquivos).md`, e um índice no `(simples).md`.** O índice é uma linha por turno: «**Arquivos escritos:** `STATUS.md` (criado) · `CEREBRO.md` (editado)». O arquivo à parte traz a **versão final** de cada arquivo, na ordem em que apareceu, com o caminho, o turno e a marca honesta do que não fechou (edições não aplicadas; arquivo de fora com só os trechos). O `(simples).md` cresce uma linha por turno com escrita.
3. **Extrair os arquivos de verdade para uma pasta** (`<título> (arquivos)/…`). O mais útil para reaproveitar código, mas são até 77 downloads por conversa (ou uma dependência nova para gerar zip), caminhos de Linux para mapear no Windows, e arquivo com edição não aplicada sairia «quebrado» sem aviso visível. Descartada agora; fica como ideia.
4. **Só os entregues (`present_files`).** Metade do volume, mas perde o que foi gravado sem ser apresentado — exatamente o trabalho de bastidor que o dono não viu.

## Recomendacao

**Opção 2, com dois níveis:** no `(simples).md`, o **índice de tudo** o que foi escrito no turno (uma linha); em `<título> (arquivos).md`, o **conteúdo final dos arquivos de entrega e dos apresentados** completo, e os de **rascunho só pelo nome e tamanho** (com a caixa «incluir rascunhos» para quem quiser tudo). Formato novo no popup e no «Reprocessar», **desmarcado por padrão** — o dono liga quando quiser, e o «Reprocessar» o gera para as 140 conversas já guardadas, sem exportar de novo.

Por quê: mantém o `(simples).md` legível (o que os projetos leem), põe à vista o que hoje só a bruta guarda, e não perde nada — o que não entra no `(arquivos).md` continua na bruta.

O que isso pede no código: o adaptador do Claude passa a extrair as escritas (`create_file`, `Write`, `str_replace`, `Edit`) para um campo **opcional** do modelo canônico (por mensagem: caminho, criação ou edição, texto), e um exportador novo reconstrói a versão final. O `.cdc.json` ganha o campo opcional, sem mudar a `version` (formato extensível: quem lê hoje continua lendo).

Melhor argumento contra: a reconstrução é **aproximada** — 9% das edições não fecham e as escritas por shell (metade das entradas de ferramenta) ficam de fora. Um `(arquivos).md` que parece completo e não é pode enganar mais do que ajudar. Por isso a marca de «reconstrução parcial» por arquivo e a frase fixa, no topo, do que ele não cobre.

## Riscos

- **Falsa completude.** Sinal: um projeto citar como «o arquivo final» algo que divergia do que foi para o repositório. Defesa: a marca por arquivo e o aviso fixo do topo.
- **Nomes de ferramenta mudam** (`create_file` hoje, `Write` no Code). Defesa: a lista de ferramentas reconhecidas mora no adaptador, com teste das capturas reais; ferramenta nova de escrita aparece como «não reconhecida» numa contagem do teste.
- **Dados sensíveis:** o conteúdo já está na bruta; o `(arquivos).md` só o torna legível. Nada muda em permissões.

## Ponto de decisao

Aprova a opção 2 — índice no `(simples).md` e `<título> (arquivos).md` com o conteúdo final dos entregues e apresentados, rascunhos só por nome (caixa para incluí-los), desmarcado por padrão? Se sim, a próxima entrega é a spec e o código.
