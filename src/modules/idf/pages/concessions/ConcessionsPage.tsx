import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Map as MapIcon } from "lucide-react";
import { ResourceWorkspace, type CreateFormContext } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PolygonBoundaryDrawer } from "@/components/idf/PolygonBoundaryDrawer";
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
import { getForestArea } from "@/modules/idf/api/areas";
import { loadActiveOperators, loadEligibleForestAreas } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { formatDate } from "@/lib/date";
import { isPolygonWithinPolygon, polygonAreaHectares, polygonBoundsFree } from "@/lib/geoPolygon";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { useIdf } from "@/modules/idf/context/IdfContext";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { ACQUISITION_METHODS, createExtension, getAreaCommitment, type AcquisitionMethod } from "@/modules/idf/mock/concessionProcess";
import { buildInitialPhases, emptyCharges } from "@/modules/idf/mock/concessionPhases";
import { ApiError } from "@/modules/idf/types";
import type { ConcessionDto, ConcessionStatus, CoordinateDto, CreateConcessionRequest, PolygonDto } from "@/modules/idf/types";

const TYPES: { value: ConcessionDto["type"]; label: string }[] = [
  { value: "ForestConcession", label: "Concessão florestal" },
  { value: "CommunityForest", label: "Floresta comunitária" },
  { value: "Other", label: "Outro" },
];

/** Rectângulo envolvente da parcela, só para satisfazer o contrato real (`boundary`, 4 pontos fixos) — nunca editado à mão. */
const boundsToPolygonDto = (boundary: CoordinateDto[]): PolygonDto => {
  const [[minLng, minLat], [maxLng, maxLat]] = polygonBoundsFree(boundary);
  return {
    point1: { latitude: maxLat, longitude: minLng },
    point2: { latitude: maxLat, longitude: maxLng },
    point3: { latitude: minLat, longitude: maxLng },
    point4: { latitude: minLat, longitude: minLng },
  };
};

/**
 * Campo `acquisitionMethod`/`parentAreaId`/`parcelBoundary` são só do protótipo (extensão mock) —
 * nunca vão no `CreateConcessionRequest` real, que continua a receber `areaHectares`/`boundary`
 * derivados da parcela (ver `submit`). `location` deixa de ser editável aqui — é sempre herdada da
 * Área-mãe (o utilizador só a preenche uma vez, no Registo de Área).
 */
type ConcessionFormValue = Omit<CreateConcessionRequest, "areaHectares" | "boundary"> & {
  acquisitionMethod: AcquisitionMethod;
  parentAreaId: string;
  parcelBoundary: CoordinateDto[];
};

/**
 * Componente próprio (não uma função solta) porque usa hooks (`useQuery`) — o `render` do
 * `ResourceWorkspace` só é chamado enquanto o diálogo está aberto, por isso um hook chamado
 * directamente dentro do callback violaria as regras dos hooks (nº de hooks variável entre renders).
 */
const ConcessionCreateFields = ({ value, setValue, errors }: CreateFormContext<ConcessionFormValue>) => {
  const { data: area } = useQuery({
    queryKey: ["idf", "areas", value.parentAreaId],
    queryFn: async () => {
      const loaded = await getForestArea(value.parentAreaId);
      // Pré-preenche a localização da concessão a partir da Área-mãe (ajustável a seguir).
      setValue((prev) => ({ ...prev, location: { ...loaded.location, commune: prev.location.commune || loaded.location.commune } }));
      return loaded;
    },
    enabled: !!value.parentAreaId,
  });
  const { data: commitment } = useQuery({
    queryKey: ["idf", "concessions", "area-commitment", value.parentAreaId],
    queryFn: () => getAreaCommitment(value.parentAreaId),
    enabled: !!value.parentAreaId,
  });
  const available = area && commitment ? area.calculatedAreaHectares - commitment.committedHectares : null;
  const parcelArea = polygonAreaHectares(value.parcelBoundary);

  return (
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

      <EntityPicker
        id="parent-area"
        label="Área registada"
        queryKey={["idf", "picker", "eligible-areas"]}
        load={loadEligibleForestAreas}
        value={value.parentAreaId}
        onChange={(v) => setValue((prev) => ({ ...prev, parentAreaId: v, parcelBoundary: [] }))}
        emptyMessage="Sem áreas com parecer Conforme/ConformeComReserva."
        error={fieldError(errors, "parentAreaId")}
      />
      {area && (
        <p className="text-sm text-muted-foreground">
          Área disponível para concessão: <span className="font-medium text-foreground">{available?.toFixed(2)} ha</span> de{" "}
          <span className="font-medium text-foreground">{area.calculatedAreaHectares} ha</span> totais.
        </p>
      )}

      {area && (
        <PolygonBoundaryDrawer
          label="Parcela a conceder"
          value={value.parcelBoundary}
          onChange={(parcelBoundary) => setValue((prev) => ({ ...prev, parcelBoundary }))}
          referenceBoundary={area.boundary}
          helper="Desenhe a parcela dentro do polígono a tracejado (limite da Área registada)."
          error={fieldError(errors, "parcelBoundary")}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={value.type} onValueChange={(v) => setValue((prev) => ({ ...prev, type: v as ConcessionDto["type"] }))}>
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
          <Label htmlFor="acquisition-method">Via de atribuição</Label>
          <Select
            value={value.acquisitionMethod}
            onValueChange={(v) => setValue((prev) => ({ ...prev, acquisitionMethod: v as AcquisitionMethod }))}
          >
            <SelectTrigger id="acquisition-method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACQUISITION_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
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
            onChange={(e) => setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, startDate: e.target.value } }))}
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
            onChange={(e) => setValue((prev) => ({ ...prev, validityPeriod: { ...prev.validityPeriod, endDate: e.target.value } }))}
          />
          {fieldError(errors, "validityPeriod.endDate") && (
            <p className="text-sm text-destructive">{fieldError(errors, "validityPeriod.endDate")}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Área (ha) — calculada a partir da parcela</Label>
          <Input readOnly disabled value={parcelArea ? parcelArea.toFixed(2) : "—"} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Localização administrativa herdada da Área-mãe. Anexos e restante tramitação (Fases A–H) preenchem-se no processo completo, depois de criada.
      </p>
    </>
  );
};

