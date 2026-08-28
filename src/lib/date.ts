/** Formata uma data ISO devolvida pela API para o formato pt-AO (dd/mm/aaaa). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-AO");
}

/** Formata uma data ISO com hora incluída (dd/mm/aaaa hh:mm) — só para campos que são mesmo timestamps. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-AO");
}
