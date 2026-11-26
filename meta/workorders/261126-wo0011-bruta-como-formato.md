# WO 0011 — resposta bruta como formato do «Exportar» (DEC-015)

> **Tipo:** mista — código (popup, settings, raw-dump, testes) + registro (DECISIONS, IDEAS, STATUS, CHANGELOG).
> **Config sugerida:** Sonnet · `/effort` médio — edições com âncora já simuladas; a rede é o `npm run check`.
> **Pré-requisito:** HEAD `dff2f4e` («docs: analisa os formatos de exportacao por conversa»). `git status --short` mostra exatamente:
> ` M README.md`, ` M logs/2026-11-26.md`, ` M meta/CONTEXT.md`, ` M meta/analises/261126-ANALISE-formatos-de-exportacao.md`,
> `?? meta/workorders/261126-wo0011-bruta-como-formato.md`, `?? specs/261126-f2-bruta-como-formato.md` — e nada além. `npm run check` verde antes.
> **Base:** spec `specs/261126-f2-bruta-como-formato.md`; análise `meta/analises/261126-ANALISE-formatos-de-exportacao.md` (decidida pelo dono em 2026-11-26).
> **Arquivos que o chat gravou no disco e esta WO versiona** (sha1 medido ao gravar):
> - `specs/261126-f2-bruta-como-formato.md` — `79ce473664c0674b1f24244bbebff1c3839376ec`
> - `meta/CONTEXT.md` — `8ef299d873d351508a822f28dc06adb843eb975f`
> - `README.md` — `a1f08ab53158e1653be6c2635276306a6f33084b`
> - `meta/analises/261126-ANALISE-formatos-de-exportacao.md` — `653dbe021a8cfbc44ba39d43201d268160c87412`
> - `logs/2026-11-26.md` — `65a81f26439b74add8a7c3853b5423bf9a8be4c4`
>
> A Edição 0 roda `sha1sum` neles ANTES de tudo: hash diferente = **PARE e reporte**.
> **Âncora semântica:** se um trecho-âncora não bater EXATAMENTE, **PARE e reporte**. Delimite âncora e texto novo pela cerca de QUATRO crases.
> **Idempotência:** antes de cada edição, procure o texto NOVO INTEIRO; se ele já está no arquivo e a âncora não, PULE e diga no relatório.
> **Âncoras lidas em:** 2026-11-26, HEAD `dff2f4e`, pelo chat, neste turno: as âncoras de código foram RECORTADAS por script do arquivo
> do repositório (cada uma conferida com 1 ocorrência no arquivo original, com pelo menos uma linha de contexto, sem linha em branco
> nas bordas); as de documento, lidas de `meta/DECISIONS.md` («## DEC-010 —», «## DEC-012 —», última linha da DEC-014), `meta/IDEAS.md`
> («### 2026-10-17 — Reprocessar a partir do JSON do CDC», «- **Botão de depuração»), `meta/STATUS.md` («- **F2:**», «- [ ] Olhar as
> exportações», «**2026-11-26** —») e `meta/CHANGELOG.md` («- Licença MIT», «- Kit de contexto (KCM)»).
> **Simulação:** o chat aplicou esta WO a partir do PRÓPRIO TEXTO numa cópia do repositório: os 10 arquivos de código saíram iguais
> byte a byte à versão validada (`npm ci` limpo + `npm run check`: 98 passed, 2 skipped, build ok).
> **Próximo comando:** (nenhum — o roteiro do dono vai no chat).

> **Canal dos meta neste ciclo = CODE** para DECISIONS, IDEAS, STATUS e CHANGELOG (Edições D1 a D10). CONTEXT, README, spec,
> análise e log o chat já gravou: só entram no `git add`.

---

## 1. Por que

O dono exportava 5 arquivos por conversa; o único sem perda é a resposta bruta, que só saía de um botão de depuração. Decisão (DEC-015):
a bruta vira formato do «Exportar», salva antes de normalizar, e o padrão passa a «simples + bruta». O teste das capturas reais supunha
que toda resposta da IA tem texto — falso em 155 turnos de 21 de 50 conversas reais —, e é corrigido na mesma leva.

## 2. Contexto factual

- **[medido pelo chat, 2026-11-26]** 51 conversas exportadas em 28 projetos; só a bruta guarda ferramentas (12,1 + 14,1 milhões de caracteres) e ramos (52 mensagens); os projetos só leem o `(simples).md`.
- **[medido]** Teste de capturas reais com as 50 brutas dos projetos: 21 reprovam na regra antiga; na regra nova, 63 de 63 passam; com o normalizador quebrado de propósito (texto ignorado), 52 de 63 reprovam. As 7 capturas do CDC (`../capturas-claude/cdc-raw`): 20 de 20 passam.
- **[relatado pelo dono, 2026-11-26]** Não importa mais no Lunoda; «bruta + simples»; aprova a bruta como formato e o reprocessar logo depois.

---

## Edição 0 — conferência, sem editar

```
git log -1 --oneline
git status --short
sha1sum specs/261126-f2-bruta-como-formato.md meta/CONTEXT.md README.md meta/analises/261126-ANALISE-formatos-de-exportacao.md logs/2026-11-26.md
npm run check
```

Esperado: HEAD `dff2f4e`; o `git status` do pré-requisito; os 5 hashes iguais aos do cabeçalho; `npm run check` verde (94 passed, 2 skipped). Divergência: PARE.

---

## Edição 1 — `src/popup/settings.ts` · trecho 1 de 4

**Âncora:**

````
  simpleMd: boolean;
  /** JSON do CDC: a conversa inteira, para guardar e reprocessar. */
  cdcJson: boolean;
}
````

