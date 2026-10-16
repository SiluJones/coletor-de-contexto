/**
 * IDs no formato do Lunoda: Date.now() em base36 (8 caracteres) + 4 caracteres aleatorios em base36.
 * Formato medido no par `mapsmith 12` (CONTEXT, «Formato Lunoda»).
 */

const TIME_LENGTH = 8;
const RANDOM_LENGTH = 4;

/** Codifica o instante em base36 com 8 caracteres (cabe ate o ano 2059). */
function encodeTime(ms: number): string {
  return ms.toString(36).padStart(TIME_LENGTH, '0');
}

/**
 * Cria um gerador de IDs do Lunoda.
 *
 * O instante de cada ID e estritamente crescente dentro do mesmo gerador: se duas chamadas caem no
 * mesmo milissegundo, a segunda usa o milissegundo seguinte. Sem isso, so os 4 caracteres aleatorios
 * separariam os blocos de uma exportacao (36^4 combinacoes), e 1000 blocos ja teriam ~25% de chance
 * de colisao. De quebra, a ordem dos IDs acompanha a ordem dos blocos, como no processo manual.
 *
 * @param clock fonte do instante (injetavel para teste).
 * @param random fonte de aleatoriedade em [0, 1) (injetavel para teste).
 */
export function createIdGenerator(
  clock: () => number = Date.now,
  random: () => number = Math.random,
): () => string {
  let last = -1;
  return () => {
    const ms = Math.max(clock(), last + 1);
    last = ms;
    let suffix = '';
    for (let i = 0; i < RANDOM_LENGTH; i++) {
      suffix += Math.floor(random() * 36).toString(36);
    }
    return encodeTime(ms) + suffix;
  };
}

/** Devolve o instante (ms desde a epoca) embutido nos 8 primeiros caracteres de um ID do Lunoda. */
export function lunodaIdTime(id: string): number {
  return parseInt(id.slice(0, TIME_LENGTH), 36);
}
