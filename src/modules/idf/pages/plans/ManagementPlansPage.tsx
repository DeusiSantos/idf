import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, ExternalLink } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { addCuttingSelection, approveManagementPlan, beginTechnicalReview, createManagementPlan, listManagementPlans, submitManagementPlan } from "@/modules/idf/api/managementPlans";
import { getInventory, listInventoryTrees } from "@/modules/idf/api/inventories";
import { loadActiveConcessions, loadValidatedInventories } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { formatDate } from "@/lib/date";
import type { CreateManagementPlanRequest, ManagementPlanDto, ManagementPlanStatus } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const treesInPlan = (plan: ManagementPlanDto) => plan.cuttingSelections.reduce((sum, s) => sum + s.trees.length, 0);

/** Selecção de árvores concretas para uma nova selecção de corte — só faz sentido com Draft/Submitted (regra 3.3). */
const CuttingSelectionForm = ({ plan }: { plan: ManagementPlanDto }) => {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const workflow = useWorkflow("Selecção de corte adicionada");

  const alreadySelected = new Set(plan.cuttingSelections.flatMap((s) => s.trees.map((t) => t.inventoryTreeId)));

  const { data: trees, isLoading } = useQuery({
    queryKey: ["idf", "inventory-trees", plan.concessionId, plan.forestInventoryId, "Inventoried"],
    queryFn: () => listInventoryTrees(plan.concessionId, plan.forestInventoryId, { status: "Inventoried" }),
  });
  const available = (trees ?? []).filter((t) => !alreadySelected.has(t.id));

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = (selectAllInventoried: boolean) =>
    workflow.run(async () => {
      await addCuttingSelection(plan.id, {
        name,
        treeIds: selectAllInventoried ? undefined : selectedIds,
        selectAllInventoried,
      });
      setName("");
      setSelectedIds([]);
    });

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Nova selecção de corte</p>
      <div className="space-y-2">
        <Label htmlFor="sel-name">Nome</Label>
        <Input id="sel-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Bloco Norte" />
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : available.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sem árvores inventariadas disponíveis (já seleccionadas neste plano ou inventário vazio).
        </p>
      ) : (
        <div className="max-h-56 space-y-1 overflow-y-auto rounded-md border p-2">
          {available.map((tree) => (
            <label key={tree.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted/50">
              <Checkbox checked={selectedIds.includes(tree.id)} onCheckedChange={() => toggle(tree.id)} />
              <span className="flex-1 truncate">{tree.code}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                <EntityLabel kind="species" id={tree.speciesCode} /> · {tree.volume.value} {tree.volume.unit}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={workflow.isBusy || !name.trim() || selectedIds.length === 0}
          onClick={() => submit(false)}
        >
          Adicionar selecção ({selectedIds.length})
        </Button>
        {available.length > 0 && (
          <Button size="sm" variant="outline" disabled={workflow.isBusy || !name.trim()} onClick={() => submit(true)}>
            Seleccionar todas as inventariadas
          </Button>
        )}
      </div>
    </div>
  );
};

/** Mostra as selecções já gravadas, resolvendo o código de cada árvore a partir do inventário. */
const CuttingSelectionsList = ({ plan }: { plan: ManagementPlanDto }) => {
  const { data: inventory } = useQuery({
    queryKey: ["idf", "inventories", plan.forestInventoryId],
    queryFn: () => getInventory(plan.forestInventoryId),
  });
  const treeById = new Map((inventory?.trees ?? []).map((t) => [t.id, t]));

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Selecções de corte ({treesInPlan(plan)} árvore(s))</p>
      {plan.cuttingSelections.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem selecções de corte definidas.</p>
      ) : (
        <ul className="space-y-2">
          {plan.cuttingSelections.map((selection) => (
            <li key={selection.name} className="rounded-md border p-3 text-sm">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ManagementPlansPage = () => {
  const workflow = useWorkflow("Plano actualizado");

  return (
    <ResourceWorkspace<ManagementPlanDto, CreateManagementPlanRequest>
      service={SERVICE.MANAGEMENT_PLANS}
      title="Planos de Maneio"
      description="Planos de gestão florestal por concessão, com selecção de árvores concretas do inventário para corte."
      crumbs={[{ label: "Planeamento" }, { label: "Planos de Maneio" }]}
      queryKey="plans"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem planos de maneio"
      statuses={["Draft", "Submitted", "UnderTechnicalReview", "Approved", "Rejected", "Suspended", "Expired"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: ClipboardList },
        { key: "review", label: "Em análise técnica", status: "UnderTechnicalReview", icon: ClipboardList },
        { key: "approved", label: "Aprovados", status: "Approved", icon: ClipboardList },
      ]}
      fetchPage={({ page, status }) =>
        listManagementPlans({ page, pageSize: 10, status: status as ManagementPlanStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => shortId(item.id)}
      columns={[
        { key: "id", header: "Plano", render: (item) => <span className="font-medium">{shortId(item.id)}</span> },
        {
          key: "concession",
          header: "Concessão",
          render: (item) => <EntityLabel kind="concession" id={item.concessionId} />,
        },
        {
          key: "inventory",
          header: "Inventário",
          render: (item) => <EntityLabel kind="inventory" id={item.forestInventoryId} />,
        },
        { key: "trees", header: "Árvores seleccionadas", render: (item) => treesInPlan(item) },
        {
          key: "validity",
          header: "Validade",
          render: (item) => `${formatDate(item.validityPeriod.startDate)} → ${formatDate(item.validityPeriod.endDate)}`,
        },
      ]}
      create={{
        label: "Novo plano",
        dialogTitle: "Registar plano de maneio",
        dialogDescription: "Requer um inventário Validado da mesma concessão (a selecção de árvores é feita depois de criado).",
        wide: true,
        initial: () => ({
          concessionId: "",
          forestInventoryId: "",
          validityPeriod: { startDate: "", endDate: "" },
        }),
        submit: createManagementPlan,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="plan-concession"
              label="Concessão"
              queryKey={["idf", "picker", "active-concessions"]}
              load={loadActiveConcessions}
              value={value.concessionId}
              onChange={(v) => setValue((prev) => ({ ...prev, concessionId: v, forestInventoryId: "" }))}
              emptyMessage="Não existem concessões activas."
              error={fieldError(errors, "concessionId")}
            />
            <EntityPicker
              id="plan-inventory"
              label="Inventário validado"
              queryKey={["idf", "picker", "validated-inventories", value.concessionId]}
              load={() => loadValidatedInventories(value.concessionId)}
              value={value.forestInventoryId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestInventoryId: v }))}
              emptyMessage="Não existem inventários validados para esta concessão."
              error={fieldError(errors, "forestInventoryId")}
              disabled={!value.concessionId}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-start">Início</Label>
                <Input
                  id="plan-start"
                  type="date"
                  value={value.validityPeriod.startDate}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, startDate: e.target.value } }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-end">Fim</Label>
                <Input
                  id="plan-end"
                  type="date"
                  value={value.validityPeriod.endDate}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, endDate: e.target.value } }))
                  }
                />
              </div>
            </div>
          </>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Concessão</dt>
              <dd className="font-medium">
                <EntityLabel kind="concession" id={item.concessionId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Inventário</dt>
              <dd className="font-medium">
                <EntityLabel kind="inventory" id={item.forestInventoryId} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(item.validityPeriod.startDate)} → {formatDate(item.validityPeriod.endDate)}
              </dd>
            </div>
          </dl>

          <Separator />

          <CuttingSelectionsList plan={item} />

          {(item.status === "Draft" || item.status === "Submitted") && <CuttingSelectionForm plan={item} />}
          {treesInPlan(item) === 0 && (item.status === "Draft" || item.status === "Submitted") && (
            <p className="text-xs text-muted-foreground">O plano precisa de pelo menos uma árvore seleccionada para poder ser submetido.</p>
          )}

          <Separator />

          <WorkflowActions
            service={SERVICE.MANAGEMENT_PLANS}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "submit",
                label: "Submeter",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Draft"],
                onRun: () => workflow.run(() => submitManagementPlan(item.id)),
              },
              {
                key: "review",
                label: "Colocar em análise técnica",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Submitted"],
                onRun: () => workflow.run(() => beginTechnicalReview(item.id)),
              },
              {
                key: "approve",
                label: "Aprovar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["Submitted", "UnderTechnicalReview"],
                onRun: () => workflow.run(() => approveManagementPlan(item.id)),
              },
            ]}
          />
          {item.status === "Approved" && (
            <p className="text-xs text-muted-foreground">
              As árvores seleccionadas foram autorizadas para exploração (AuthorizedForExploitation).
            </p>
          )}

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/management-plans/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default ManagementPlansPage;