**Substituir por:**

````
  simpleMd: boolean;
  /** JSON do CDC: a conversa normalizada inteira. */
  cdcJson: boolean;
  /** Resposta bruta da API, como veio: o unico formato sem perda (DEC-015). */
  raw: boolean;
}
````

## Edição 2 — `src/popup/settings.ts` · trecho 2 de 4

**Âncora:**

````
/** Primeiro uso: so o Lunoda, sem pensamento, com arquivos (DEC-008). */
export const DEFAULT_SETTINGS: Readonly<ExportSettings> = Object.freeze({
  ...DEFAULT_EXPORT_OPTIONS,
  formats: Object.freeze({ lunoda: true, simpleMd: false, cdcJson: false }),
});
````

**Substituir por:**

````
/** Primeiro uso: Markdown simples + resposta bruta (DEC-015), sem pensamento, com arquivos (DEC-008). */
export const DEFAULT_SETTINGS: Readonly<ExportSettings> = Object.freeze({
  ...DEFAULT_EXPORT_OPTIONS,
  formats: Object.freeze({ lunoda: false, simpleMd: true, cdcJson: false, raw: true }),
});
````

## Edição 3 — `src/popup/settings.ts` · trecho 3 de 4

**Âncora:**

````
      cdcJson: bool(f.cdcJson, d.formats.cdcJson),
    },
````

**Substituir por:**

````
      cdcJson: bool(f.cdcJson, d.formats.cdcJson),
      raw: bool(f.raw, d.formats.raw),
    },
````

## Edição 4 — `src/popup/settings.ts` · trecho 4 de 4

**Âncora:**

````
  };
}

````

**Substituir por:**

````
  };
}

/**
 * Algum formato marcado precisa da conversa normalizada? A resposta bruta sozinha nao precisa:
 * ela sai como veio, mesmo quando o formato do site mudou e o normalizador falharia.
 */
export function needsNormalization(formats: ExportFormats): boolean {
  return formats.lunoda || formats.simpleMd || formats.cdcJson;
}

````

## Edição 5 — `src/popup/settings.test.ts` · trecho 1 de 4

**Âncora:**

````
import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings } from './settings';

describe('parseSettings', () => {
  it('sem nada salvo -> padrao do primeiro uso (so Lunoda, sem pensamento, com arquivos)', () => {
    expect(parseSettings(undefined)).toEqual({
````

**Substituir por:**

````
import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, needsNormalization, parseSettings } from './settings';

describe('parseSettings', () => {
  it('sem nada salvo -> padrao do primeiro uso (simples + bruta, sem pensamento, com arquivos)', () => {
    expect(parseSettings(undefined)).toEqual({
````

## Edição 6 — `src/popup/settings.test.ts` · trecho 2 de 4

**Âncora:**

````
      includeFiles: true,
      formats: { lunoda: true, simpleMd: false, cdcJson: false },
    });
````

**Substituir por:**

````
      includeFiles: true,
      formats: { lunoda: false, simpleMd: true, cdcJson: false, raw: true },
    });
````

## Edição 7 — `src/popup/settings.test.ts` · trecho 3 de 4

**Âncora:**

````
      includeFiles: false,
      formats: { lunoda: false, simpleMd: true, cdcJson: true },
    };
````

**Substituir por:**

````
      includeFiles: false,
      formats: { lunoda: false, simpleMd: true, cdcJson: true, raw: false },
    };
````

## Edição 8 — `src/popup/settings.test.ts` · trecho 4 de 4

**Âncora:**

````
  it('completa campo ausente ou com tipo errado com o padrao, sem lancar', () => {
    expect(parseSettings({ includeThinking: 'sim', formats: { simpleMd: true } })).toEqual({
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: true, cdcJson: false },
    });
    expect(parseSettings('lixo')).toEqual(parseSettings(undefined));
  });
````

**Substituir por:**

````
  it('completa campo ausente ou com tipo errado com o padrao, sem lancar', () => {
    expect(parseSettings({ includeThinking: 'sim', formats: { lunoda: true } })).toEqual({
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: true, cdcJson: false, raw: true },
    });
    expect(parseSettings('lixo')).toEqual(parseSettings(undefined));
  });

  it('preferencia salva antes da caixa da bruta existir ganha a bruta ligada', () => {
    const v010 = {
      includeThinking: true,
      includeFiles: true,
      formats: { lunoda: true, simpleMd: true, cdcJson: true },
    };
    expect(parseSettings(v010).formats).toEqual({
      lunoda: true,
      simpleMd: true,
      cdcJson: true,
      raw: true,
    });
  });

  it('so a bruta nao precisa normalizar; qualquer outro formato precisa', () => {
    const none = { lunoda: false, simpleMd: false, cdcJson: false, raw: false };
    expect(needsNormalization({ ...none, raw: true })).toBe(false);
    expect(needsNormalization({ ...none, simpleMd: true })).toBe(true);
    expect(needsNormalization({ ...none, lunoda: true })).toBe(true);
    expect(needsNormalization({ ...none, cdcJson: true })).toBe(true);
  });
````

## Edição 9 — `src/popup/raw-dump.ts` · trecho 1 de 3

**Âncora:**

````
/**
 * Partes puras do botao de depuracao «Salvar resposta bruta» (passo 6 da spec, DEC-010).
 */
````

**Substituir por:**

````
/**
 * Partes puras do formato «Resposta bruta» do «Exportar» (DEC-015; antes, botao de depuracao — DEC-010).
 */
````

## Edição 10 — `src/popup/raw-dump.ts` · trecho 2 de 3

**Âncora:**

````
import { safeFileName } from '../core/filename';
````

**Substituir por:**

````
import { safeFileName } from '../core/filename';
import type { DownloadFile } from './export';
````

## Edição 11 — `src/popup/raw-dump.ts` · trecho 3 de 3

**Âncora:**

````
  };
}

````

**Substituir por:**

````
  };
}

