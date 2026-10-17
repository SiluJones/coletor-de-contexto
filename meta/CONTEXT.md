# CONTEXT.md — Coletor de Contexto (CDC)

> Arquivo **estável**. Descreve o que o projeto É; o que está acontecendo agora vive no STATUS.

---

## Visão Geral
Extensão de navegador (Chrome, Manifest V3) que transforma uma conversa aberta no claude.ai — e, depois, no ChatGPT e no Gemini — em arquivos de texto estruturados: **`.json` importável no Lunoda** e **`.md` no mesmo layout do export do Lunoda**. Substitui o processo manual de copiar mensagem por mensagem (pedido do usuário + resposta da IA) para dentro do Lunoda. Opcionalmente inclui o pensamento da IA e a lista de arquivos anexados/gerados. Roda 100% local, sob demanda, usando a sessão já logada do usuário.

## Stack Tecnológica
- **Linguagem:** TypeScript (strict).
- **Framework de extensão:** WXT (Manifest V3; gera Chrome e Firefox a partir do mesmo código) — DEC-006.
- **UI:** popup em HTML/TS puro no MVP; Preact só se a UI crescer.
- **Persistência:** `chrome.storage.local` só para preferências (nunca para conversas).
- **Testes:** Vitest com fixtures (respostas brutas salvas das APIs), par sintético versionado e oráculo privado do Lunoda fora do repositório (DEC-009).
- **Distribuição:** `.zip` carregado como extensão descompactada no início; Chrome Web Store é decisão futura (IDEAS).
- **Versões:** exatas no `package.json` (sem `^`). Trocar versão é decisão com motivo, não atualização de passagem.
- **Validação única:** `npm run check` = typecheck + lint + Prettier + testes + build.

## Estrutura do Projeto
```
coletor-de-contexto/
├── CLAUDE.md, .claude/          # arranque do Claude Code (skills apply-wo, wrap, sondar)
├── INSTRUCOES-DO-PROJETO.md     # fonte das Instruções do Projeto no claude.ai
├── meta/                        # arquivos de contexto (este, STATUS, DECISIONS…)
│   └── workorders/              # WOs chat → Code
├── specs/                       # uma spec por feature (AAMMDD-nome.md)
├── logs/                        # um arquivo por dia (AAAA-MM-DD.md)
└── src/                         # F1 (scaffold: wo0001)
    ├── entrypoints/             # popup, content script, background (convenção WXT)
    ├── adapters/                # claude.ts · chatgpt.ts · gemini.ts → Conversation
    ├── core/                    # model.ts (modelo canônico), ids.ts, dates.ts; testes *.test.ts ao lado
    ├── exporters/               # lunoda-types.ts · lunoda-build.ts (Conversation → entrada) · lunoda-json.ts · lunoda-md.ts
    └── tests/                   # synthetic-conversation.ts + fixtures/ (par sintético do Lunoda; respostas brutas na F1)
```

## Convenções de Código
- **Nomes:** arquivos, funções e variáveis em inglês; `camelCase` para funções/variáveis, `PascalCase` para tipos, arquivos em `kebab-case`.
- **Comentários:** PT-BR; docstring em função pública; comentário explica o porquê.
- **Commits:** PT-BR, imperativo curto, Conventional Commits (`feat(adapter-claude): ...`), **sem acento** (CMD do Windows).
- **Estilo:** ESLint + Prettier (configurados na F1).
- **Organização:** adaptador nunca conhece formato de saída; exportador nunca conhece plataforma.

## Como o pipeline funciona (CRÍTICO)

```
página aberta ──► adapter da plataforma ──► Conversation (modelo canônico) ──► exporter ──► download
                  (API interna; DOM é reserva)                                 (Lunoda JSON / Lunoda MD)
```

1. **Detecção:** o popup identifica a plataforma pela URL da aba (`claude.ai/chat/<uuid>`, `chatgpt.com/c/<id>`, `gemini.google.com/app/<id>`).
2. **Aquisição (adapter):** roda no contexto da página, com os cookies da sessão do usuário. No Claude, chama `GET /api/organizations` (acha a org com capacidade `chat`) e depois `GET /api/organizations/{org}/chat_conversations/{uuid}?tree=True&rendering_mode=messages&render_all_tools=true`. Essa resposta traz, por mensagem, um array `content` com itens `text`, `thinking` e `tool_use`/`tool_result`, além de anexos e arquivos. Sem `rendering_mode=messages` a resposta só tem texto achatado e perde partes — **não remova o parâmetro**. Endpoints não oficiais (ver Armadilhas).
3. **Ramo atual:** a conversa é uma árvore (edições e regenerações criam ramos). O adapter segue o caminho da raiz até a folha atual (`current_leaf_message_uuid`) e descarta os outros ramos no MVP.
4. **Normalização:** tudo vira o modelo canônico abaixo — o único contrato entre adapters e exporters.
5. **Exportação:** o exporter decide o que entra conforme as opções (pensamento sim/não, arquivos sim/não) e gera o arquivo. O modelo **sempre** guarda tudo; filtrar é papel do exporter (DEC-005).

