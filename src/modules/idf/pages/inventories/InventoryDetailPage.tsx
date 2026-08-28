import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  beginInventorySurvey,
  beginInventoryTechnicalReview,
  getInventory,
  rejectInventory,
  submitInventory,
  validateInventory,
} from "@/modules/idf/api/inventories";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const InventoryDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Inventário actualizado");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["idf", "inventories", id],
    queryFn: () => getInventory(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!inventory) return <p className="text-muted-foreground">Inventário não encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Inventário ${shortId(inventory.id)}`}
        description={`${inventory.trees.length} árvore(s) inventariada(s)`}
        crumbs={[{ label: "Planeamento" }, { label: "Inventários", to: "/idf/inventories" }, { label: shortId(inventory.id) }]}
        actions={<StatusBadge status={inventory.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="concession" id={inventory.concessionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.INVENTORIES}
            status={inventory.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "begin-survey",
                label: "Iniciar levantamento",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Draft"],
                onRun: () => workflow.run(() => beginInventorySurvey(inventory.id)),
              },
              {
                key: "submit",
                label: "Submeter",
                permission: PERMISSION.UPDATE,
                enabledFor: ["InProgress"],
                onRun: () => workflow.run(() => submitInventory(inventory.id)),
              },
              {
                key: "review",
                label: "Colocar em análise técnica",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Submitted"],
                onRun: () => workflow.run(() => beginInventoryTechnicalReview(inventory.id)),
              },
              {
                key: "validate",
                label: "Validar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["UnderTechnicalReview"],
                onRun: () => workflow.run(() => validateInventory(inventory.id)),
              },
              {
                key: "reject",
                label: "Rejeitar",
                permission: PERMISSION.APPROVE,
                variant: "destructive",
                enabledFor: ["UnderTechnicalReview"],
                onRun: () => workflow.run(() => rejectInventory(inventory.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validade</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">
            {formatDate(inventory.validityPeriod.startDate)} → {formatDate(inventory.validityPeriod.endDate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Árvores inventariadas ({inventory.trees.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {inventory.trees.length === 0 ? (
            <p className="text-muted-foreground">Ainda sem árvores registadas.</p>
          ) : (
            inventory.trees.map((tree) => (
              <div key={tree.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tree.code}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      <EntityLabel kind="species" id={tree.speciesCode} />
                    </span>
                    <StatusBadge status={tree.status} />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  DAP {tree.diameter} cm · {tree.height} m · {tree.volume.value} {tree.volume.unit} ·{" "}
                  {tree.coordinate.latitude}, {tree.coordinate.longitude}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDetailPage;
