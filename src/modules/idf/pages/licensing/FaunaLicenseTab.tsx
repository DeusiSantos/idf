import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { FileUploadField } from "@/components/idf/FileUploadField";
import { PolygonBoundaryDrawer } from "@/components/idf/PolygonBoundaryDrawer";
import { LicensingWorkflowPanel } from "@/components/idf/LicensingWorkflowPanel";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE, PERMISSION } from "@/modules/idf/config/modules";
import { loadActiveOperators } from "@/modules/idf/api/pickers";
import { loadRecognizedEntities } from "@/modules/idf/mock/recognizedEntities";
import {
  FAUNA_SPECIES,
  checkFaunaAreaOverlap,
  createFaunaLicense,
  faunaWorkflow,
  getFaunaSpeciesRule,
  isWithinClosedSeason,
  listFaunaLicenses,
  setFaunaRevocationStatus,
} from "@/modules/idf/mock/licensing";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { usePermission } from "@/modules/idf/hooks/usePermission";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { CreateFaunaLicenseRequest, FaunaDestination, FaunaLicenseDto, FaunaUnit, SupervenientRevocationStatus } from "@/modules/idf/types/licensing";

const UNITS: { value: FaunaUnit; label: string }[] = [
  { value: "Specimen", label: "Exemplares" },
  { value: "Kg", label: "kg" },
];
const DESTINATIONS: { value: FaunaDestination; label: string }[] = [
  { value: "InternalConsumption", label: "Consumo interno" },
  { value: "DomesticTrade", label: "Comercialização interna" },
  { value: "Export", label: "Exportação" },
];
const CAPTURE_METHODS = ["Armadilha", "Rede", "Abate directo", "Captura viva", "Outro"];
const REVOCATION_STATUSES: { value: SupervenientRevocationStatus; label: string }[] = [
  { value: "None", label: "Nenhuma" },
  { value: "Suspended", label: "Suspensa" },
  { value: "Reduced", label: "Reduzida" },
  { value: "ExportProhibited", label: "Exportação proibida" },
];