/**
 * Arquivo da resposta bruta: o texto EXATAMENTE como veio da API, sem reformatar (DEC-015).
 * @param text corpo da resposta, como veio.
 * @param title o `name` da conversa (de `summarizeRaw`), se houver.
 */
export function rawDownloadFile(
  text: string,
  conversationId: string,
  now: Date,
  title?: string,
): DownloadFile {
  return {
    filename: rawDumpFilename(conversationId, now, title),
    content: text,
    mime: 'application/json',
  };
}

````

## Edição 12 — `src/popup/raw-dump.test.ts` · trecho 1 de 2

**Âncora:**

````
import { describe, expect, it } from 'vitest';
import { rawDumpFilename, summarizeRaw } from './raw-dump';
````

**Substituir por:**

````
import { describe, expect, it } from 'vitest';
import { rawDownloadFile, rawDumpFilename, summarizeRaw } from './raw-dump';
````

## Edição 13 — `src/popup/raw-dump.test.ts` · trecho 2 de 2

**Âncora:**

````
    expect(summarizeRaw('[1,2]')).toMatchObject({ ok: false });
  });
});

````

**Substituir por:**

````
    expect(summarizeRaw('[1,2]')).toMatchObject({ ok: false });
  });
});

describe('rawDownloadFile', () => {
  it('leva o texto byte a byte, sem reformatar, em cdc-raw/', () => {
    const text = '{"name":"CDC 1",  "chat_messages":[]}\n';
    expect(rawDownloadFile(text, ID, NOW, 'CDC 1')).toEqual({
      filename: 'cdc-raw/CDC 1 — claude-d41adc75-20261017T012325Z.json',
      content: text,
      mime: 'application/json',
    });
  });
});

````

## Edição 14 — `src/popup/export.ts` · trecho 1 de 1

**Âncora:**

