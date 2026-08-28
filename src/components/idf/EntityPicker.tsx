import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export interface PickerOption {
  value: string;
  label: string;
  hint?: string;
}

interface EntityPickerProps {
  id: string;
  label: string;
  queryKey: unknown[];
  /** Carregamento assíncrono — nunca assumir cache local (secção 7). */
  load: () => Promise<PickerOption[]>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  error?: string;
  disabled?: boolean;
}

/** Selector transversal entre módulos: OperatorPicker, ConcessionPicker, LicensePicker, LotPicker. */
export const EntityPicker = ({
  id,
  label,
  queryKey,
  load,
  value,
  onChange,
  placeholder = "Seleccione…",
  emptyMessage = "Sem registos elegíveis.",
  error,
  disabled,
}: EntityPickerProps) => {
  const { data, isLoading } = useQuery({ queryKey, queryFn: load });

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : !data || data.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {data.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.hint ? ` · ${option.hint}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default EntityPicker;
