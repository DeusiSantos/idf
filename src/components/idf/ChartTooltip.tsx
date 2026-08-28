interface ChartTooltipPayloadEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadEntry[];
  label?: string | number;
  formatValue?: (value: number | string) => string;
}

/**
 * Tooltip de gráfico consistente com a skill de dataviz: o valor lidera (forte,
 * cor de texto), o nome da série vem depois (secundário); a identidade da série usa
 * uma "chave de linha" curta em vez de uma caixa preenchida.
 */
export const ChartTooltip = ({ active, payload, label, formatValue }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1.5 font-medium text-muted-foreground">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey}-${index}`} className="flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-foreground">
              {formatValue && entry.value !== undefined ? formatValue(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTooltip;
