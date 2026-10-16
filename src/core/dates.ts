/**
 * Datas no formato do cabecalho do MD do Lunoda: `dd/mm/aa HH:MM`, em hora LOCAL.
 * O front matter e o JSON usam ISO 8601 UTC; so este campo usa hora local (armadilha 4 do CONTEXT).
 */

/**
 * Formata um instante ISO 8601 como `dd/mm/aa HH:MM` no fuso dado.
 *
 * Os segundos sao TRUNCADOS, nao arredondados: no `mapsmith 12`, `17:51:44Z` aparece como `14:51`.
 *
 * @param iso instante em ISO 8601 (ex.: "2026-09-02T17:51:44.451Z").
 * @param timeZone fuso IANA; se omitido, o fuso do ambiente (o do navegador do usuario).
 */
export function formatLunodaLocal(iso: string, timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Data invalida: ${iso}`);
  }
  // formatToParts evita depender da pontuacao que cada versao do ICU poe entre data e hora.
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}
