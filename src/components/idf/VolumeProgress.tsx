import { cn } from "@/lib/utils";

interface VolumeProgressProps {
  consumed: number;
  authorized: number;
  unit?: string;
  label?: string;
}

/** Regra 9.4: barra de progresso consumido/autorizado, vermelha quando esgotada. */
export const VolumeProgress = ({ consumed, authorized, unit = "m3", label = "Volume consumido" }: VolumeProgressProps) => {
  const ratio = authorized > 0 ? Math.min(1, consumed / authorized) : 0;
  const percent = Math.round(ratio * 100);
  const tone = percent >= 100 ? "bg-destructive" : percent >= 80 ? "bg-warning" : "bg-primary";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {consumed.toLocaleString("pt-AO")} / {authorized.toLocaleString("pt-AO")} {unit} ({percent}%)
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default VolumeProgress;
