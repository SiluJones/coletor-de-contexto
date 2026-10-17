# SPEC — MVP: exportar uma conversa do Claude para o Lunoda

> Fase F1 do ROADMAP. Decisões de base: DEC-001 a DEC-007.

## Problema
Hoje o dono copia à mão cada pedido e cada resposta de uma conversa do claude.ai para dentro do Lunoda, bloco a bloco (resultado típico: `mapsmith 12`, 7 blocos montados ao longo de 4 horas). É lento, sujeito a erro de cópia (markdown perdido, bloco esquecido) e desestimula registrar conversas inteiras.

## Critérios de aceite (verificáveis)
- [ ] **Oráculo do Lunoda (privado, DEC-009):** para cada par `.json` + `.md` exportado pelo Lunoda na pasta `CDC_LUNODA_ORACLE_DIR`, `renderLunodaJson(parseLunodaJson(json))` devolve o `.json` e `renderLunodaMd` devolve o `.md`, os dois byte a byte (fuso America/Sao_Paulo). Primeiro par: `mapsmith 12`, na pasta-pai do repo.
- [ ] **Par sintético (versionado):** a conversa de `src/tests/synthetic-conversation.ts` gera `src/tests/fixtures/lunoda/sintetico.json` e `.md` sem diferença de byte, e o `.json` lido de volta reproduz os dois.
- [ ] **IDs:** todo ID gerado tem 12 caracteres `[0-9a-z]`, e os 8 primeiros decodificam para um instante a até 1 s do momento da geração.
- [ ] **Adaptador Claude, fixture simples:** dada uma resposta bruta salva de `chat_conversations/{uuid}?tree=True&rendering_mode=messages&render_all_tools=true`, o adaptador devolve `Conversation` com os turnos na ordem, `text` em markdown e `thinking` preenchido quando a fixture tem item `thinking`.
- [ ] **Adaptador Claude, fixture com ramo:** numa conversa com um pedido editado, só o ramo até `current_leaf_message_uuid` aparece.
- [ ] **Pensamento:** com `includeThinking: true`, um turno com pensamento gera Prompt vN → Pensamento vN → Claude vN; com `false` (padrão), nenhum bloco «Pensamento».
- [ ] **Arquivos:** com `includeFiles: true` (padrão), um pedido com anexo termina com `**Arquivos anexados:**` e um item por arquivo; com `false`, o conteúdo fica só com o texto.
- [ ] **Conversa terminada em pedido sem resposta:** gera o bloco Prompt final sem bloco de resposta (como o bloco 7 do `mapsmith 12`).
- [ ] **Formato desconhecido:** fixture com campo essencial ausente gera erro com a mensagem «formato da conversa do Claude mudou», nunca um arquivo parcial.
- [ ] **No navegador:** com uma conversa aberta em `claude.ai/chat/<uuid>`, clicar no ícone e em «Exportar» baixa `<título-sanitizado>.json` e `<título-sanitizado>.md`.
- [ ] **No Lunoda:** o `.json` baixado importa sem erro e mostra os blocos na ordem, com subtítulos «Prompt»/«Claude» e versões por turno (conferência do dono).
- [ ] **Fora de conversa:** em qualquer outra página, o popup diz «abra uma conversa do Claude» e não oferece exportar.
- [ ] **Privacidade:** o build não faz nenhuma requisição a domínio que não seja `claude.ai` (conferir no manifesto e na aba Rede).

## Plataformas e formatos afetados
Adaptador Claude (novo); exportadores Lunoda JSON e Lunoda MD (novos); modelo canônico (novo — esboço no CONTEXT).

## Decisões de design
- Pensamento e arquivos já são capturados no modelo (DEC-005). Os exportadores recebem `ExportOptions` e respeitam os dois campos desde o MVP; o padrão é `DEFAULT_EXPORT_OPTIONS` (pensamento desligado, arquivos ligados — DEC-008). O controle no popup chega na F2; até lá vale o padrão.
- Formato do pensamento e da lista de arquivos no Lunoda: CONTEXT, «Formato Lunoda» (DEC-008).
- Título da entrada = título da conversa no Claude; nome do arquivo = título sanitizado para Windows.
- `createdAt`/`updatedAt` da entrada = horário da exportação (como no processo manual). Guardar as datas originais da conversa num campo próprio é ideia para a F2.

## Fora de escopo
Outras plataformas, várias conversas por vez, ramos alternativos, conteúdo de artefatos, binários, opções no popup, Firefox, publicação na Web Store.

## Passos
1. Scaffold WXT + TypeScript strict + Vitest + ESLint/Prettier; `npm run build` e `npm test` verdes vazios.
2. `core/ids.ts` e `core/dates.ts` com testes (ID base36; data local `dd/mm/aa HH:MM`).
3. `core/model.ts` com os tipos.
4. Exportador Lunoda MD + teste de ouro (par `mapsmith 12` ou par sintético — STATUS).
5. Exportador Lunoda JSON + teste de ida e volta.
6. Botão de depuração «salvar resposta bruta» (só em desenvolvimento) para capturar as fixtures reais do Claude.
7. Adaptador Claude + testes com as fixtures (simples, com ramo, com pensamento, formato quebrado).
8. Popup: detecção da conversa, botão exportar, download, mensagens de erro.
9. Conferência no navegador e importação no Lunoda pelo dono.