const ConcessionsPage = () => {
  const workflow = useWorkflow("Concessão actualizada");
  const { selectConcession, selectedConcessionId } = useIdf();

  return (
    <ResourceWorkspace<ConcessionDto, ConcessionFormValue>
      service={SERVICE.CONCESSIONS}
      title="Concessões"
      description="Parcelas recortadas de uma Área registada, atribuídas a operadores activos, com validade e tramitação legal."
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
        dialogDescription: "A concessão é sempre uma parcela recortada dentro do polígono de uma Área registada (regra 9.7).",
        wide: true,
        initial: () => ({
          forestOperatorId: "",
          type: "ForestConcession",
          validityPeriod: { startDate: "", endDate: "" },
          location: { province: "", municipality: "", commune: "" },
          acquisitionMethod: "SimplifiedContracting",
          parentAreaId: "",
          parcelBoundary: [],
        }),
        // Cria a concessão (mock — ver `api/concessions.ts`) com a área/boundary derivadas da
        // parcela (localização herdada da Área-mãe), depois a extensão mock (n.º de processo,
        // parcela, fases A–H) — ver `modules/idf/mock/concessionProcess.ts` e
        // `modules/idf/mock/concessionPhases.ts`. Os
        // anexos da Fase A e a restante tramitação preenchem-se depois, no processo completo.
        submit: async ({ acquisitionMethod, parentAreaId, parcelBoundary, ...request }) => {
          if (!parentAreaId) throw new ApiError({ status: 422, errors: { parentAreaId: ["Seleccione a Área registada."] } });
          const area = await getForestArea(parentAreaId);

          const errors: Record<string, string[]> = {};
          if (parcelBoundary.length < 3) errors.parcelBoundary = ["A parcela precisa de pelo menos 3 vértices."];
          else if (!isPolygonWithinPolygon(parcelBoundary, area.boundary)) errors.parcelBoundary = ["A parcela tem de ficar dentro do polígono da Área."];

          const parcelAreaHectares = Number(polygonAreaHectares(parcelBoundary).toFixed(2));
          if (!errors.parcelBoundary) {
            const { committedHectares } = await getAreaCommitment(parentAreaId);
            if (committedHectares + parcelAreaHectares > area.calculatedAreaHectares) {
              errors.parcelBoundary = [
                `A parcela (${parcelAreaHectares} ha) excede a área disponível (${(area.calculatedAreaHectares - committedHectares).toFixed(2)} ha de ${area.calculatedAreaHectares} ha totais).`,
              ];
            }
          }
          if (Object.keys(errors).length > 0) throw new ApiError({ status: 422, title: "Dados inválidos", errors });

          const concession = await createConcession({ ...request, areaHectares: parcelAreaHectares, boundary: boundsToPolygonDto(parcelBoundary) });
          await createExtension({
            concessionId: concession.id,
            method: acquisitionMethod,
            province: request.location.province,
            parentAreaId,
            parcelBoundary,
            parcelAreaHectares,
            phases: buildInitialPhases(),
            charges: emptyCharges(),
          });
          return concession;
        },
        render: (ctx) => <ConcessionCreateFields {...ctx} />,
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
            <p className="text-xs text-muted-foreground">
              A tramitação em 8 fases (A–H) e o gate de fiscal residente ficam no processo completo.
            </p>
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