### Modelo canônico (esboço — fecha na spec da F1)
```ts
interface Conversation {
  platform: 'claude' | 'chatgpt' | 'gemini';
  sourceId: string;          // uuid/id da conversa na plataforma
  title: string;
  url: string;
  createdAt: string;         // ISO 8601 UTC
  updatedAt: string;
  turns: Turn[];             // só o ramo atual
}
interface Turn {
  index: number;             // 1, 2, 3… — vira a "versão" no Lunoda
  user: Message;
  assistant?: Message;       // ausente quando a conversa termina num pedido sem resposta
}
interface Message {
  text: string;              // markdown, como a API devolve
  thinking: string[];        // blocos de pensamento, em ordem
  attachments: FileRef[];    // anexados pelo usuário
  generated: FileRef[];      // criados pela IA (artefatos, arquivos)
  createdAt?: string;
}
interface FileRef { name: string; kind: string; size?: number; textContent?: string; }
```

### Formato Lunoda — medido no par `mapsmith 12.json` / `.md` (2026-10-16)
**JSON:**
- Raiz: `{ "properties": [...], "entries": [...] }`. O arquivo é exatamente `JSON.stringify(doc, null, 2)`: LF, acentos crus (sem `\u`) e **sem quebra de linha no fim** (medido: o `mapsmith 12.json` é reproduzido byte a byte assim).
- `properties` padrão: `p-tags` "Tags" (opções `o1` Ideia/yellow, `o2` Pesquisa/blue, `o3` Geral/slate) e `p-ia` "IA Utilizada" (`o4` Claude/violet, `o5` Gemini/green, `o6` ChatGPT/orange).
- Cada entrada: `id`, `title`, `description`, `propertyValues` (`{"p-tags": [], "p-ia": []}`), `propertyAutoFlags` (`{}`), `blocks`, `createdAt`, `updatedAt`.
- Cada bloco: `id`, `subtitle`, `version`, `content`, `blockProps` (`{}`).
- **Um bloco por mensagem.** Pedido do usuário → `subtitle: "Prompt"`; resposta → `subtitle: "Claude"` (nome da IA). `version` = número do turno: Prompt v1, Claude v1, Prompt v2…
- **IDs:** 12 caracteres = `Date.now().toString(36)` (8) + 4 caracteres aleatórios em base36. Ex.: `mtke7wavx3ge` decodifica para 2026-09-02T17:51:44.455Z, 4 ms depois do `createdAt` da entrada.
- `content` é o markdown cru da mensagem.
- **Pensamento** (quando exportado — DEC-008): bloco próprio com `subtitle: "Pensamento"` e a mesma `version` do turno, entre o pedido e a resposta: Prompt v1 → Pensamento v1 → Claude v1.
- **Arquivos** (exportados por padrão — DEC-008): lista no fim do `content` do bloco da mensagem a que pertencem, depois de uma linha em branco — `**Arquivos anexados:**` no bloco Prompt, `**Arquivos gerados:**` no bloco da resposta — com um item por arquivo: `` - `nome.ext` — tipo, tamanho ``.

**MD:**
- Front matter: `title`, `id`, `created`, `updated` (ISO UTC, entre aspas) e `blocks` (número).
- `# <título>`, depois `<!-- ENTRADA -->` e os campos ID / Criado em / Modificado em / Total de blocos, com datas em **hora local `dd/mm/aa HH:MM`** e quebra de linha por **dois espaços no fim da linha**.
- Separador: linha com **40 × `━`** (U+2501), após o cabeçalho e após cada bloco (7 blocos → 8 separadores).
- Cada bloco: `## [Bloco N] <subtítulo> · v<versão>`, `<!-- BLOCO N -->`, Subtítulo/Versão (dois espaços no fim), `**Conteúdo:**`, e o conteúdo entre `<!-- CONTEUDO:INICIO bloco=N -->` e `<!-- CONTEUDO:FIM bloco=N -->`.
- O Lunoda importa só o JSON hoje; o MD é para leitura humana e para um importador futuro — os marcadores HTML já o tornam parseável.

## Arquitetura — pontos-chave
- Extensão MV3, não userscript nem app desktop — DEC-001.
- API interna do site primeiro, DOM como reserva, um adaptador por plataforma — DEC-002.
- Modelo canônico próprio; o Lunoda é um exportador, não o modelo — DEC-003.
- Saída JSON e MD espelham o par `mapsmith 12` — DEC-004.
- Pensamento e arquivos: sempre capturados, exportados por opção; arquivo nunca em binário — DEC-005.
- `version` = turno; pensamento em bloco próprio; primeiro uso com pensamento desligado e arquivos ligados — DEC-008.
- TypeScript + WXT + Vitest — DEC-006.
- Tudo local, sob demanda, sem backend, sem varredura em segundo plano — DEC-007.

