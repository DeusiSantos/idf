import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { cn } from "@/lib/utils";
import type { TraceabilityChainDto, TraceabilityNode } from "@/modules/idf/types";

type ChainKey = "operator" | "concession" | "tree" | "log" | "lot" | "transit" | "warehouse" | "export";

const ORDER: ChainKey[] = ["operator", "concession", "tree", "log", "lot", "transit", "warehouse", "export"];

/** Rótulo da etapa — a API só devolve reference/description/status, não um texto de secção. */
const LABELS: Record<ChainKey, string> = {
  operator: "Operador",
  concession: "Concessão",
  tree: "Árvore",
  log: "Tora",
  lot: "Lote",
  transit: "Guia de Trânsito",
  warehouse: "Entreposto",
  export: "Exportação",
};

/** Só operador tem página de detalhe por id — os restantes ligam à listagem do módulo. */
const routeFor = (key: ChainKey, node: TraceabilityNode): string | null => {
  switch (key) {
    case "operator":
      return `/idf/operators/${node.id}`;
    case "lot":
      return "/idf/production";
    case "transit":
      return "/idf/transit-guides";
    case "warehouse":
      return "/idf/warehouses";
    case "export":
      return "/idf/exports";
    default:
      return null;
  }
};

/** Cadeia visual clicável (módulo Rastreabilidade). */
export const TraceabilityTimeline = ({ chain }: { chain: TraceabilityChainDto }) => {
  const nodes = ORDER.map((key) => chain[key] as TraceabilityNode | null | undefined);

  return (
    <ol className="relative space-y-4 border-l-2 border-border pl-6">
      {nodes.map((node, index) => {
        const key = ORDER[index];
        const route = node ? routeFor(key, node) : null;
        return (
          <li key={key} className="relative">
            <span
              className={cn(
                "absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
                node ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}
            >
              {node && <Check className="h-3 w-3" />}
            </span>
            {node ? (
              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{LABELS[key]}</p>
                {route ? (
                  <Link to={route} className="font-semibold hover:text-primary hover:underline">
                    {node.reference}
                  </Link>
                ) : (
                  <p className="font-semibold">{node.reference}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {node.description && <p className="text-sm text-muted-foreground">{node.description}</p>}
                  {node.status && <StatusBadge status={node.status} />}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                Etapa ainda não atingida
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default TraceabilityTimeline;
