import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInventory } from "@/modules/idf/api/inventories";
import {
  approveManagementPlan,
  beginTechnicalReview,
  getManagementPlan,
  submitManagementPlan,
} from "@/modules/idf/api/managementPlans";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const ManagementPlanDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Plano actualizado");

  const { data: plan, isLoading } = useQuery({
    queryKey: ["idf", "plans", id],
    queryFn: () => getManagementPlan(id),
  });

  const { data: inventory } = useQuery({
    queryKey: ["idf", "inventories", plan?.forestInventoryId],
    queryFn: () => getInventory(plan!.forestInventoryId),
    enabled: !!plan,
  });
  const treeById = new Map((inventory?.trees ?? []).map((t) => [t.id, t]));

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!plan) return <p className="text-muted-foreground">Plano de maneio não encontrado.</p>;

  const totalTrees = plan.cuttingSelections.reduce((sum, s) => sum + s.trees.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Plano de Maneio ${shortId(plan.id)}`}
        description={`${totalTrees} árvore(s) seleccionada(s) em ${plan.cuttingSelections.length} selecção(ões)`}
        crumbs={[
          { label: "Planeamento" },
          { label: "Planos de Maneio", to: "/idf/management-plans" },
          { label: shortId(plan.id) },
        ]}
        actions={<StatusBadge status={plan.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="concession" id={plan.concessionId} />
        <RelatedEntityCard kind="inventory" id={plan.forestInventoryId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <WorkflowActions
            service={SERVICE.MANAGEMENT_PLANS}
            status={plan.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "submit",
                label: "Submeter",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Draft"],
                onRun: () => workflow.run(() => submitManagementPlan(plan.id)),
              },
              {
                key: "review",
                label: "Colocar em análise técnica",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Submitted"],
                onRun: () => workflow.run(() => beginTechnicalReview(plan.id)),
              },
              {
                key: "approve",
                label: "Aprovar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["Submitted", "UnderTechnicalReview"],
                onRun: () => workflow.run(() => approveManagementPlan(plan.id)),
              },
            ]}
          />
          {plan.status === "Approved" && (
            <p className="text-xs text-muted-foreground">
              As árvores seleccionadas foram autorizadas para exploração (AuthorizedForExploitation).
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validade</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">
            {formatDate(plan.validityPeriod.startDate)} → {formatDate(plan.validityPeriod.endDate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selecções de corte ({totalTrees} árvore(s))</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {plan.cuttingSelections.length === 0 ? (
            <p className="text-muted-foreground">Sem selecções de corte definidas.</p>
          ) : (
            plan.cuttingSelections.map((selection) => (
              <div key={selection.name} className="rounded-md border p-3">
                <p className="font-medium">
                  {selection.name} · {selection.trees.length} árvore(s)
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {selection.trees.map(({ inventoryTreeId }) => (
                    <li key={inventoryTreeId} className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                      {treeById.get(inventoryTreeId)?.code ?? shortId(inventoryTreeId)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementPlanDetailPage;