````
/**
 * Monta TODOS os arquivos dos formatos marcados, com nomes que comecam pelo titulo da conversa:
 * `<titulo>.json` + `<titulo>.md` (Lunoda), `<titulo> (simples).md` e `<titulo>.cdc.json`.
 * Nenhum formato marcado -> lista vazia (o popup avisa).
 * @throws ClaudeFormatError quando o formato da resposta mudou.
````

**Substituir por:**

````
/**
 * Monta os arquivos dos formatos que dependem da conversa normalizada, com nomes que comecam pelo
 * titulo: `<titulo>.json` + `<titulo>.md` (Lunoda), `<titulo> (simples).md` e `<titulo>.cdc.json`.
 * A resposta bruta NAO passa por aqui: o popup a salva antes, com `rawDownloadFile` (DEC-015).
 * Nenhum desses formatos marcado -> lista vazia.
 * @throws ClaudeFormatError quando o formato da resposta mudou.
````

## Edição 15 — `src/popup/export.test.ts` · trecho 1 de 3

**Âncora:**

````
    includeFiles: true,
    formats: { lunoda: true, simpleMd: true, cdcJson: true },
  };
````

**Substituir por:**

````
    includeFiles: true,
    formats: { lunoda: true, simpleMd: true, cdcJson: true, raw: true },
  };
````

## Edição 16 — `src/popup/export.test.ts` · trecho 2 de 3

**Âncora:**

````
  it('padrao do primeiro uso -> so os 2 do Lunoda, iguais aos do buildLunodaExport', () => {
    const d = buildExportDownloads(
````

**Substituir por:**

````
  it('so Lunoda -> os 2 do Lunoda, iguais aos do buildLunodaExport', () => {
    const onlyLunoda = {
      ...DEFAULT_SETTINGS,
      formats: { lunoda: true, simpleMd: false, cdcJson: false, raw: false },
    };
    const d = buildExportDownloads(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      onlyLunoda,
      ctx(),
      'America/Sao_Paulo',
    );
    const l = buildLunodaExport(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      onlyLunoda,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(d.files.map((f) => f.content)).toEqual([l.json, l.md]);
  });

  it('padrao do primeiro uso -> so o Markdown simples (a bruta sai pelo popup, antes)', () => {
    const d = buildExportDownloads(
````

## Edição 17 — `src/popup/export.test.ts` · trecho 3 de 3

**Âncora:**

````
    );
    const l = buildLunodaExport(
      structuredClone(SYNTHETIC_CLAUDE_RAW),
      DEFAULT_SETTINGS,
      ctx(),
      'America/Sao_Paulo',
    );
    expect(d.files.map((f) => f.content)).toEqual([l.json, l.md]);
  });

  it('nenhum formato marcado -> nenhum arquivo', () => {
    const none = { ...all, formats: { lunoda: false, simpleMd: false, cdcJson: false } };
    expect(buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), none, ctx()).files).toEqual(
````

**Substituir por:**

````
    );
    expect(d.files.map((f) => f.filename)).toEqual(['Sintética 1 — contar palavras (simples).md']);
  });

  it('nenhum formato normalizado marcado (so a bruta) -> nenhum arquivo aqui', () => {
    const none = { ...all, formats: { lunoda: false, simpleMd: false, cdcJson: false, raw: true } };
    expect(buildExportDownloads(structuredClone(SYNTHETIC_CLAUDE_RAW), none, ctx()).files).toEqual(
````

## Edição 18 — `src/popup/copy.test.ts` · trecho 1 de 1

**Âncora:**

````
  includeFiles: true,
  formats: { lunoda: false, simpleMd: false, cdcJson: false },
};
````

**Substituir por:**

````
  includeFiles: true,
  formats: { lunoda: false, simpleMd: false, cdcJson: false, raw: false },
};
````

## Edição 19 — `src/adapters/claude/normalize.test.ts` · trecho 1 de 2

**Âncora:**

````
  it.each(captures)('%s: normaliza sem erro e sem turno vazio', (file) => {
````

**Substituir por:**

````
  // Resposta da IA sem texto existe de verdade: a IA trabalha so com ferramentas e para, e o dono
  // manda «Continuar» (155 turnos em 21 de 50 conversas reais, 2026-11-26). Ela tem pensamento.
  // O que nao pode: resposta sem texto, sem arquivo e sem pensamento, e conversa sem NENHUM texto da
  // IA — este e o sintoma da armadilha 15 (ler o campo `text`, que vem vazio).
  it.each(captures)('%s: normaliza sem erro e sem turno vazio', (file) => {
````

## Edição 20 — `src/adapters/claude/normalize.test.ts` · trecho 2 de 2

**Âncora:**

````
      if (t.assistant) {
        expect(t.assistant.text !== '' || t.assistant.generated.length > 0).toBe(true);
      }
    }
````

**Substituir por:**

````
      if (t.assistant) {
        const a = t.assistant;
        expect(a.text !== '' || a.generated.length > 0 || a.thinking.length > 0).toBe(true);
      }
    }
    if (c.turns.some((t) => t.assistant)) {
      expect(c.turns.some((t) => (t.assistant?.text ?? '') !== '')).toBe(true);
    }
````

## Edição 21 — `src/entrypoints/popup/main.ts` · trecho 1 de 11

**Âncora:**

````
// Popup da extensao (F1 + F2). Reconhece a conversa do Claude e oferece:
// - «Exportar»: baixa os formatos marcados (Lunoda, Markdown simples, JSON do CDC — DEC-011, DEC-012);
// - «Copiar conversa» / «Copiar última resposta»: poe o texto na area de transferencia (DEC-013);
// - «Salvar resposta bruta (depuracao)»: baixa a resposta da API como veio (DEC-010).
// Formatos e opcoes ficam lembrados em chrome.storage.local.
````

**Substituir por:**

````
// Popup da extensao (F1 + F2). Reconhece a conversa do Claude e oferece:
// - «Exportar»: baixa os formatos marcados — Markdown simples, resposta bruta, Lunoda, JSON do CDC
//   (DEC-011, DEC-012, DEC-015); a bruta sai primeiro, como veio da API;
// - «Copiar conversa» / «Copiar última resposta»: poe o texto na area de transferencia (DEC-013).
// Formatos e opcoes ficam lembrados em chrome.storage.local.
````

## Edição 22 — `src/entrypoints/popup/main.ts` · trecho 2 de 11

**Âncora:**

````
import { buildExportDownloads } from '../../popup/export';
import { rawDumpFilename, summarizeRaw } from '../../popup/raw-dump';
import { parseSettings, SETTINGS_KEY, type ExportSettings } from '../../popup/settings';
````

**Substituir por:**

````
import { buildExportDownloads } from '../../popup/export';
import { rawDownloadFile, summarizeRaw } from '../../popup/raw-dump';
import {
  needsNormalization,
  parseSettings,
  SETTINGS_KEY,
  type ExportSettings,
} from '../../popup/settings';
````

## Edição 23 — `src/entrypoints/popup/main.ts` · trecho 3 de 11

**Âncora:**

````
const exportButton = $<HTMLButtonElement>('export');
const rawButton = $<HTMLButtonElement>('raw');
const copyConversationButton = $<HTMLButtonElement>('copy-conversation');
const copyLastButton = $<HTMLButtonElement>('copy-last');
const actionButtons = [exportButton, rawButton, copyConversationButton, copyLastButton];
const boxes = {
````

**Substituir por:**

````
const exportButton = $<HTMLButtonElement>('export');
const copyConversationButton = $<HTMLButtonElement>('copy-conversation');
const copyLastButton = $<HTMLButtonElement>('copy-last');
const actionButtons = [exportButton, copyConversationButton, copyLastButton];
const boxes = {
````

## Edição 24 — `src/entrypoints/popup/main.ts` · trecho 4 de 11

**Âncora:**

````
  cdcJson: $<HTMLInputElement>('fmt-cdc'),
  thinking: $<HTMLInputElement>('opt-thinking'),
````

**Substituir por:**

````
  cdcJson: $<HTMLInputElement>('fmt-cdc'),
  raw: $<HTMLInputElement>('fmt-raw'),
  thinking: $<HTMLInputElement>('opt-thinking'),
````

## Edição 25 — `src/entrypoints/popup/main.ts` · trecho 5 de 11

**Âncora:**

````
      cdcJson: boxes.cdcJson.checked,
    },
````

**Substituir por:**

````
      cdcJson: boxes.cdcJson.checked,
      raw: boxes.raw.checked,
    },
````

## Edição 26 — `src/entrypoints/popup/main.ts` · trecho 6 de 11

**Âncora:**

````
  boxes.cdcJson.checked = s.formats.cdcJson;
}
````

**Substituir por:**

````
  boxes.cdcJson.checked = s.formats.cdcJson;
  boxes.raw.checked = s.formats.raw;
}
````

## Edição 27 — `src/entrypoints/popup/main.ts` · trecho 7 de 11

**Âncora:**

````
  /** Roda uma acao com os botoes travados e erro inesperado no popup. */