## Armadilhas Conhecidas (o que NÃO fazer)
1. **Tratar endpoint interno como contrato** — `/api/organizations/...` (Claude) e `/backend-api/...` (ChatGPT) não são documentados e mudam sem aviso → isolar cada um num adapter, com fixture e teste, e mostrar erro claro («formato da plataforma mudou») em vez de exportar meia conversa.
2. **Raspar o DOM quando há API** — o DOM entrega HTML renderizado (perde o markdown original: código, tabelas, listas) e quebra a cada redesign → DOM só onde não há alternativa (Gemini).
3. **Achatar a árvore da conversa** — percorrer todas as mensagens em ordem mistura ramos abandonados com o ramo atual → seguir o caminho até `current_leaf_message_uuid`.
4. **Gerar datas do MD em UTC** — o Lunoda escreve o cabeçalho em hora local (`02/09/26 14:51` para `17:51Z` em UTC-3) → ISO UTC no front matter e no JSON, hora local só nos campos «Criado em/Modificado em».
5. **Perder os dois espaços no fim da linha** — editor ou formatter que remove espaço final quebra o layout do MD → excluir os exporters e as fixtures `.md` do trim automático e cobrir no teste de ouro.
6. **Varrer o histórico em segundo plano** — automação contínua de endpoint interno é área cinzenta nos Termos de Uso e chama limitação de taxa → só sob demanda, uma conversa por clique no MVP (DEC-007).
7. **Título como nome de arquivo cru** — título com `: ? / \ * " < > |` quebra o download no Windows → sanitizar o nome do arquivo, nunca o `title` do conteúdo.
8. **`npm install` antes de existir entrypoint** — o `postinstall` roda `wxt prepare`, que falha com «No entrypoints found» se `src/entrypoints/` estiver vazio → em projeto novo, criar os arquivos antes de instalar.
9. **Subir o TypeScript para a versão mais nova** — em 2026-10-16 o `typescript-eslint` 8.71 exigia `typescript <6.1.0`, e a mais nova era a 7.0 → o projeto fixa a 6.0; só subir quando o `typescript-eslint` aceitar (`npm view typescript-eslint peerDependencies`).
10. **Formatar Markdown com Prettier ou editor que apaga espaço final** — destrói a quebra de linha do MD do Lunoda → `.prettierignore` exclui `**/*.md` e o `.editorconfig` desliga o trim em `*.md`; não remover nenhum dos dois.
11. **Esperar que o `npm run dev` abra um Chrome sozinho** — no WXT 0.21 o `web-ext` é dependência opcional e não vem instalado; sem ele o dev server só avisa «Load .output\chrome-mv3-dev as an unpacked extension manually» (medido em 2026-10-16) → carregar à mão em `chrome://extensions` no Chrome de uso diário. É o certo para este projeto: o adaptador usa a sessão logada do claude.ai, que um perfil novo aberto pelo `web-ext` não teria.
12. **Arquivo de configuração fora do Prettier entrar no `prettier --check`** — o `.claude/settings.json` entregue pelo chat reprovou o `npm run check` da wo0001, e o dono escolheu formatá-lo → todo JSON/TS que o chat entrega passa antes pelo `prettier --check` com a config do repositório (o `.prettierrc.json`), inclusive o que vai para `.claude/`.
13. **Conversa real como fixture** — o repositório é público (DEC-009) → fixture versionada é sempre sintética; par real do Lunoda vive fora do repo e entra só pelo `CDC_LUNODA_ORACLE_DIR`.

## 📁 Arquivos Críticos (não mexer sem contexto)
- `meta/CEREBRO.md` — comportamento do assistente; mudança aqui muda como todo turno trabalha.
- `src/core/model.ts` *(F1)* — contrato entre adapters e exporters; mudar um campo afeta os dois lados.
- `src/exporters/lunoda-json.ts` *(F1)* — contrato com o Lunoda; reler «Formato Lunoda» acima antes de tocar.
- `src/tests/fixtures/` — fixture alterada à mão mascara quebra real da plataforma; só se regrava capturando de novo. O par `lunoda/sintetico.*` é gravado pelo Vitest (`toMatchFileSnapshot`): para regravar de propósito, `npx vitest run -u` e o diff explicado no commit.

## Contexto de Produto
- **Usuário-alvo:** o dono do projeto — usa o Claude intensamente em projetos longos com handoff entre conversas e guarda as conversas no Lunoda. Público externo é hipótese futura.
- **Dor que resolve:** copiar à mão cada pedido e cada resposta para dentro do Lunoda, bloco a bloco.
- **O que é sucesso:** um clique na conversa aberta gera um `.json` que o Lunoda importa e que fica igual ao que o dono montaria à mão, mais o `.md` correspondente.
- **O que o projeto deliberadamente NÃO é:** serviço de backup na nuvem, sincronizador, robô que varre todo o histórico sozinho, cliente de chat alternativo, nem exportador de PDF.
