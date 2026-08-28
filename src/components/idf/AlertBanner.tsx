import { AlertTriangle, Ban, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIdf } from "@/modules/idf/context/IdfContext";
import { cn } from "@/lib/utils";

/**
 * Banner fixo no topo do conteúdo (secção 3.2) — avisos críticos do fluxo.
 * Dispensável, mas reaparece na navegação seguinte se a condição persistir.
 */
export const AlertBanner = () => {
  const { visibleAlerts, dismissAlert } = useIdf();
  if (!visibleAlerts.length) return null;

  return (
    <div className="space-y-2 px-4 pt-4 md:px-8">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
            alert.level === "blocking"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-warning/40 bg-warning/15 text-warning-foreground",
          )}
        >
          {alert.level === "blocking" ? (
            <Ban className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="flex-1">{alert.message}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            aria-label="Dispensar aviso"
            onClick={() => dismissAlert(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AlertBanner;
