# SPEC — F2: opções no popup e formatos «simples»

> Spec da primeira leva da F2. A WO de aplicação é `meta/workorders/261017-wo0005-formatos-simples-e-opcoes.md`.

## Problema
O botão «Exportar» da F1 só baixa o par do Lunoda, sempre com o padrão (pensamento desligado, arquivos ligados). O dono pediu formatos «original/simples», em `.md` e `.json`, para ler e guardar a conversa sem os marcadores do Lunoda (nota 261016-2318), e escolher o que entra sem mexer no código.

## Critérios de aceite (verificáveis)
- [x] Dada a resposta sintética do Claude, o Markdown simples é idêntico à fixture `src/tests/fixtures/claude/sintetico-claude.simples.md`.
- [x] Dada a resposta sintética, o JSON do CDC é idêntico a `sintetico-claude.cdc.json`, e o seu `conversation` é igual ao `normalizeClaudeConversation` da mesma resposta.
- [x] O JSON do CDC traz pensamento e arquivos mesmo com as duas opções desligadas.
- [x] Com o padrão do primeiro uso, o botão gera só os 2 arquivos do Lunoda, iguais aos da F1 (fixtures `sintetico-claude.lunoda.*` sem mudança).
- [x] Nenhum formato marcado → nenhum download e o aviso «Marque ao menos um formato.». *(Teste cobre a lista vazia; o aviso no navegador não foi visto.)*
- [x] Preferência salva com tipo errado ou campo faltando → completada com o padrão, sem erro.
- [x] No navegador: marcar os três formatos e as duas opções baixa 4 arquivos que começam pelo título da conversa; fechar e reabrir o popup mantém as caixas marcadas.
- [x] O `.json` do Lunoda gerado com pensamento ligado importa no Lunoda.

## Plataformas e formatos afetados
- Adaptador Claude: o normalizador passa a levar o `model` da conversa.
- Modelo canônico: campo opcional `Conversation.model`.
- Exportadores novos: `simple-md.ts` (Markdown simples) e `cdc-json.ts` (JSON do CDC). Lunoda sem mudança.
- Popup: caixas de formato e de opção, lembradas em `chrome.storage.local`; permissão `storage`.

## Decisões de design
DEC-012. Resumo:
- Caixas, não escolha única: um clique baixa todos os formatos marcados.
- O JSON do CDC é o arquivo de guarda: modelo inteiro, ignora as opções.
- O Markdown simples segue as mesmas opções do Lunoda.
- O padrão do primeiro uso continua o da DEC-008: só Lunoda, sem pensamento, com arquivos.

## Fora de escopo
- Conteúdo textual dos artefatos gerados, copiar para a área de transferência, nome de arquivo configurável: próximas levas da F2.
- Importar o JSON do CDC de volta (reprocessar sem buscar a conversa): ideia registrada.
- Chamadas de ferramenta: ideia (DEC-011).

## Passos
1. `model?` no modelo canônico e no normalizador.
2. Exportador do Markdown simples, com fixture.
3. Exportador do JSON do CDC, com fixture.
4. Preferências (`settings.ts`): tipos, padrão congelado, leitura tolerante.
5. `buildExportDownloads`: os arquivos dos formatos marcados.
6. Popup: caixas, storage, um botão; permissão `storage`.
7. Conferência do dono no navegador e no Lunoda.
