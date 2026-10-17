/**
 * Tipos do formato de arquivo do Lunoda, medidos no par `mapsmith 12` (CONTEXT, «Formato Lunoda»).
 *
 * A ORDEM das chaves nas interfaces e a ordem em que o Lunoda as grava; os construtores deste modulo
 * montam os objetos nessa ordem para que `JSON.stringify` reproduza o arquivo byte a byte.
 */

export interface LunodaOption {
  id: string;
  name: string;
  colorId: string;
}

export interface LunodaProperty {
  id: string;
  name: string;
  options: LunodaOption[];
}

export interface LunodaBlock {
  id: string;
  /** "Prompt", "Pensamento" ou o nome da IA ("Claude"...). */
  subtitle: string;
  /** Numero do turno (DEC-008). */
  version: number;
  content: string;
  blockProps: Record<string, unknown>;
}

export interface LunodaEntry {
  id: string;
  title: string;
  description: string;
  propertyValues: Record<string, string[]>;
  propertyAutoFlags: Record<string, unknown>;
  blocks: LunodaBlock[];
  /** ISO 8601 UTC. */
  createdAt: string;
  /** ISO 8601 UTC. */
  updatedAt: string;
}

export interface LunodaDocument {
  properties: LunodaProperty[];
  entries: LunodaEntry[];
}

/** Propriedades padrao do Lunoda, como aparecem no `mapsmith 12`. Use `defaultLunodaProperties()`. */
const DEFAULT_PROPERTIES: readonly LunodaProperty[] = [
  {
    id: 'p-tags',
    name: 'Tags',
    options: [
      { id: 'o1', name: 'Ideia', colorId: 'yellow' },
      { id: 'o2', name: 'Pesquisa', colorId: 'blue' },
      { id: 'o3', name: 'Geral', colorId: 'slate' },
    ],
  },
  {
    id: 'p-ia',
    name: 'IA Utilizada',
    options: [
      { id: 'o4', name: 'Claude', colorId: 'violet' },
      { id: 'o5', name: 'Gemini', colorId: 'green' },
      { id: 'o6', name: 'ChatGPT', colorId: 'orange' },
    ],
  },
];

/** Copia nova das propriedades padrao (nunca compartilhe a constante: o chamador pode mutar). */
export function defaultLunodaProperties(): LunodaProperty[] {
  return structuredClone(DEFAULT_PROPERTIES) as LunodaProperty[];
}
