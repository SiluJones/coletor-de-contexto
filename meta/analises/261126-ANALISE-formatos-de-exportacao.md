# ANALISE — Quais arquivos exportar por conversa

> **Status:** Decidida — em 2026-11-26 o dono escolheu «bruta + simples» (não importa mais no Lunoda) e aprovou a bruta como formato do popup e o reprocessar logo depois: DEC-015, spec `specs/261126-f2-bruta-como-formato.md`, wo0011
> **Data:** 2026-11-26 (data de criacao; nao muda depois)

## Problema

O dono exporta quase sempre os 5 arquivos por conversa — Lunoda `.json`, Lunoda `.md`, `(simples).md`, `.cdc.json` e a resposta bruta (que ele guarda em `cdc-raw/`) — e os move para `- Histórico - <projeto> (CDC)/` na pasta de notas arquivadas de cada projeto. Ele quer parar com a repetição sem perder nada [relatado pelo dono, 2026-11-26]. Se nada mudar: 5 arquivos por conversa, quatro deles com o mesmo conteúdo, e nenhum critério para escolher.

## Restricoes / o que foi medido

Medido em 2026-11-26 pelo chat, só leitura, nas áreas concedidas (Historiador, Novelista, Game Design, Music, Artista, Estudante, Creator, Tools, Contexto, Downloads). Trabalho e Suporte não foram olhadas (dado da empresa).

- **Onde estão:** 29 pastas `- Histórico - … (CDC)` em 28 projetos, mais 2 `.cdc.json` avulsos (Otome Mob, Rainha da Preguiça) — `find … -name "*.cdc.json" -o -name "*Histórico*(CDC)*"`. Downloads tem só uma pasta vazia de teste. O GameDataHub cita uma `- Histórico - GDH (CDC)` que esta busca não achou: **não conferido** onde ela está.
- **Quanto:** 51 conversas; 51 `(simples).md`, 51 `.cdc.json`, 51 Lunoda `.md`, 51 Lunoda `.json` e 50 brutas (falta a de «My Little Lady 3»). Tamanho total 77,9 MB: `(simples).md` 5,5 · `.cdc.json` 5,9 · Lunoda `.json` 6,0 · Lunoda `.md` 6,2 · brutas 54,3 MB.
- **Os quatro formatos processados têm o mesmo conteúdo:** em toda pasta medida os quatro ficam a poucos % de tamanho um do outro (ex.: Hey Mother 1 — 602 KB, 615 KB, 617 KB, 620 KB). É a mesma conversa normalizada em quatro roupas (DEC-011, DEC-012).
- **O que só a bruta guarda** (50 brutas, ramo atual): 2,86 milhões de caracteres de texto das mensagens contra **12,1 milhões nas entradas de ferramenta** (`create_file`, `str_replace`, `bash_tool`, `device_bash`… — os arquivos e comandos que a IA escreveu) e **14,1 milhões nos resultados de ferramenta**. Mais 52 mensagens fora do ramo atual, em 11 conversas (edições e regenerações), e o `extracted_content` de 3 anexos. Nenhum dos outros quatro formatos leva isso (DEC-011: o normalizador descarta ferramentas e ramos; DEC-005: arquivo só por referência). O item «conteúdo dos artefatos gerados» da F2 está justamente aí.
- **O que os projetos leem:** a varredura dos `meta/`, `CLAUDE.md` e skills dos projetos (1.234 arquivos) só achou leitura do `(simples).md` — a sonda do My Little Lady sobre «~1,76 MB nos `(simples).md`» e a conversa de origem «Gerador procedural (simples).md». Nenhum projeto cita o Lunoda `.json`/`.md`, o `.cdc.json` ou a bruta como coisa que lê. O CEREBRO do kit (18 projetos) diz que a pasta de histórico é do dono, só leitura, e lida «quando a origem de uma decisão ajudar».
- **Fidelidade do normalizador nessas conversas:** nas 50 com bruta, o número de turnos do `(simples).md` = o de mensagens do usuário no ramo atual (50 de 50), e nenhum bloco `## Você`/`## Claude` vazio. Isso responde «está lá?»; não compara o texto turno a turno.
- **Não medido:** se o dono ainda importa o `.json` no Lunoda (o Lunoda guarda os dados no navegador; não há o que contar no disco).

