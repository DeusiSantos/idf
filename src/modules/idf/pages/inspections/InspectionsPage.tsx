import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Search as SearchIcon } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { CoordinatePicker } from "@/components/idf/CoordinatePicker";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInspectionFinding, completeInspection, listInspections, scheduleInspection, startInspection } from "@/modules/idf/api/inspections";
import {
  loadActiveLicenses,
  loadActiveOperators,
  loadClosedLots,
  loadExportProcesses,
  loadTransitGuides,
  loadWarehouses,
} from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { formatDate } from "@/lib/date";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type {
  AddInspectionFindingRequest,
  FindingSeverity,
  InspectionDto,
  InspectionStatus,
  ScheduleInspectionRequest,
  TargetEntityType,
} from "@/modules/idf/types";

const TARGET_LABELS: Record<TargetEntityType, string> = {
  ForestOperator: "Operador",
  ForestLot: "Lote",
  Warehouse: "Entreposto",
  TransitGuide: "Guia de trânsito",
  ExportProcess: "Exportação",
  ForestLicense: "Licença",
};

const SEVERITY_LABELS: Record<FindingSeverity, string> = {
  Low: "Baixa",
  Medium: "Média",
  High: "Alta",
  Critical: "Crítica",
};

const TARGET_PICKERS: Record<TargetEntityType, { load: () => Promise<import("@/components/idf/EntityPicker").PickerOption[]> }> = {
  ForestOperator: { load: loadActiveOperators },
  ForestLot: { load: loadClosedLots },
  Warehouse: { load: loadWarehouses },
  TransitGuide: { load: loadTransitGuides },
  ExportProcess: { load: loadExportProcesses },
  ForestLicense: { load: loadActiveLicenses },
};

const emptyFinding = (): AddInspectionFindingRequest => ({ description: "", severity: "Low" });

const FindingForm = ({ inspection }: { inspection: InspectionDto }) => {
  const [finding, setFinding] = useState(emptyFinding());
  const workflow = useWorkflow("Constatação registada");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Registar constatação</p>
      <div className="space-y-2">
        <Label htmlFor="find-desc">Descrição</Label>
        <Textarea
          id="find-desc"
          value={finding.description}
          onChange={(e) => setFinding({ ...finding, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="find-sev">Gravidade</Label>
        <Select
          value={finding.severity}
          onValueChange={(severity) => setFinding({ ...finding, severity: severity as FindingSeverity })}
        >
          <SelectTrigger id="find-sev">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SEVERITY_LABELS) as FindingSeverity[]).map((value) => (
              <SelectItem key={value} value={value}>
                {SEVERITY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy}
        onClick={() =>
          workflow.run(async () => {
            await addInspectionFinding(inspection.id, finding);
            setFinding(emptyFinding());
          })
        }
      >
        Registar constatação
      </Button>
    </div>
  );
};

const InspectionsPage = () => {
  const workflow = useWorkflow("Inspecção actualizada");

  return (
    <ResourceWorkspace<InspectionDto, ScheduleInspectionRequest>
      service={SERVICE.INSPECTIONS}
      title="Inspecções"
      description="Fiscalização no terreno com registo de coordenadas GPS e constatações."
      crumbs={[{ label: "Controlo" }, { label: "Inspecções" }]}
      queryKey="inspections"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem inspecções agendadas"
      statuses={["Scheduled", "InProgress", "Completed", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: SearchIcon },
        { key: "scheduled", label: "Agendadas", status: "Scheduled", icon: SearchIcon },
        { key: "completed", label: "Concluídas", status: "Completed", icon: SearchIcon },
      ]}
      fetchPage={({ page, status }) =>
        listInspections({ page, pageSize: 10, status: status as InspectionStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.inspectionNumber ?? `#${item.id.slice(0, 8)}`}
      columns={[
        {
          key: "number",
          header: "Inspecção",
          render: (item) => <span className="font-medium">{item.inspectionNumber ?? `#${item.id.slice(0, 8)}`}</span>,
        },
        { key: "target", header: "Alvo", render: (item) => TARGET_LABELS[item.targetEntityType] },
        { key: "date", header: "Data agendada", render: (item) => formatDate(item.scheduledDate) },
        { key: "findings", header: "Constatações", render: (item) => item.findings.length },
      ]}
      create={{
        label: "Agendar inspecção",
        dialogTitle: "Agendar inspecção",
        wide: true,
        initial: () => ({
          scheduledDate: "",
          targetEntityId: "",
          targetEntityType: "ForestOperator",
          location: { latitude: 0, longitude: 0 },
          billableAmount: null,
          billableCurrency: null,
        }),
        submit: scheduleInspection,
        render: ({ value, setValue, errors }) => (
          <>
            <div className="space-y-2">
              <Label htmlFor="insp-type">Tipo de alvo</Label>
              <Select
                value={value.targetEntityType}
                onValueChange={(targetEntityType) =>
                  setValue((prev) => ({ ...prev, targetEntityType: targetEntityType as TargetEntityType, targetEntityId: "" }))
                }
              >
                <SelectTrigger id="insp-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TARGET_LABELS) as TargetEntityType[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {TARGET_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <EntityPicker
              id="insp-target"
              label="Entidade alvo"
              queryKey={["idf", "picker", "inspection-target", value.targetEntityType]}
              load={TARGET_PICKERS[value.targetEntityType].load}
              value={value.targetEntityId}
              onChange={(v) => setValue((prev) => ({ ...prev, targetEntityId: v }))}
              error={fieldError(errors, "targetEntityId")}
            />
            <div className="space-y-2">
              <Label htmlFor="insp-date">Data agendada</Label>
              <Input
                id="insp-date"
                type="date"
                value={value.scheduledDate}
                onChange={(e) => setValue((prev) => ({ ...prev, scheduledDate: e.target.value }))}
              />
              {fieldError(errors, "scheduledDate") && (
                <p className="text-sm text-destructive">{fieldError(errors, "scheduledDate")}</p>
              )}
            </div>
            <CoordinatePicker
              label="Localização"
              value={value.location}
              onChange={(location) => setValue((prev) => ({ ...prev, location }))}
            />
          </>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Alvo</dt>
              <dd className="font-medium">{TARGET_LABELS[item.targetEntityType]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Data agendada</dt>
              <dd className="font-medium">{formatDate(item.scheduledDate)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Coordenadas</dt>
              <dd className="font-medium">
                {item.location.latitude}, {item.location.longitude}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Constatações ({item.findings.length})</p>
            {item.findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem constatações registadas.</p>
            ) : (
              <ul className="space-y-2">
                {item.findings.map((finding) => (
                  <li key={finding.id} className="space-y-1 rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{finding.description}</span>
                      <Badge variant="outline">{SEVERITY_LABELS[finding.severity]}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {item.status === "InProgress" && <FindingForm inspection={item} />}

          <Separator />

          <WorkflowActions
            service={SERVICE.INSPECTIONS}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "start",
                label: "Iniciar no terreno",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Scheduled"],
                onRun: () => workflow.run(() => startInspection(item.id)),
              },
              {
                key: "complete",
                label: "Concluir inspecção",
                permission: PERMISSION.UPDATE,
                enabledFor: ["InProgress"],
                onRun: () => workflow.run(() => completeInspection(item.id)),
              },
            ]}
          />

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/inspections/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default InspectionsPage;
