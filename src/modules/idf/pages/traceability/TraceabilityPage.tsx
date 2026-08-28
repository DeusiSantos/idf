import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { TraceabilityTimeline } from "@/components/idf/TraceabilityTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getTraceabilityChain } from "@/modules/idf/api/traceability";
import { loadAvailableLogs, loadClosedLots, loadExportProcesses } from "@/modules/idf/api/pickers";
import { toProblem } from "@/modules/idf/hooks/useProblem";
import type { TraceabilityEntityType } from "@/modules/idf/types";

const ENTITY_LABELS: Record<TraceabilityEntityType, string> = {
  Log: "Tora",
  ForestLot: "Lote",
  ExportProcess: "Processo de exportação",
};

const TraceabilityPage = () => {
  const params = useParams<{ entityType?: string; id?: string }>();
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState<TraceabilityEntityType>(
    (params.entityType as TraceabilityEntityType) ?? "ForestLot",
  );
  const [entityId, setEntityId] = useState(params.id ?? "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["idf", "traceability", entityType, entityId],
    queryFn: () => getTraceabilityChain(entityType, entityId),
    enabled: Boolean(entityId),
  });

  const loader = entityType === "Log" ? loadAvailableLogs : entityType === "ForestLot" ? loadClosedLots : loadExportProcesses;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rastreabilidade"
        description="Cadeia completa Operador → Concessão → Árvore → Tora → Lote → Guia → Entreposto → Exportação."
        crumbs={[{ label: "Cadeia de Custódia" }, { label: "Rastreabilidade" }]}
      />

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 md:p-6">
          <div className="space-y-2">
            <Label htmlFor="trace-type">Ponto de entrada</Label>
            <Select
              value={entityType}
              onValueChange={(value) => {
                setEntityType(value as TraceabilityEntityType);
                setEntityId("");
                navigate("/idf/traceability");
              }}
            >
              <SelectTrigger id="trace-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENTITY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <EntityPicker
            id="trace-entity"
            label={ENTITY_LABELS[entityType]}
            queryKey={["idf", "picker", "trace", entityType]}
            load={loader}
            value={entityId}
            onChange={setEntityId}
            emptyMessage="Sem registos deste tipo."
          />
        </CardContent>
      </Card>

      {isLoading && <Skeleton className="h-96 w-full" />}
      {error && <p className="text-sm text-destructive">{toProblem(error).detail}</p>}
      {data && (
        <Card>
          <CardContent className="p-4 md:p-6">
            <TraceabilityTimeline chain={data} />
          </CardContent>
        </Card>
      )}
      {!entityId && !isLoading && (
        <p className="text-sm text-muted-foreground">Seleccione um registo para consultar a cadeia de custódia.</p>
      )}
    </div>
  );
};

export default TraceabilityPage;