## Opcoes consideradas

1. **Continuar com os 5.** Nada se perde, mas 4 cópias do mesmo conteúdo e 5 arquivos por conversa. Descartada: é o problema.
2. **Só o `(simples).md`.** O que os projetos leem e o mais leve. Descartada: perde tudo o que só a bruta tem (os arquivos que a IA criou, os ramos) — só as entradas de ferramenta somam 4 vezes o texto das mensagens — e não dá para refazer depois se a conversa sumir do claude.ai.
3. **Só a bruta.** Não perde nada, mas ninguém lê JSON bruto de 2 MB; os projetos perderiam o `(simples).md` que de fato usam. Descartada sozinha.
4. **Bruta + `(simples).md` (recomendada).** A bruta é a fonte sem perda; o `(simples).md` é o formato de leitura que os projetos usam. Lunoda `.json` só quando o dono for importar no Lunoda. Saem o Lunoda `.md` (leitura duplicada do `(simples).md`; o importador de MD do Lunoda não existe) e o `.cdc.json` (é o normalizado da bruta: refaz-se a partir dela com o código do repositório).
5. **`.cdc.json` + `(simples).md`.** O `.cdc.json` foi desenhado como «arquivo de guarda» (DEC-012). Descartada: a medição mostrou que ele não guarda o principal que se perde (ferramentas, ramos); a bruta guarda.

## Recomendacao

**Opção 4: por conversa, exportar a bruta e o `(simples).md`; o Lunoda `.json` só quando for importar no Lunoda.** De 5 arquivos para 2 (3 com Lunoda); 23,6 MB de cópias processadas viram 5,5 MB, e nada se perde — tudo o que os formatos que saem tinham está na bruta.

O que isso pede no produto, em ordem (cada um vira WO quando o dono aprovar):
1. **Popup:** a «Salvar resposta bruta» deixa de ser só depuração e vira formato de primeira classe, com caixa própria e nome `<título> — claude-<uuid8>-<carimbo>.json` como hoje; o padrão de primeiro uso passa a «bruta + simples». Revisa a DEC-010 (botão de depuração) e a DEC-012 (o `.cdc.json` como guarda).
2. **Reprocessar a partir da bruta** (a ideia «Reprocessar a partir do JSON do CDC», do IDEAS, com a fonte trocada): abrir uma bruta guardada e gerar dela qualquer formato, sem buscar a conversa de novo. Até isso existir, o formato que saiu só se refaz exportando de novo enquanto a conversa existir no claude.ai.
3. **Depois:** levar o conteúdo dos arquivos criados pela IA para o `(simples).md` (opção), que é o item «conteúdo dos artefatos gerados» da F2 — a bruta já tem o dado.

Os 51 históricos que já existem **ficam como estão**: são do dono, só leitura (regra do kit), e apagar as cópias não é pedido.

## Riscos

- **Bruta muda de formato** (endpoint interno, DEC-002): a bruta antiga continua valendo como arquivo; o risco é o reprocessador não ler bruta velha. Sinal: o teste das capturas reais (`CDC_CLAUDE_CAPTURES_DIR`) passar a falhar com bruta nova. Defesa: o reprocessador lê qualquer bruta que o normalizador da época lia — as 50 brutas medidas viram corpus de teste.
- **Bruta tem dado sensível** (conteúdo de anexos, comandos, caminhos da máquina): já é assim hoje; não muda.
- **O dono ainda depender do Lunoda `.md`** para algo que esta medição não viu. Sinal: ele marcar a caixa de novo. A caixa continua existindo; só deixa de ser padrão.

## Ponto de decisao

Você ainda importa o `.json` no Lunoda? Se sim, «bruta + simples + Lunoda `.json`»; se não, «bruta + simples». E aprova levar a bruta de depuração a formato de primeira classe (item 1), com o reprocessar (item 2) logo depois?
