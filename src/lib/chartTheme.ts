/**
 * Paleta de gráficos — instância validada da skill de dataviz (8 matizes, ordem fixa,
 * nunca ciclada). Validada com `validate_palette.js`: pior par adjacente CVD ΔE 9.1
 * (protanopia), piso de visão normal 19.6 — passa todos os testes obrigatórios.
 * As 3 primeiras cores também passam a validação "all-pairs" (uso seguro em gráficos
 * onde quaisquer duas marcas ficam lado a lado, ex. dispersão).
 *
 * A app não tem alternância de modo escuro activa (só o claro é usado), por isso só a
 * variante clara está aqui. As cores de identidade (categórica) são fixas — não seguem
 * o verde/dourado da marca, que fica reservado para métricas de série única/destaque.
 */
export const CATEGORICAL = [
  "#2a78d6", // 1 azul
  "#eb6834", // 2 laranja
  "#1baf7a", // 3 água
  "#eda100", // 4 amarelo
  "#e87ba4", // 5 magenta
  "#008300", // 6 verde
  "#4a3aa7", // 7 violeta
  "#e34948", // 8 vermelho
] as const;

/** Cor de destaque de marca (verde institucional) — usada em séries únicas/sequenciais. */
export const BRAND_HUE = "hsl(var(--primary))";
export const BRAND_HUE_SOFT = "hsl(var(--primary) / 0.12)";

/** Cromática do gráfico (grelhas, eixos, superfícies) — segue os tokens do tema, não a skill. */
export const CHART_CHROME = {
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
  tooltipBg: "hsl(var(--card))",
  tooltipBorder: "hsl(var(--border))",
};

export interface CategoricalDatum {
  name: string;
  value: number;
}

/**
 * Aplica o tecto de séries da skill (ladder): mostra no máx. `max` fatias e junta o
 * resto em "Outro" — nunca gera uma 9ª cor (indistinguível sob CVD).
 */
export function foldCategorical(items: CategoricalDatum[], max = 6): CategoricalDatum[] {
  if (items.length <= max) return items;
  const head = items.slice(0, max - 1);
  const tailTotal = items.slice(max - 1).reduce((sum, i) => sum + i.value, 0);
  return [...head, { name: "Outro", value: tailTotal }];
}
