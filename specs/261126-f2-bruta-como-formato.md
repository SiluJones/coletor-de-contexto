# SPEC — F2: resposta bruta como formato do «Exportar»

> Leva da F2 que nasce da análise `meta/analises/261126-ANALISE-formatos-de-exportacao.md` (decidida pelo dono em 2026-11-26: «bruta + simples»; não importa mais no Lunoda). A WO de aplicação é `meta/workorders/261126-wo0011-bruta-como-formato.md`. O reprocessar a partir da bruta é a leva seguinte, com spec própria.

## Problema
O dono exporta 5 arquivos por conversa, e quatro deles repetem o mesmo conteúdo. O único sem perda é a resposta bruta, que hoje sai de um botão de depuração separado. Os projetos dele leem o `(simples).md`. Ele quer exportar só o que precisa, sem perder nada.

## Critérios de aceite (verificáveis)
- [ ] O popup tem a caixa «Resposta bruta (.json, sem perda)», lembrada como as outras (`formats.raw` em `cdc.exportSettings`).
- [ ] Primeiro uso (nada salvo): Markdown simples + resposta bruta marcados, Lunoda e JSON do CDC desmarcados; pensamento desligado, arquivos ligados (DEC-008).
- [ ] Preferência salva antes desta versão (sem `formats.raw`) passa a ter a bruta marcada e mantém o resto.
- [ ] A bruta baixada é o texto da API byte a byte, em `Downloads/cdc-raw/<título> — claude-<uuid8>-<AAAAMMDDTHHMMSSZ>.json` (mesmo nome do antigo botão).
- [ ] A bruta é salva ANTES de normalizar: com o formato do site mudado (`ClaudeFormatError`), ela fica salva e o popup diz isso.
- [ ] Só a bruta marcada → um arquivo, sem normalizar.
- [ ] O botão «Salvar resposta bruta (depuração)» sai do popup.
- [ ] O teste das capturas reais aceita resposta da IA sem texto quando ela tem pensamento ou arquivo, e reprova a conversa sem NENHUM texto da IA (armadilha 15). Medido em 2026-11-26: 50 brutas reais passam; com o normalizador quebrado de propósito, 52 de 63 reprovam.
- [ ] `npm run check` verde.
- [ ] No navegador (dono): o roteiro da wo0011.

## Plataformas e formatos afetados
- Popup (`index.html`, `main.ts`), `src/popup/settings.ts`, `src/popup/raw-dump.ts`, comentário de `src/popup/export.ts`, testes. Nenhum exportador muda; nenhuma fixture muda; nenhuma permissão nova.

## Decisões de design
DEC-015. Resumo: a bruta vira formato de primeira classe porque é a única sem perda (as entradas de ferramenta somam 4 vezes o texto das mensagens, mais os ramos); o padrão passa a «simples + bruta»; a bruta sai primeiro, para sobreviver à quebra do normalizador; o botão de depuração sai (DEC-010 emendada); o `.cdc.json` deixa de ser «o arquivo de guarda» (DEC-012 emendada), mas continua disponível.

## Fora de escopo
- Reprocessar a partir da bruta (leva seguinte).
- Pensamento ligado por padrão (o dono exporta com ele, mas a preferência dele já está salva; o padrão de primeiro uso segue a DEC-008).
- Mexer nos 51 históricos já exportados (são do dono, só leitura).
- Escolher a subpasta de download da bruta.

## Passos
1. `settings.ts`: `formats.raw`, padrão novo, `needsNormalization`.
2. `raw-dump.ts`: `rawDownloadFile`.
3. Popup: caixa nova, bruta primeiro, dica do erro, botão de depuração fora.
4. Testes: settings, raw-dump, export, copy, capturas reais.
5. Conferência do dono no navegador.
