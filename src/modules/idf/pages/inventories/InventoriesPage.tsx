import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, Trees } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { CoordinatePicker } from "@/components/idf/CoordinatePicker";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getConcession } from "@/modules/idf/api/concessions";
import {
  beginInventorySurvey,
  beginInventoryTechnicalReview,
  createInventory,
  listInventories,
  registerTree,
  rejectInventory,
  submitInventory,
  validateInventory,
} from "@/modules/idf/api/inventories";
import { loadActiveConcessions, loadSpecies } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { formatDate } from "@/lib/date";
import type {
  CreateInventoryRequest,
  ForestInventoryDto,
  ForestInventoryStatus,
  RegisterTreeRequest,
} from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const emptyTree = (): RegisterTreeRequest => ({
  speciesCode: "",
  coordinate: { latitude: 0, longitude: 0 },
  diameter: 0,
  height: 0,
  volume: { value: 0, unit: "m3" },
});

const TreeForm = ({ inventory }: { inventory: ForestInventoryDto }) => {
  const [tree, setTree] = useState<RegisterTreeRequest>(emptyTree());
  const workflow = useWorkflow("Árvore registada");

  // Mostra os 4 pontos da concessão no mapa como referência, para a árvore ser colocada dentro da área.
  const { data: concession } = useQuery({
    queryKey: ["idf", "concessions", inventory.concessionId],
    queryFn: () => getConcession(inventory.concessionId),
  });

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Registar árvore</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <EntityPicker
          id="tree-species"
          label="Espécie"
          queryKey={["idf", "picker", "species"]}
          load={loadSpecies}
          value={tree.speciesCode}
          onChange={(v) => setTree({ ...tree, speciesCode: v })}
        />
        <div className="space-y-2">
          <Label htmlFor="tree-diameter">Diâmetro / DAP (cm)</Label>
          <Input
            id="tree-diameter"
            type="number"
            value={tree.diameter || ""}
            onChange={(e) => setTree({ ...tree, diameter: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tree-height">Altura (m)</Label>
          <Input
            id="tree-height"
            type="number"
            value={tree.height || ""}
            onChange={(e) => setTree({ ...tree, height: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tree-volume">Volume (m3)</Label>
          <Input
            id="tree-volume"
            type="number"
            step="0.01"
            value={tree.volume.value || ""}
            onChange={(e) => setTree({ ...tree, volume: { value: Number(e.target.value), unit: "m3" } })}
          />
        </div>
      </div>
      <CoordinatePicker
        value={tree.coordinate}
        onChange={(coordinate) => setTree({ ...tree, coordinate })}
        boundary={concession?.boundary}
        helper="Clique no mapa (dentro do limite da concessão) ou arraste o marcador para ajustar. Também pode introduzir manualmente."
      />
      <Button
        size="sm"
        disabled={workflow.isBusy}
        onClick={() =>
          workflow.run(async () => {
            await registerTree(inventory.id, tree);
            setTree(emptyTree());
          })
        }
      >
        Adicionar árvore
      </Button>
    </div>
  );
};

const InventoriesPage = () => {
  const workflow = useWorkflow("Inventário actualizado");

  return (
    <ResourceWorkspace<ForestInventoryDto, CreateInventoryRequest>
      service={SERVICE.INVENTORIES}
      title="Inventários Florestais"
      description="Levantamento das árvores da concessão: espécie, coordenadas, DAP, altura e volume."
      crumbs={[{ label: "Planeamento" }, { label: "Inventários" }]}
      queryKey="inventories"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem inventários registados"
      statuses={["Draft", "InProgress", "Submitted", "UnderTechnicalReview", "Validated", "Rejected"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Trees },
        { key: "progress", label: "Em curso", status: "InProgress", icon: Trees },
        { key: "review", label: "Em análise técnica", status: "UnderTechnicalReview", icon: Trees },
        { key: "validated", label: "Validados", status: "Validated", icon: Trees },
      ]}
      fetchPage={({ page, status }) =>
        listInventories({ page, pageSize: 10, status: status as ForestInventoryStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => shortId(item.id)}
      columns={[
        {
          key: "id",
          header: "Inventário",
          render: (item) => <span className="font-medium">{shortId(item.id)}</span>,
        },
        {
          key: "concession",
          header: "Concessão",
          render: (item) => <EntityLabel kind="concession" id={item.concessionId} />,
        },
        {
          key: "validity",
          header: "Validade",
          render: (item) => `${formatDate(item.validityPeriod.startDate)} → ${formatDate(item.validityPeriod.endDate)}`,
        },
        { key: "trees", header: "Árvores", render: (item) => item.trees.length },
      ]}
      create={{
        label: "Novo inventário",
        dialogTitle: "Abrir inventário florestal",
        dialogDescription: "Cabeçalho do inventário; as árvores são registadas no detalhe.",
        initial: () => ({ concessionId: "", validityPeriod: { startDate: "", endDate: "" } }),
        submit: createInventory,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="inv-concession"
              label="Concessão"
              queryKey={["idf", "picker", "active-concessions"]}
              load={loadActiveConcessions}
              value={value.concessionId}
              onChange={(v) => setValue((prev) => ({ ...prev, concessionId: v }))}
              emptyMessage="Não existem concessões activas."
              error={fieldError(errors, "concessionId")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inv-start">Início da validade</Label>
                <Input
                  id="inv-start"
                  type="date"
                  value={value.validityPeriod.startDate}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, startDate: e.target.value } }))
                  }
                />
                {fieldError(errors, "validityPeriod.startDate") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "validityPeriod.startDate")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-end">Fim da validade</Label>
                <Input
                  id="inv-end"
                  type="date"
                  value={value.validityPeriod.endDate}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, endDate: e.target.value } }))
                  }
                />
                {fieldError(errors, "validityPeriod.endDate") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "validityPeriod.endDate")}</p>
                )}
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
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(item.validityPeriod.startDate)} → {formatDate(item.validityPeriod.endDate)}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Árvores inventariadas ({item.trees.length})</p>
            {item.trees.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ainda sem árvores registadas.</p>
            ) : (
              <ul className="space-y-2">
                {item.trees.map((tree) => (
                  <li key={tree.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
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
                  </li>
                ))}
              </ul>
            )}
          </div>

          {item.status === "InProgress" && <TreeForm inventory={item} />}

          <Separator />

          <WorkflowActions
            service={SERVICE.INVENTORIES}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "begin-survey",
                label: "Iniciar levantamento",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Draft"],
                onRun: () => workflow.run(() => beginInventorySurvey(item.id)),
              },
              {
                key: "submit",
                label: "Submeter",
                permission: PERMISSION.UPDATE,
                enabledFor: ["InProgress"],
                onRun: () => workflow.run(() => submitInventory(item.id)),
              },
              {
                key: "review",
                label: "Colocar em análise técnica",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Submitted"],
                onRun: () => workflow.run(() => beginInventoryTechnicalReview(item.id)),
              },
              {
                key: "validate",
                label: "Validar",
                permission: PERMISSION.APPROVE,
                enabledFor: ["UnderTechnicalReview"],
                onRun: () => workflow.run(() => validateInventory(item.id)),
              },
              {
                key: "reject",
                label: "Rejeitar",
                permission: PERMISSION.APPROVE,
                variant: "destructive",
                enabledFor: ["UnderTechnicalReview"],
                onRun: () => workflow.run(() => rejectInventory(item.id)),
              },
            ]}
          />

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/inventories/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default InventoriesPage;