````

**Substituir por:**

````
  /** A resposta bruta ja foi salva nesta acao? Muda a dica quando o formato do site mudou. */
  let rawSaved = false;

  /** Roda uma acao com os botoes travados e erro inesperado no popup. */
````

## Edição 28 — `src/entrypoints/popup/main.ts` · trecho 8 de 11

**Âncora:**

````
    for (const b of actionButtons) b.disabled = true;
    say('Buscando a conversa…');
````

**Substituir por:**

````
    for (const b of actionButtons) b.disabled = true;
    rawSaved = false;
    say('Buscando a conversa…');
````

## Edição 29 — `src/entrypoints/popup/main.ts` · trecho 9 de 11

**Âncora:**

````
    } catch (err) {
      const hint =
        err instanceof ClaudeFormatError ? ' Salve a resposta bruta e leve ao chat.' : '';
      say(`${err instanceof Error ? err.message : String(err)}.${hint}`, 'error');
````

**Substituir por:**

````
    } catch (err) {
      const hint = !(err instanceof ClaudeFormatError)
        ? ''
        : rawSaved
          ? ' A resposta bruta foi salva em Downloads/cdc-raw: leve-a ao chat.'
          : ' Exporte só a «Resposta bruta» e leve-a ao chat.';
      say(`${err instanceof Error ? err.message : String(err)}.${hint}`, 'error');
````

## Edição 30 — `src/entrypoints/popup/main.ts` · trecho 10 de 11

**Âncora:**

````
      if (!summary.ok) return say(summary.error, 'error');
      const out = buildExportDownloads(JSON.parse(text), settings, {
        newId: createIdGenerator(),
        now: new Date().toISOString(),
      });
      for (const f of out.files) await download(f.content, f.filename, f.mime);
      say(
        `Exportado: ${out.files.length} arquivo(s) de «${out.baseName}» (${out.turns} turnos).`,
        'ok',
      );
    }),
````

**Substituir por:**

````
      if (!summary.ok) return say(summary.error, 'error');
      const now = new Date();
      // A bruta sai PRIMEIRO: se o formato do site mudou e o normalizador falhar abaixo, ela ja
      // esta salva — e e justamente o que o chat precisa para consertar (DEC-015).
      if (settings.formats.raw) {
        const f = rawDownloadFile(text, conversationId, now, summary.title);
        await download(f.content, f.filename, f.mime);
        rawSaved = true;
      }
      if (!needsNormalization(settings.formats)) {
        return say(`Exportado: resposta bruta (${summary.kb} KB) em Downloads/cdc-raw.`, 'ok');
      }
      const out = buildExportDownloads(JSON.parse(text), settings, {
        newId: createIdGenerator(),
        now: now.toISOString(),
      });
      for (const f of out.files) await download(f.content, f.filename, f.mime);
      const count = out.files.length + (rawSaved ? 1 : 0);
      say(`Exportado: ${count} arquivo(s) de «${out.baseName}» (${out.turns} turnos).`, 'ok');
    }),
````

## Edição 31 — `src/entrypoints/popup/main.ts` · trecho 11 de 11

**Âncora:**

````
  copyLastButton.addEventListener('click', copy('lastReply'));

  rawButton.addEventListener(
    'click',
    run(async () => {
      const text = await fetchRaw(tabId, conversationId);
      if (text === null) return;
      const summary = summarizeRaw(text);
      if (!summary.ok) return say(summary.error, 'error');
      const filename = rawDumpFilename(conversationId, new Date(), summary.title);
      await download(text, filename, 'application/json');
      say(`Salvo em Downloads/${filename} (${summary.kb} KB, ${summary.topKeys} chaves).`, 'ok');
    }),
  );
}
````

