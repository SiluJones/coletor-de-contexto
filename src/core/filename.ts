/**
 * Nome de arquivo seguro para o Windows a partir do titulo da conversa (armadilha 7 do CONTEXT).
 * So o NOME do arquivo e sanitizado; o titulo dentro do conteudo fica como esta.
 */

/** Proibidos no Windows, alem dos caracteres de controle (codigo < 32). */
const FORBIDDEN = '<>:"/\\|?*';

/** Troca cada caractere proibido por `_`. */
function replaceForbidden(text: string): string {
  return Array.from(text, (ch) =>
    ch.charCodeAt(0) < 32 || FORBIDDEN.includes(ch) ? '_' : ch,
  ).join('');
}

const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const MAX_LENGTH = 120;

/**
 * Converte um titulo em nome de arquivo (sem extensao).
 * Caracteres proibidos viram `_`, espacos repetidos colapsam, ponto/espaco no fim saem, nome
 * reservado do Windows ganha `_` na frente, e o resultado tem no maximo 120 caracteres.
 * @param title titulo da conversa.
 * @param fallback nome usado quando nao sobra nada do titulo.
 */
export function safeFileName(title: string, fallback = 'conversa'): string {
  let name = replaceForbidden(title).replace(/\s+/g, ' ').trim();
  name = name.slice(0, MAX_LENGTH).replace(/[. ]+$/, '');
  if (name === '') return fallback;
  return RESERVED.test(name) ? `_${name}` : name;
}
