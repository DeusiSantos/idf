import { Link } from "react-router-dom";
import { ExternalLink, Gauge } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { VolumeProgress } from "@/components/idf/VolumeProgress";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { approveQuota, beginQuotaAnalysis, listQuotas, requestQuota } from "@/modules/idf/api/quotas";
import { loadActiveConcessions, loadApprovedPlans, loadValidatedInventories } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { ForestQuotaDto, QuotaStatus, RequestQuotaRequest } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const QuotasPage = () => {
  const workflow = useWorkflow("Quota actualizada");

  return (
    <ResourceWorkspace<ForestQuotaDto, RequestQuotaRequest>
      service={SERVICE.QUOTAS}
      title="Quotas"
      description="Volume autorizado por concessão. Exige inventário validado e plano de maneio aprovado (regra 9.2)."
      crumbs={[{ label: "Planeamento" }, { label: "Quotas" }]}
      queryKey="quotas"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem quotas registadas"
      statuses={["Requested", "UnderAnalysis", "Approved", "PartiallyUsed", "Consumed", "Expired", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Gauge },
        { key: "approved", label: "Aprovadas", status: "Approved", icon: Gauge },
        { key: "partial", label: "Parcialmente usadas", status: "PartiallyUsed", icon: Gauge },
        { key: "consumed", label: "Consumidas", status: "Consumed", icon: Gauge },
      ]}
      fetchPage={({ page, status }) => listQuotas({ page, pageSize: 10, status: status as QuotaStatus | "all" })}
      getStatus={(item) => item.status}
      getTitle={(item) => shortId(item.id)}
      columns={[
        { key: "id", header: "Quota", render: (item) => <span className="font-medium">{shortId(item.id)}</span> },
        {
          key: "concession",
          header: "Concessão",
          render: (item) => <EntityLabel kind="concession" id={item.concessionId} />,
        },
        {
          key: "volume",
          header: "Volume (m3)",
          render: (item) =>
            `${item.consumedVolume.toLocaleString("pt-AO")} / ${item.authorizedVolume.toLocaleString("pt-AO")}`,
        },
      ]}
      create={{
        label: "Nova quota",
        dialogTitle: "Pedido de quota",
        dialogDescription: "Seleccione a concessão, o inventário validado e o plano aprovado.",
        wide: true,
        initial: () => ({ concessionId: "", forestInventoryId: "", managementPlanId: "", authorizedVolume: 0 }),
        submit: requestQuota,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="quota-concession"
              label="Concessão"
              queryKey={["idf", "picker", "active-concessions"]}
              load={loadActiveConcessions}
              value={value.concessionId}
              onChange={(v) =>
                setValue((prev) => ({ ...prev, concessionId: v, forestInventoryId: "", managementPlanId: "" }))
              }
              error={fieldError(errors, "concessionId")}
            />
            <EntityPicker
              id="quota-inventory"
              label="Inventário validado"
              queryKey={["idf", "picker", "inventories", value.concessionId]}
              load={() => loadValidatedInventories(value.concessionId || undefined)}
              value={value.forestInventoryId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestInventoryId: v }))}
              emptyMessage="Sem inventários validados para esta concessão."
              error={fieldError(errors, "forestInventoryId")}
            />
            <EntityPicker
              id="quota-plan"
              label="Plano de maneio aprovado"
              queryKey={["idf", "picker", "plans", value.concessionId]}
              load={() => loadApprovedPlans(value.concessionId || undefined)}
              value={value.managementPlanId}
              onChange={(v) => setValue((prev) => ({ ...prev, managementPlanId: v }))}
              emptyMessage="Sem planos aprovados para esta concessão."
              error={fieldError(errors, "managementPlanId")}
            />
            <div className="space-y-2">
              <Label htmlFor="quota-volume">Volume autorizado (m3)</Label>
              <Input
                id="quota-volume"
                type="number"
                value={value.authorizedVolume || ""}
                onChange={(e) => setValue((prev) => ({ ...prev, authorizedVolume: Number(e.target.value) }))}
              />
              {fieldError(errors, "authorizedVolume") && (
                <p className="text-sm text-destructive">{fieldError(errors, "authorizedVolume")}</p>
              )}
            </div>
          </>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <VolumeProgress consumed={item.consumedVolume} authorized={item.authorizedVolume} unit="m3" />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Concessão</dt>
              <dd className="font-medium">
                <EntityLabel kind="concession" id={item.concessionId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Saldo</dt>
              <dd className="font-medium">{item.remainingVolume.toLocaleString("pt-AO")} m3</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Inventário</dt>
              <dd className="font-medium">
                <EntityLabel kind="inventory" id={item.forestInventoryId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Plano de maneio</dt>
              <dd className="font-medium">
                <EntityLabel kind="plan" id={item.managementPlanId} />
              </dd>
            </div>
          </dl>

          <Separator />

          <WorkflowActions
            service={SERVICE.QUOTAS}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "analysis",
                label: "Colocar em análise",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Requested"],
                onRun: () => workflow.run(() => beginQuotaAnalysis(item.id)),
              },
              {
                key: "approve",
                label: "Aprovar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["UnderAnalysis"],
                onRun: () => workflow.run(() => approveQuota(item.id)),
              },
            ]}
          />
          <p className="text-xs text-muted-foreground">
            O consumo da quota é registado automaticamente a cada licença emitida (regra 9.4).
          </p>

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/quotas/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default QuotasPage;