**Substituir por:**

````
  copyLastButton.addEventListener('click', copy('lastReply'));
}
````

## Edição 32 — `src/entrypoints/popup/index.html` · trecho 1 de 2

**Âncora:**

````
        <legend>Formatos</legend>
        <label><input type="checkbox" id="fmt-lunoda" /> Lunoda (.json + .md)</label>
        <label><input type="checkbox" id="fmt-simple" /> Markdown simples (.md)</label>
        <label
          ><input type="checkbox" id="fmt-cdc" /> JSON do CDC (.cdc.json, conversa inteira)</label
        >
      </fieldset>
````

**Substituir por:**

````
        <legend>Formatos</legend>
        <label><input type="checkbox" id="fmt-simple" /> Markdown simples (.md, para ler)</label>
        <label><input type="checkbox" id="fmt-raw" /> Resposta bruta (.json, sem perda)</label>
        <label><input type="checkbox" id="fmt-lunoda" /> Lunoda (.json + .md)</label>
        <label><input type="checkbox" id="fmt-cdc" /> JSON do CDC (.cdc.json)</label>
      </fieldset>
````

## Edição 33 — `src/entrypoints/popup/index.html` · trecho 2 de 2

**Âncora:**

````
      </div>
      <button id="raw" type="button" class="secondary">Salvar resposta bruta (depuração)</button>
    </div>
````

**Substituir por:**

````
      </div>
    </div>
````

## Edição D1 — `meta/DECISIONS.md` · DEC-010 emendada

**Âncora** (linha inteira):

````
## DEC-010 — Claude: busca injetada na aba e captura bruta antes do normalizador
**Data:** 2026-10-16 · **Status:** aceita
````

**Substituir por:**

````
## DEC-010 — Claude: busca injetada na aba e captura bruta antes do normalizador
**Data:** 2026-10-16 · **Status:** aceita — emendada por DEC-015 (o botão de depuração virou o formato «Resposta bruta»)
````

## Edição D2 — `meta/DECISIONS.md` · DEC-012 emendada

**Âncora** (linha inteira):

````
## DEC-012 — Formatos «simples» e opções lembradas no popup
**Data:** 2026-10-17 · **Status:** aceita (formatos pedidos pelo dono; desenho do chat)
````

**Substituir por:**

````
## DEC-012 — Formatos «simples» e opções lembradas no popup
**Data:** 2026-10-17 · **Status:** aceita — emendada por DEC-015 (o `.cdc.json` deixa de ser o arquivo de guarda; padrão de primeiro uso novo)
````

## Edição D3 — `meta/DECISIONS.md` · DEC-015 no fim

**Âncora** (linha inteira):

````
Os 6 carimbos do kit dizem v1.162.1. O perfil vive no CEREBRO e nas Instruções como transplante marcado, e o próximo update o transplanta de novo sem perguntar. As Instruções novas só valem para o chat depois que o dono as colar no painel do Projeto. Feedback ao kit no IDEAS.
````

**Substituir por:**

````
Os 6 carimbos do kit dizem v1.162.1. O perfil vive no CEREBRO e nas Instruções como transplante marcado, e o próximo update o transplanta de novo sem perguntar. As Instruções novas só valem para o chat depois que o dono as colar no painel do Projeto. Feedback ao kit no IDEAS.

---

## DEC-015 — Resposta bruta como formato do «Exportar»; padrão «simples + bruta»
**Data:** 2026-11-26 · **Status:** aceita (decisão do dono sobre a análise `meta/analises/261126-ANALISE-formatos-de-exportacao.md`)

### Contexto
O dono exportava 5 arquivos por conversa (Lunoda `.json` e `.md`, `(simples).md`, `.cdc.json` e a bruta do botão de depuração). Medido em 51 conversas de 28 projetos (2026-11-26): os quatro formatos processados têm o mesmo conteúdo; só a bruta guarda as entradas e resultados de ferramenta (12,1 e 14,1 milhões de caracteres, contra 2,86 milhões de texto) e os ramos editados (52 mensagens em 11 conversas); os projetos só leem o `(simples).md`. O dono não importa mais no Lunoda.

### Decisão
- Caixa «Resposta bruta (.json, sem perda)» no popup, lembrada em `formats.raw`; o arquivo é o texto da API byte a byte, em `cdc-raw/` com o nome do antigo botão.
- O popup salva a bruta ANTES de normalizar: se o formato do site mudou, ela sobrevive à falha do normalizador, e o aviso diz que ela foi salva.
- Padrão de primeiro uso: Markdown simples + resposta bruta; preferência salva sem `formats.raw` ganha a bruta marcada. Pensamento e arquivos seguem a DEC-008.
- O botão «Salvar resposta bruta (depuração)» sai (emenda a DEC-010). O `.cdc.json` continua disponível, mas deixa de ser o arquivo de guarda (emenda a DEC-012): a bruta é a fonte, e o reprocessar (leva seguinte) partirá dela.
- O teste das capturas reais aceita resposta da IA sem texto quando há pensamento ou arquivo, e reprova a conversa sem nenhum texto da IA (armadilha 18 do CONTEXT).

