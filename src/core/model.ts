/**
 * Modelo canonico do Coletor de Contexto (DEC-003).
 *
 * Unico contrato entre adaptadores (que leem uma plataforma) e exportadores (que geram um formato).
 * O adaptador guarda TUDO o que a plataforma oferece; quem decide o que entra no arquivo e o
 * exportador, conforme as ExportOptions (DEC-005).
 */

/** Plataformas suportadas (ou planejadas). */
export type Platform = 'claude' | 'chatgpt' | 'gemini';

/** Nome da IA como aparece no subtitulo do bloco de resposta no Lunoda. */
export const PLATFORM_LABEL: Record<Platform, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
};

/** Referencia a um arquivo anexado pelo usuario ou gerado pela IA. Nunca carrega binario. */
export interface FileRef {
  name: string;
  /** Tipo MIME ou rotulo da plataforma (ex.: "application/pdf", "artifact"). */
  kind: string;
  /** Tamanho em bytes, quando a plataforma informa. */
  size?: number;
  /** Conteudo textual (ex.: artefato de codigo gerado pela IA); ausente para binarios. */
  textContent?: string;
}

/** Uma mensagem (do usuario ou da IA). */
export interface Message {
  /** Texto em markdown, como a plataforma devolve. */
  text: string;
  /** Blocos de pensamento, em ordem. Vazio quando a plataforma nao expoe ou nao houve. */
  thinking: string[];
  /** Arquivos anexados pelo usuario nesta mensagem. */
  attachments: FileRef[];
  /** Arquivos criados pela IA nesta mensagem. */
  generated: FileRef[];
  /** Instante da mensagem (ISO 8601 UTC), quando a plataforma informa. */
  createdAt?: string;
}

/** Um turno: o pedido do usuario e a resposta da IA a ele. */
export interface Turn {
  /** 1, 2, 3... — vira a "versao" do bloco no Lunoda (decidido em 2026-10-16: version = turno). */
  index: number;
  user: Message;
  /** Ausente quando a conversa termina num pedido ainda sem resposta. */
  assistant?: Message;
}

/** Uma conversa ja normalizada, so com o ramo atual. */
export interface Conversation {
  platform: Platform;
  /** Id da conversa na plataforma (uuid no Claude). */
  sourceId: string;
  title: string;
  url: string;
  /** Modelo informado pela plataforma (ex.: "claude-opus-…"), quando vier. */
  model?: string;
  /** ISO 8601 UTC. */
  createdAt: string;
  /** ISO 8601 UTC. */
  updatedAt: string;
  turns: Turn[];
}

/** O que o exportador inclui alem do texto das mensagens. */
export interface ExportOptions {
  includeThinking: boolean;
  includeFiles: boolean;
}

/** Padrao do primeiro uso, decidido pelo dono em 2026-10-16 (DEC-008). */
export const DEFAULT_EXPORT_OPTIONS: Readonly<ExportOptions> = Object.freeze({
  includeThinking: false,
  includeFiles: true,
});
