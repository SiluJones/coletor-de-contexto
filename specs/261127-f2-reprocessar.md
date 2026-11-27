# SPEC — F2: reprocessar arquivos guardados

> Leva da F2 aprovada pelo dono em 2026-11-26, logo depois da resposta bruta como formato (DEC-015, wo0011, conferida no navegador em 2026-11-27). A WO de aplicação ainda não existe.

## Problema
O dono guarda as conversas em `- Histórico - <projeto> (CDC)/`: hoje 141 conversas em 49 pastas, e daqui em diante só a resposta bruta e o `(simples).md` (DEC-015). Quando precisar de outro formato — o Lunoda, o `.cdc.json`, o `(simples).md` com outras opções, ou um formato que ainda não existe —, a única saída é exportar de novo, e só enquanto a conversa existir no claude.ai. A bruta já tem tudo; falta o caminho para gerar dela.

## O que foi medido (2026-11-27, pelo chat, nos históricos reais, só leitura)
- **Da bruta:** gerar o `(simples).md` das 140 brutas guardadas dá o `(simples).md` guardado ao lado, igual linha a linha, fora a data de exportação, em **128 de 140**. As 12 restantes (GameDataHub e Mapoteca) diferem **só** no tamanho de imagens anexadas (`— image` contra `— image, 183,6 KB`), nas duas direções. Hipótese, não conferida: antes da wo0011 a bruta e o `(simples).md` vinham de duas buscas, e a API às vezes devolve o `size_bytes` da imagem e às vezes não. Desde a wo0011 os dois saem da mesma busca.
- **Do `.cdc.json`:** gerar o `(simples).md` dos 141 `.cdc.json` guardados (todos `coletor-de-contexto` versão 1) dá o guardado em **141 de 141**, fora a data.
- O teste das capturas reais, na regra da wo0011, passa nas 140 brutas (153 de 153).

## Critérios de aceite (verificáveis)
- [ ] O popup tem o botão «Reprocessar arquivos guardados…», que abre a página da extensão `reprocess.html` numa aba nova, **com ou sem conversa do Claude aberta**.
- [ ] A página aceita vários arquivos de uma vez (escolher ou arrastar), `.json`, e reconhece cada um: **resposta bruta do Claude** (objeto com `chat_messages`) → normalizador; **JSON do CDC** (`format: "coletor-de-contexto"`, `version: 1`) → a `conversation` dele. Outro conteúdo → erro só daquele arquivo, com o nome dele; os outros seguem.
- [ ] Formatos de saída: Markdown simples, Lunoda (`.json` + `.md`) e JSON do CDC, com as opções de pensamento e de arquivos; a caixa «Resposta bruta» não existe na página (a bruta é a entrada). Caixas e opções começam com as preferências salvas do popup (`cdc.exportSettings`) e a mudança fica salva lá — uma preferência só.
- [ ] Os arquivos saem com os mesmos nomes do «Exportar» (o título na frente), em `Downloads/cdc-reprocessado/<AAMMDD-HHMM>/` — uma subpasta por rodada, para não misturar com as exportações.
- [ ] Dada a resposta sintética do Claude, os arquivos reprocessados são iguais aos do «Exportar» com as mesmas opções e o mesmo `now` (fixtures `sintetico-claude.*` sem mudança).
- [ ] Dado o `.cdc.json` da fixture sintética, o `(simples).md` reprocessado é igual à fixture `sintetico-claude.simples.md`.
- [ ] Arquivo que não é JSON, JSON que não é nenhum dos dois, e bruta com formato quebrado (`ClaudeFormatError`) → erro daquele arquivo, mensagem clara, nada baixado para ele.
- [ ] A página lista o resultado por arquivo: título, turnos e arquivos gerados, ou o erro.
- [ ] Nenhuma permissão nova (já há `downloads` e `storage`).
- [ ] `npm run check` verde.
- [ ] Medição de fidelidade, repetível: um teste ligado por variável de ambiente (como o das capturas), apontado para uma pasta de pares bruta + `(simples).md`, confere que o reprocessado é igual ao guardado, fora a data de exportação e o tamanho de imagem.
- [ ] No navegador (dono): reprocessar uma bruta e um `.cdc.json` de um histórico real e abrir o `(simples).md` gerado.

## Plataformas e formatos afetados
- Página nova `src/entrypoints/reprocess/index.html` + `main.ts` (o WXT faz dela a `reprocess.html`, tipo «unlisted-page» — conferido em `node_modules/wxt`, `find-entrypoints.mjs`, glob `*/index.html`).
- Parte pura nova (ex.: `src/popup/reprocess.ts`): reconhecer o arquivo e gerar os downloads a partir de uma `Conversation`. Para isso, `buildExportDownloads` se divide em «da conversa» e «da resposta bruta», sem mudar o resultado.
- Popup: um botão. Nenhum exportador muda; nenhuma fixture muda.

## Decisões de design
- **Página da extensão, não o popup:** o popup fecha quando perde o foco, e escolher arquivos tira o foco dele. A página fica aberta numa aba e aguenta um lote.
- **Aceitar também o `.cdc.json`:** a DEC-015 fez da bruta a fonte, mas as 141 conversas antigas têm `.cdc.json`, e 1 delas não tem bruta. Custa um ramo a mais no reconhecimento; a medição mostrou o `.cdc.json` fiel (141 de 141).
- **Saída em subpasta de Downloads:** a extensão só escreve em Downloads (`chrome.downloads`); não dá para gravar ao lado do arquivo de origem.
- **`now` = hora do reprocessamento:** a «Exportada em» do `(simples).md` e o `exportedAt` do `.cdc.json` dizem quando o arquivo foi gerado. A data da conversa continua a de criação.
- Registro: DEC-016 quando a WO sair.

## Fora de escopo
- Escolher uma pasta inteira (`webkitdirectory`) e varrer subpastas: o primeiro passo é a lista de arquivos; a pasta fica como ideia.
- Gravar ao lado da origem; apagar ou mover arquivos do histórico.
- Levar o conteúdo dos arquivos criados pela IA para o `(simples).md` (item «conteúdo dos artefatos gerados» da F2; a bruta já tem o dado).
- Outras plataformas (F3).

## Passos
1. Dividir `buildExportDownloads` (da conversa / da bruta), sem mudar fixture.
2. Parte pura do reprocessar: reconhecer o arquivo, gerar os downloads, erro por arquivo; testes (sintética, `.cdc.json` sintético, entradas ruins).
3. Página `reprocess` e o botão no popup.
4. Teste de fidelidade por variável de ambiente.
5. Conferência do dono no navegador.