### Alternativas consideradas
- **Manter os 5 arquivos** — é o problema.
- **Só o `(simples).md`** — perde o que só a bruta tem e não se refaz se a conversa sumir do claude.ai.
- **`.cdc.json` como guarda** — não guarda ferramentas nem ramos.
- **Manter o botão de depuração ao lado da caixa** — duas formas de fazer a mesma coisa; a caixa salva antes de normalizar, que era o papel do botão.

### Consequências
Por conversa, 2 arquivos em vez de 5 no uso do dono. Formato que deixou de ser exportado só se refaz exportando de novo até o reprocessar existir. As 50 brutas reais dos projetos viram corpus do teste de capturas.
````

## Edição D4 — `meta/IDEAS.md` · reprocessar parte da bruta

**Âncora** (linha inteira):

````
### 2026-10-17 — Reprocessar a partir do JSON do CDC
Abrir um `.cdc.json` guardado (no popup ou numa página da extensão) e gerar dele os outros formatos — Lunoda com pensamento, Markdown simples — sem buscar a conversa de novo. É para isso que o JSON do CDC leva tudo, mesmo com as opções desligadas.
````

**Substituir por:**

````
### 2026-10-17 — Reprocessar a partir do JSON do CDC
Abrir um `.cdc.json` guardado (no popup ou numa página da extensão) e gerar dele os outros formatos — Lunoda com pensamento, Markdown simples — sem buscar a conversa de novo. É para isso que o JSON do CDC leva tudo, mesmo com as opções desligadas. **[2026-11-26] A fonte passa a ser a resposta bruta** (DEC-015): ela guarda o que o `.cdc.json` não guarda. Aprovada pelo dono como a leva seguinte à da bruta como formato; spec a escrever.
````

## Edição D5 — `meta/IDEAS.md` · botao de depuracao substituido

**Âncora** (linha inteira):

````
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1.
````

**Substituir por:**

````
- **Botão de depuração «salvar resposta bruta»** — implementado na wo0003 (DEC-010), visível em todo build durante a F1. Substituído em 2026-11-26 pela caixa «Resposta bruta» do «Exportar» (wo0011, DEC-015).
````

## Edição D6 — `meta/STATUS.md` · F2 em progresso

**Âncora** (linha inteira):

````
- **F2:** levas «formatos e opções» e «copiar» entregues e conferidas. Faltam «conteúdo dos artefatos gerados» (pede medir antes onde a API entrega o texto) e «nome de arquivo configurável» (ROADMAP).
````

**Substituir por:**

````
- **F2:** levas «formatos e opções» e «copiar» entregues e conferidas; leva «resposta bruta como formato» (wo0011, DEC-015) aplicada, falta a conferência do dono no navegador. Próxima: «reprocessar a partir da bruta». Faltam ainda «conteúdo dos artefatos gerados» (a bruta já tem o dado: entradas de ferramenta) e «nome de arquivo configurável» (ROADMAP).
````

## Edição D7 — `meta/STATUS.md` · backlog: exportacoes feitas

**Âncora** (linha inteira):

````
- [ ] Olhar as exportações de outros projetos que usaram o CDC, inclusive de outros perfis do Chrome [relatado pelo dono, 2026-11-24: ele vai dar acesso às pastas] — validar o normalizador e os formatos em conversas variadas.
````

**Substituir por:**

````
- [ ] Conferir no navegador a leva da resposta bruta (roteiro do chat, wo0011).
- [ ] Spec e WO do «reprocessar a partir da bruta» (DEC-015).
````

## Edição D8 — `meta/STATUS.md` · ultima conversa

**Âncora** (linha inteira):

````
**2026-11-26** — Conversa de chat 2: template-update do KCM v1.162.1 fechado (DEC-014, Instruções coladas no painel) e release v0.1.0 publicada no GitHub (wo0010). Próximo: as exportações de outros projetos (Backlog), quando o dono conceder as pastas.
````

**Substituir por:**

````
**2026-11-26** — Conversa de chat 2: KCM v1.162.1 (DEC-014), release v0.1.0 no GitHub (wo0010), inventário das exportações de 28 projetos e análise dos formatos; decisão «bruta + simples» (DEC-015, wo0011). Próximo: o dono confere a bruta no navegador; depois, o reprocessar.
````

## Edição D9 — `meta/CHANGELOG.md` · Adicionado: bruta

**Âncora** (linha inteira):

````
- Licença MIT (`LICENSE`) e seção no README.
````

**Substituir por:**

````
- Licença MIT (`LICENSE`) e seção no README.
- Formato «Resposta bruta» no «Exportar»: a resposta da API como veio, em `cdc-raw/`, salva antes de normalizar — o único formato sem perda (wo0011, DEC-015).
````

## Edição D10 — `meta/CHANGELOG.md` · Modificado e Removido

**Âncora** (linha inteira):

````
- Kit de contexto (KCM) atualizado de v1.124.0 para v1.162.1: CEREBRO e Instruções fundidos com o perfil do projeto transplantado, `meta/GUIA-DO-KIT.md` novo, skills `apply-wo`/`wrap`/`sondar` e molde de WO do kit, permissões do Code ampliadas (DEC-014). Nada muda na extensão.
````

**Substituir por:**

