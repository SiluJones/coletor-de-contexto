# LOG-TEMPLATE.md — Formato do Log do Dia

> **Referência fixa.** Este arquivo é o MOLDE — não é substituído.
> O log entra ao bater um gatilho de evento (cortar versão, registrar decisão ou bug grave, virar o dia), não «no fim».
> Arquivo: `logs/AAAA-MM-DD.md`. Duas conversas no mesmo dia = o MESMO arquivo, com `## Conversa N`.
> Os logs vivem em `logs/` no Git e não sobem ao Projeto (`.flatdropignore`); são lidos sob demanda.

---

# Log — AAAA-MM-DD

## Conversa N — <raia: chat | Code> — <tema em poucas palavras>

### Objetivo
O que se pretendia fazer ao começar.

### Feito
- Mudanças concretas: arquivos tocados, funções criadas, WOs escritas ou aplicadas.

### Plataformas e formatos tocados
- Qual adaptador (Claude, ChatGPT, Gemini) e qual exportador (Lunoda JSON, Lunoda MD) mudaram; se alguma fixture foi recapturada, de quando é a captura.

### Decisões
- Decisões tomadas → quais viraram DEC-N.

### Bugs
- Bugs encontrados/resolvidos → quais viraram FIX-N.

### Aprendizados / armadilhas
- O que vale virar armadilha no CONTEXT (especialmente mudança de formato de alguma plataforma).

### Onde parei
Estado exato ao encerrar + próximo passo óbvio. Alimenta a «Última conversa» do STATUS.

### Próximos passos
- Ações para o próximo turno.
