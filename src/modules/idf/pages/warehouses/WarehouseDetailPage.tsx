import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWarehouse } from "@/modules/idf/api/warehouses";
import { formatDate } from "@/lib/date";
import type { WarehouseMovementType } from "@/modules/idf/types";

const MOVEMENT_TYPE_LABELS: Record<WarehouseMovementType, string> = {
  Entry: "Entrada",
  Exit: "Saída",
  InternalTransfer: "Transferência interna",
  Adjustment: "Ajuste",
};

const WarehouseDetailPage = () => {
  const { id = "" } = useParams();

  const { data: warehouse, isLoading } = useQuery({
    queryKey: ["idf", "warehouses", id],
    queryFn: () => getWarehouse(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!warehouse) return <p className="text-muted-foreground">Entreposto não encontrado.</p>;

  const relatedLotIds = Array.from(
    new Set([...warehouse.stocks.map((s) => s.forestLotId), ...warehouse.movements.map((m) => m.forestLotId).filter(Boolean)]),
  ) as string[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={warehouse.name}
        description={`Código ${warehouse.code}`}
        crumbs={[{ label: "Cadeia de Custódia" }, { label: "Entrepostos", to: "/idf/warehouses" }, { label: warehouse.name }]}
        actions={<StatusBadge status={warehouse.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        {relatedLotIds.map((lotId) => (
          <RelatedEntityCard key={lotId} kind="lot" id={lotId} />
        ))}
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Stock total</dt>
              <dd className="text-lg font-semibold">
                {warehouse.stocks.reduce((sum, s) => sum + s.volume, 0).toLocaleString("pt-AO")} m3
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Localização</dt>
              <dd className="font-medium">
                {warehouse.location.latitude.toFixed(4)}, {warehouse.location.longitude.toFixed(4)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock por lote ({warehouse.stocks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {warehouse.stocks.length === 0 ? (
            <p className="text-muted-foreground">Sem stock registado.</p>
          ) : (
            warehouse.stocks.map((stock) => (
              <div key={stock.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <EntityLabel kind="lot" id={stock.forestLotId} />
                  <StatusBadge status={stock.stockStatus} />
                </div>
                <p className="text-muted-foreground">{stock.volume} m3</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Movimentos ({warehouse.movements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {warehouse.movements.length === 0 ? (
            <p className="text-muted-foreground">Sem movimentos registados.</p>
          ) : (
            warehouse.movements.map((movement) => (
              <div key={movement.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{MOVEMENT_TYPE_LABELS[movement.movementType]}</span>
                  <span className="text-muted-foreground">{formatDate(movement.movementDate)}</span>
                </div>
                <p className="text-muted-foreground">
                  {movement.forestLotId ? <EntityLabel kind="lot" id={movement.forestLotId} /> : "—"} · {movement.volume} m3
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseDetailPage;