````
- Kit de contexto (KCM) atualizado de v1.124.0 para v1.162.1: CEREBRO e Instruções fundidos com o perfil do projeto transplantado, `meta/GUIA-DO-KIT.md` novo, skills `apply-wo`/`wrap`/`sondar` e molde de WO do kit, permissões do Code ampliadas (DEC-014). Nada muda na extensão.
- Padrão de primeiro uso do popup: Markdown simples + resposta bruta (antes: só Lunoda) (DEC-015).
- Teste das capturas reais aceita resposta da IA sem texto quando há pensamento ou arquivo; reprova a conversa sem nenhum texto da IA.

### Removido
- Botão «Salvar resposta bruta (depuração)»: virou a caixa «Resposta bruta» (DEC-015).
````

---

## Fora de escopo

- Reprocessar a partir da bruta (leva seguinte). Nenhum exportador, fixture ou permissão muda. Não edite os arquivos do chat.

## Armadilhas desta WO

- As Edições 1 a 33 se aplicam EM ORDEM, arquivo por arquivo; várias âncoras do mesmo arquivo são vizinhas. A âncora de cada uma é
  única no arquivo ORIGINAL e continua única depois das anteriores (simulado).
- `vitest --update` não entra aqui: nenhuma fixture muda. Se algum `toMatchFileSnapshot` reprovar, PARE — não regrave.

---

## Depois de aplicar — conferência antes do commit

- [ ] Os 10 arquivos de código ficam IGUAIS à versão validada pelo chat — `sha1sum` de cada um:
      - `src/popup/settings.ts` → `b9c5e8f0c5b9e3deeb5efbfbba6e82f31cf6a504`
      - `src/popup/settings.test.ts` → `d6b28be14926d11bcfa4aa2e9393e49438be6ff8`
      - `src/popup/raw-dump.ts` → `8ec189f963eb85a885a3ada5df53d52f0e6a3c9a`
      - `src/popup/raw-dump.test.ts` → `ac6a7c6bea417bf311cc674a0a5b464020696386`
      - `src/popup/export.ts` → `7dfeab94cc5fb18b69e59b685a1935a30c79db72`
      - `src/popup/export.test.ts` → `1315e07f7d26c3a7377e8cc4cda79274672c4cf9`
      - `src/popup/copy.test.ts` → `9eeb4b2d7a54cc2c900108614077da4587c40763`
      - `src/adapters/claude/normalize.test.ts` → `25fdf169764180832dca3085a2f02cb8b2a1351a`
      - `src/entrypoints/popup/main.ts` → `76065304699e0fc8d525138046dc701ca7e1b0c7`
      - `src/entrypoints/popup/index.html` → `fbd4145fa730d9294409dbfeaea449394cd5ae4d`
      Qualquer hash diferente: PARE e reporte (o arquivo divergiu do que foi testado). Os arquivos estão em LF (`git ls-files --eol`).
- [ ] `npm run check` verde: **98 passed, 2 skipped** (antes 94); build ok. Menos que 98: PARE.
- [ ] `CDC_CLAUDE_CAPTURES_DIR=../capturas-claude/cdc-raw npx vitest run src/adapters/claude/normalize.test.ts` → **20 passed**.
- [ ] `grep -c 'id="fmt-raw"' src/entrypoints/popup/index.html` → **1**; `grep -c 'id="raw"' src/entrypoints/popup/index.html` → **0**.
- [ ] `grep -c "^## DEC-015" meta/DECISIONS.md` → **1**; `grep -c "^### Removido" meta/CHANGELOG.md` → **1**; `grep -c "^- \[ \] Olhar as exportações" meta/STATUS.md` → **0**.
- [ ] `git diff --stat`: os 10 arquivos de código, os 4 do registro (DECISIONS, IDEAS, STATUS, CHANGELOG) e os 4 `M` do chat; `??` só esta WO e a spec.
- [ ] **O que estas conferências NÃO respondem:** se o popup funciona no navegador (caixa nova, bruta salva primeiro, mensagem). Isso é o roteiro do dono, entregue no chat.

## Relatório de aplicação *(quem aplica preenche ao terminar)*

Grave em `../AAMMDD-HHMM-code-cdc-apply-wo0011.txt` (`date +%y%m%d-%H%M`), pela ferramenta de escrita de arquivo.

## Commit — blocos separados, mensagem SEM acento

```
git add src/popup/settings.ts src/popup/settings.test.ts src/popup/raw-dump.ts src/popup/raw-dump.test.ts src/popup/export.ts src/popup/export.test.ts src/popup/copy.test.ts src/adapters/claude/normalize.test.ts src/entrypoints/popup/main.ts src/entrypoints/popup/index.html meta/DECISIONS.md meta/IDEAS.md meta/STATUS.md meta/CHANGELOG.md meta/CONTEXT.md README.md meta/analises/261126-ANALISE-formatos-de-exportacao.md logs/2026-11-26.md specs/261126-f2-bruta-como-formato.md meta/workorders/261126-wo0011-bruta-como-formato.md
```

```
git commit -m "feat(popup): resposta bruta como formato do Exportar" -m "Caixa Resposta bruta, salva antes de normalizar; padrao simples + bruta; sai o botao de depuracao. Teste das capturas reais aceita resposta sem texto com pensamento ou arquivo. DEC-015, wo0011."
```

```
git push
```
