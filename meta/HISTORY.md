# HISTORY.md — Conhecimento Consolidado

> Conhecimento denso que já foi apurado e não muda mais. Lido sob demanda, não no início da conversa.

---

## 1. Pesquisa do estado da arte (2026-10-16)
Feita antes de fixar DEC-001/002/007, para não reinventar e para achar onde a ideia já falhou para os outros.

**Claude — extensões existentes:**
- Uma extensão de backup documentada pelo autor não raspa o DOM: chama a API interna que a própria página usa, descoberta pelo DevTools. Endpoints: `/api/organizations`, `/api/organizations/{org}/chat_conversations?limit=&offset=` e `/api/organizations/{org}/chat_conversations/{id}?tree=True&rendering_mode=messages&render_all_tools=true`. Autenticação: nenhuma além dos cookies da sessão. Com `rendering_mode=messages` cada resposta vem como array `content` com itens `text`, `thinking` e de ferramenta; sem ele, só texto achatado, e algumas respostas somem. O autor admite área cinzenta nos Termos de Uso, roda backup a cada 8 h e não trata anexos. Fonte: <https://thirdbear.substack.com/p/backing-up-your-claude-conversations>.
- Há pelo menos duas extensões «Claude Exporter» de código aberto (MIT): uma exporta em lote (JSON/MD/TXT em zip) e relata erro 403 com VPN e lentidão por limite de taxa; a outra exporta uma conversa por vez com pensamento, artefatos, anexos e ramos. Fonte: <https://www.fast.io/resources/claude-exporter-conversation-export-guide.md>.

**Gemini:**
- Sem export oficial utilizável: o Takeout traz configuração e metadados, não as mensagens; «Exportar para Docs» é uma conversa por vez e não estruturado. As extensões leem o DOM com rolagem automática e quebram quando o Google muda a interface. Fontes: <https://ai-chat-importer.com/blog/why-gemini-is-not-supported>, <https://github.com/jujusharp/gemini-export> (este extrai blocos de pensamento quando aparecem).

**ChatGPT:**
- **Não conferido nesta pesquisa** (vem de memória; a busca só devolveu os títulos): exportadores usariam `/backend-api/conversation/{id}`, com a conversa em árvore (`mapping`) — a mesma questão de ramo atual do Claude. Pontos de partida para conferir na F3: <https://github.com/hoya98/chatgpt-export>, <https://levelup.gitconnected.com/your-chatgpt-history-is-a-tree-not-a-transcript-2026-5660ceb301d4>.

**O que se tirou disso:** API interna onde existe (DEC-002); seguir só o ramo atual; pensamento é capturável no Claude e às vezes no Gemini; uso sob demanda em vez de backup periódico (DEC-007); erro de formato tem de ser visível.

## 2. Anatomia do processo manual (2026-10-16)
Medido no par `C:\Users\alexk\Tools\CDC\mapsmith 12.json` / `.md`:
- 1 entrada, 7 blocos alternando Prompt e Claude (v1 a v4; o último Prompt ficou sem resposta).
- Os IDs dos blocos decodificam para 13:44–15:16 UTC de 2026-09-02 e o da entrada para 17:51 UTC: os blocos foram criados à medida que eram colados e a entrada no fim — retrato do trabalho manual que o CDC substitui.
- `propertyValues` vazias (nem `p-ia` marcado) e nenhum pensamento, anexo ou arquivo registrado.
- MD: LF, sem BOM, 40 × `━` por separador, 8 separadores, dois espaços no fim das linhas de metadado, datas locais `dd/mm/aa HH:MM` no corpo e ISO UTC no front matter.
