/**
 * Contagem de dias úteis (seg–sex) simples, sem calendário de feriados angolano — decisão de
 * protótipo documentada. Usado só nas fases da tramitação de Concessão cuja fonte diz
 * explicitamente "dias úteis" (Fase B, Fase E) e na checagem interna da Fase H (celebração →
 * publicação, 5 dias úteis).
 */

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

/** Dias úteis decorridos entre duas datas ISO (conta cada dia útil estritamente entre as duas, exclusive). */
export function businessDaysElapsed(startISO: string, endISO: string = new Date().toISOString()): number {
  const start = new Date(startISO);
  const end = new Date(endISO);
  let count = 0;
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);
  while (cursor <= endDay) {
    if (!isWeekend(cursor)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}
