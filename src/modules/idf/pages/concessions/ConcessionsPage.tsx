import { Link } from "react-router-dom";
import { ExternalLink, Map as MapIcon } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { BoundaryPicker } from "@/components/idf/BoundaryPicker";
import { LocationFields } from "@/components/idf/LocationFields";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  activateConcession,
  approveConcession,
  beginConcessionReview,
  createConcession,
  listConcessions,
  submitConcession,
} from "@/modules/idf/api/concessions";
import { loadActiveOperators } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { formatDate } from "@/lib/date";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { useIdf } from "@/modules/idf/context/IdfContext";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { ConcessionDto, ConcessionStatus, CreateConcessionRequest } from "@/modules/idf/types";

const TYPES: { value: ConcessionDto["type"]; label: string }[] = [
  { value: "ForestConcession", label: "Concessão florestal" },
  { value: "CommunityForest", label: "Floresta comunitária" },
  { value: "Other", label: "Outro" },
];

const ConcessionsPage = () => {
  const workflow = useWorkflow("Concessão actualizada");
  const { selectConcession, selectedConcessionId } = useIdf();

  return (
    <ResourceWorkspace<ConcessionDto, CreateConcessionRequest>
      service={SERVICE.CONCESSIONS}
      title="Concessões"
      description="Áreas florestais atribuídas a operadores activos, com validade, área e polígono geográfico."
      crumbs={[{ label: "Cadastro" }, { label: "Concessões" }]}
      queryKey="concessions"
      searchPlaceholder="Pesquisar por código"
      emptyMessage="Sem concessões registadas"
      statuses={["Draft", "Submitted", "UnderReview", "Approved", "Active", "Suspended", "Expired", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: MapIcon },
        { key: "active", label: "Activas", status: "Active", icon: MapIcon },
        { key: "review", label: "Em análise", status: "UnderReview", icon: MapIcon },
        { key: "expired", label: "Expiradas", status: "Expired", icon: MapIcon },
      ]}
      fetchPage={({ page, search, status }) =>
        listConcessions({ page, pageSize: 10, code: search, status: status as ConcessionStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.code}
      columns={[
        { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.code}</span> },
        {
          key: "operator",
          header: "Operador",
          render: (item) => <EntityLabel kind="operator" id={item.forestOperatorId} />,
        },
        { key: "type", header: "Tipo", render: (item) => TYPES.find((t) => t.value === item.type)?.label ?? item.type },
        { key: "area", header: "Área (ha)", render: (item) => item.areaHectares.toLocaleString("pt-AO") },
        {
          key: "validity",
          header: "Validade",
          render: (item) => `${formatDate(item.validityPeriod.startDate)} → ${formatDate(item.validityPeriod.endDate)}`,
        },
      ]}
      create={{
        label: "Nova concessão",
        dialogTitle: "Registar concessão",
        dialogDescription: "Apenas operadores activos podem receber concessões (regra 9.7).",
        wide: true,
        initial: () => ({
          forestOperatorId: "",
          type: "ForestConcession",
          validityPeriod: { startDate: "", endDate: "" },
          areaHectares: 0,
          boundary: {
            point1: { latitude: 0, longitude: 0 },
            point2: { latitude: 0, longitude: 0 },
            point3: { latitude: 0, longitude: 0 },
            point4: { latitude: 0, longitude: 0 },
          },
          location: { province: "", municipality: "", commune: "" },
        }),
        submit: createConcession,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="operator"
              label="Operador florestal"
              queryKey={["idf", "picker", "active-operators"]}
              load={loadActiveOperators}
              value={value.forestOperatorId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestOperatorId: v }))}
              emptyMessage="Não existem operadores activos."
              error={fieldError(errors, "forestOperatorId")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={value.type}
                  onValueChange={(v) => setValue((prev) => ({ ...prev, type: v as ConcessionDto["type"] }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Início da validade</Label>
                <Input
                  id="start"
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
                <Label htmlFor="end">Fim da validade</Label>
                <Input
                  id="end"
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
              <div className="space-y-2">
                <Label htmlFor="area">Área (hectares)</Label>
                <Input
                  id="area"
                  type="number"
                  min={0}
                  value={value.areaHectares || ""}
                  onChange={(e) => setValue((prev) => ({ ...prev, areaHectares: Number(e.target.value) }))}
                />
                {fieldError(errors, "areaHectares") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "areaHectares")}</p>
                )}
              </div>
            </div>
            <LocationFields
              value={value.location}
              onChange={(location) => setValue((prev) => ({ ...prev, location }))}
              errors={errors}
            />
            <BoundaryPicker
              value={value.boundary}
              onChange={(boundary) => setValue((prev) => ({ ...prev, boundary }))}
              error={fieldError(errors, "boundary")}
            />
          </>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Operador</dt>
              <dd className="font-medium">
                <EntityLabel kind="operator" id={item.forestOperatorId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="font-medium">{TYPES.find((t) => t.value === item.type)?.label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Área</dt>
              <dd className="font-medium">{item.areaHectares.toLocaleString("pt-AO")} ha</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(item.validityPeriod.startDate)} → {formatDate(item.validityPeriod.endDate)}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Localização administrativa</dt>
              <dd className="font-medium">
                {item.location
                  ? [item.location.commune, item.location.municipality, item.location.province].filter(Boolean).join(", ")
                  : "Não definida"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Área geográfica (polígono)</dt>
              {item.boundary ? (
                <dd className="mt-1 grid grid-cols-2 gap-1 text-xs">
                  {(["point1", "point2", "point3", "point4"] as const).map((key, index) => (
                    <span key={key} className="font-medium text-foreground">
                      V{index + 1}: {item.boundary![key].latitude}, {item.boundary![key].longitude}
                    </span>
                  ))}
                </dd>
              ) : (
                <dd className="font-medium">Não definida</dd>
              )}
            </div>
          </dl>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Fluxo do processo</p>
            <WorkflowActions
              service={SERVICE.CONCESSIONS}
              status={item.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitConcession(item.id)),
                },
                {
                  key: "review",
                  label: "Colocar em análise",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Submitted"],
                  onRun: () => workflow.run(() => beginConcessionReview(item.id)),
                },
                {
                  key: "approve",
                  label: "Aprovar",
                  permission: PERMISSION.APPROVE,
                  enabledFor: ["Submitted", "UnderReview"],
                  onRun: () => workflow.run(() => approveConcession(item.id)),
                },
                {
                  key: "activate",
                  label: "Activar",
                  permission: PERMISSION.ENABLE,
                  enabledFor: ["Approved"],
                  onRun: () => workflow.run(() => activateConcession(item.id)),
                },
              ]}
            />
          </div>

          {item.status === "Active" && (
            <Button
              variant={selectedConcessionId === item.id ? "secondary" : "outline"}
              className="w-full"
              onClick={() => selectConcession(item.id, item.code)}
            >
              {selectedConcessionId === item.id ? "Concessão activa no contexto" : "Usar como concessão de trabalho"}
            </Button>
          )}

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/concessions/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default ConcessionsPage;
