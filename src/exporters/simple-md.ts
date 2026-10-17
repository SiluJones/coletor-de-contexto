/**
 * «Markdown simples»: a conversa para LER (DEC-012). Sem marcadores do Lunoda, sem IDs.
 *
 *   # <titulo>
 *   - Link, IA, modelo, criada em, exportada em, turnos
 *   ---
 *   ## Você · 1
 *   <pedido>
 *   ## Claude · 1
 *   [### Pensamento (resumo)]
 *   <resposta>
 *   ---
 *
 * O texto de pedido e resposta entra como veio (markdown); por isso os titulos da conversa usam `##`
 * e o texto pode ter os seus proprios titulos dentro. Pensamento e listas de arquivos seguem as
 * mesmas opcoes do Lunoda.
 */

import { formatLunodaLocal } from '../core/dates';
import type { Conversation, ExportOptions, FileRef } from '../core/model';
import { PLATFORM_LABEL } from '../core/model';
import { formatFileSize } from './lunoda-build';

/** Dados da exportacao que nao estao na conversa. */
export interface SimpleMdContext {
  /** Instante da exportacao (ISO 8601 UTC). */
  now: string;
  /** Fuso das datas; omitido = fuso do ambiente. */
  timeZone?: string;
}

function fileList(heading: string, files: FileRef[]): string[] {
  if (files.length === 0) return [];
  return [
    `**${heading}:**`,
    ...files.map(
      (f) =>
        `- \`${f.name}\` — ${f.kind}${f.size === undefined ? '' : `, ${formatFileSize(f.size)}`}`,
    ),
    '',
  ];
}

/**
 * Gera o Markdown simples de uma conversa.
 * @param c conversa normalizada.
 * @param options pensamento e listas de arquivos (as mesmas do Lunoda).
 * @param ctx instante da exportacao e fuso.
 */
export function renderSimpleMarkdown(
  c: Conversation,
  options: ExportOptions,
  ctx: SimpleMdContext,
): string {
  const ai = PLATFORM_LABEL[c.platform];
  const when = (iso: string) => formatLunodaLocal(iso, ctx.timeZone);
  const lines: string[] = [
    `# ${c.title}`,
    '',
    `- **Link:** ${c.url}`,
    `- **IA:** ${ai}${c.model ? ` (${c.model})` : ''}`,
    `- **Criada em:** ${when(c.createdAt)} · **Exportada em:** ${when(ctx.now)}`,
    `- **Turnos:** ${c.turns.length}`,
    '',
  ];
  for (const t of c.turns) {
    lines.push('---', '', `## Você · ${t.index}`, '');
    if (t.user.text) lines.push(t.user.text, '');
    if (options.includeFiles) lines.push(...fileList('Arquivos anexados', t.user.attachments));
    const r = t.assistant;
    if (!r) continue;
    lines.push(`## ${ai} · ${t.index}`, '');
    if (options.includeThinking && r.thinking.length > 0) {
      lines.push('### Pensamento (resumo)', '', r.thinking.join('\n\n'), '');
    }
    if (r.text) lines.push(r.text, '');
    if (options.includeFiles) lines.push(...fileList('Arquivos gerados', r.generated));
  }
  return lines.join('\n');
}