const FaunaLicenseTab = () => {
  const workflow = useWorkflow("Pedido de fauna actualizado");
  const isAdmin = usePermission(SERVICE.LICENSING, PERMISSION.APPROVE);

  return (
    <ResourceWorkspace<FaunaLicenseDto, CreateFaunaLicenseRequest>
      service={SERVICE.LICENSING}
      title="Recursos Faunísticos (PR-12)"
      description="Captura/abate de fauna — espécie, período (respeita época de defeso) e destino."
      crumbs={[{ label: "Exploração" }, { label: "Licenciamento" }, { label: "Recursos Faunísticos" }]}
      queryKey="licensing-fauna"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem pedidos registados"
      statuses={["Draft", "Submitted", "PrecheckVerification", "PendingPayment", "Issued", "Active", "Expired"]}
      fetchPage={({ page, status }) => listFaunaLicenses({ page, pageSize: 10, status })}
      getStatus={(item) => item.status}
      getTitle={(item) => item.verificationCode ?? `#${item.id.slice(0, 8)}`}
      columns={[
        { key: "applicant", header: "Requerente", render: (item) => <EntityLabel kind="operator" id={item.applicantId} /> },
        { key: "species", header: "Espécie", render: (item) => FAUNA_SPECIES.find((s) => s.code === item.speciesCode)?.name ?? item.speciesCode },
        { key: "quantity", header: "Quantidade", render: (item) => `${item.quantity} ${UNITS.find((u) => u.value === item.unit)?.label}` },
      ]}
      create={{
        label: "Novo pedido",
        dialogTitle: "Pedido — Recursos Faunísticos",
        wide: true,
        initial: () => ({
          applicantId: "",
          speciesCode: "",
          quantity: 0,
          unit: "Specimen",
          captureMethod: CAPTURE_METHODS[0],
          boundary: [],
          periodStart: "",
          periodEnd: "",
          destination: "InternalConsumption",
          faunaStudyFileReference: null,
          faunaStudyAuthorEntityId: null,
          subjectToInternationalConvention: false,
          internationalConventionDetail: null,
        }),
        submit: createFaunaLicense,
        render: ({ value, setValue, errors }) => {
          const rule = getFaunaSpeciesRule(value.speciesCode);
          const closedSeason = rule && isWithinClosedSeason(rule, value.periodStart, value.periodEnd);
          const overlapsConservationArea = checkFaunaAreaOverlap(value.boundary);

          return (
            <>
              <EntityPicker
                id="fauna-applicant"
                label="Requerente"
                queryKey={["idf", "picker", "active-operators"]}
                load={loadActiveOperators}
                value={value.applicantId}
                onChange={(v) => setValue((prev) => ({ ...prev, applicantId: v }))}
                error={fieldError(errors, "applicantId")}
              />

              <div className="space-y-2">
                <Label htmlFor="fauna-species">Espécie</Label>
                <Select value={value.speciesCode} onValueChange={(v) => setValue((prev) => ({ ...prev, speciesCode: v }))}>
                  <SelectTrigger id="fauna-species">
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAUNA_SPECIES.map((s) => (
                      <SelectItem key={s.code} value={s.code} disabled={s.status === "Prohibited"}>
                        <span className="flex items-center gap-2">
                          {s.name}
                          <StatusBadge status={s.status === "Prohibited" ? "Rejected" : s.status === "Conditional" ? "UnderReview" : "Active"} />
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError(errors, "speciesCode") && <p className="text-sm text-destructive">{fieldError(errors, "speciesCode")}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fauna-quantity">Quantidade</Label>
                  <Input id="fauna-quantity" type="number" value={value.quantity || ""} onChange={(e) => setValue((prev) => ({ ...prev, quantity: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fauna-unit">Unidade</Label>
                  <Select value={value.unit} onValueChange={(v) => setValue((prev) => ({ ...prev, unit: v as FaunaUnit }))}>
                    <SelectTrigger id="fauna-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fauna-method">Método de captura</Label>
                <Select value={value.captureMethod} onValueChange={(v) => setValue((prev) => ({ ...prev, captureMethod: v }))}>
                  <SelectTrigger id="fauna-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAPTURE_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <PolygonBoundaryDrawer
                label="Área do registo (polígono)"
                value={value.boundary}
                onChange={(boundary) => setValue((prev) => ({ ...prev, boundary }))}
              />
              {overlapsConservationArea && (
                <p className="text-sm text-warning-foreground">⚠ A área desenhada sobrepõe-se a uma área de conservação ambiental.</p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fauna-start">Início do período</Label>
                  <Input id="fauna-start" type="date" value={value.periodStart} onChange={(e) => setValue((prev) => ({ ...prev, periodStart: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fauna-end">Fim do período</Label>
                  <Input id="fauna-end" type="date" value={value.periodEnd} onChange={(e) => setValue((prev) => ({ ...prev, periodEnd: e.target.value }))} />
                </div>
              </div>
              {closedSeason && rule && (
                <p className="text-sm text-destructive">
                  Período dentro da época de defeso de {rule.name} ({rule.closedSeasonStart} a {rule.closedSeasonEnd}).
                </p>
              )}
              {fieldError(errors, "periodStart") && <p className="text-sm text-destructive">{fieldError(errors, "periodStart")}</p>}

              <div className="space-y-2">
                <Label htmlFor="fauna-destination">Destino</Label>
                <Select value={value.destination} onValueChange={(v) => setValue((prev) => ({ ...prev, destination: v as FaunaDestination }))}>
                  <SelectTrigger id="fauna-destination">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FileUploadField
                id="fauna-study"
                label="Estudo faunístico"
                value={value.faunaStudyFileReference}
                onChange={(v) => setValue((prev) => ({ ...prev, faunaStudyFileReference: v }))}
              />
              <EntityPicker
                id="fauna-study-author"
                label="Autor do estudo (Entidade Reconhecida)"
                queryKey={["idf", "picker", "recognized-entities", "fauna-study"]}
                load={() => loadRecognizedEntities("FaunaStudy")}
                value={value.faunaStudyAuthorEntityId ?? ""}
                onChange={(v) => setValue((prev) => ({ ...prev, faunaStudyAuthorEntityId: v }))}
                emptyMessage="Sem entidades reconhecidas para estudo faunístico."
              />

              <div className="space-y-2 rounded-lg border p-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={value.subjectToInternationalConvention}
                    onCheckedChange={(checked) => setValue((prev) => ({ ...prev, subjectToInternationalConvention: Boolean(checked) }))}
                  />
                  Sujeita a convenção internacional
                </label>
                {value.subjectToInternationalConvention && (
                  <Input
                    placeholder="Detalhe da convenção (ex. CITES, apêndice)"
                    value={value.internationalConventionDetail ?? ""}
                    onChange={(e) => setValue((prev) => ({ ...prev, internationalConventionDetail: e.target.value }))}
                  />
                )}
              </div>
            </>
          );
        },
      }}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Requerente</dt>
              <dd className="font-medium">
                <EntityLabel kind="operator" id={item.applicantId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Espécie</dt>
              <dd className="font-medium">{FAUNA_SPECIES.find((s) => s.code === item.speciesCode)?.name ?? item.speciesCode}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Período</dt>
              <dd className="font-medium">{item.periodStart} → {item.periodEnd}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Destino</dt>
              <dd className="font-medium">{DESTINATIONS.find((d) => d.value === item.destination)?.label}</dd>
            </div>
          </dl>

          {(item.status === "Issued" || item.status === "Active") && (
            <div className="space-y-2">
              <Label>Estado de revogação superveniente</Label>
              <Select
                value={item.supervenientRevocationStatus}
                disabled={!isAdmin}
                onValueChange={(v) => workflow.run(async () => { await setFaunaRevocationStatus(item.id, v as SupervenientRevocationStatus); refresh(); })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REVOCATION_STATUSES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isAdmin && <p className="text-xs text-muted-foreground">Editável só por administrador.</p>}
            </div>
          )}

          <LicensingWorkflowPanel
            service={SERVICE.LICENSING}
            status={item.status}
            feeAmount={item.feeAmount}
            paymentConfirmed={item.paymentConfirmed}
            verificationCode={item.verificationCode}
            isBusy={workflow.isBusy}
            onSubmit={() => workflow.run(() => faunaWorkflow.submit(item.id))}
            onVerify={() => workflow.run(() => faunaWorkflow.verify(item.id))}
            onMarkPendingPayment={(amount) => workflow.run(async () => { await faunaWorkflow.markPendingPayment(item.id, amount); refresh(); })}
            onConfirmPayment={() => workflow.run(() => faunaWorkflow.confirmPayment(item.id))}
            onIssue={() => workflow.run(() => faunaWorkflow.issue(item.id))}
            onActivate={() => workflow.run(() => faunaWorkflow.activate(item.id))}
          />
        </div>
      )}
    />
  );
};

export default FaunaLicenseTab;
