import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { CoordinatePicker } from "@/components/idf/CoordinatePicker";
import { LicensingWorkflowPanel } from "@/components/idf/LicensingWorkflowPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SERVICE } from "@/modules/idf/config/modules";
import { loadActiveOperators } from "@/modules/idf/api/pickers";
import {
  createFirewoodLicense,
  firewoodWorkflow,
  getCarbonizationCoefficient,
  getRubricQuotaBalance,
  listFirewoodLicenses,
  loadCarbonizationUnits,
  loadClosedFirewoodLots,
} from "@/modules/idf/mock/licensing";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { CreateFirewoodLicenseRequest, FirewoodLicenseDto, FirewoodProduct, FirewoodUnit } from "@/modules/idf/types/licensing";

const PRODUCTS: { value: FirewoodProduct; label: string }[] = [
  { value: "Firewood", label: "Lenha" },
  { value: "Charcoal", label: "Carvão vegetal" },
  { value: "WildHoney", label: "Mel silvestre" },
  { value: "Resin", label: "Resina" },
  { value: "Fiber", label: "Fibra" },
  { value: "MedicinalPlant", label: "Planta medicinal" },
  { value: "Fruit", label: "Fruto" },
  { value: "Other", label: "Outro" },
];

const UNITS: { value: FirewoodUnit; label: string }[] = [
  { value: "m3", label: "m³" },
  { value: "ton", label: "Tonelada" },
  { value: "standardSack", label: "Saco normalizado" },
  { value: "kg", label: "kg" },
  { value: "unit", label: "Unidade" },
];

const FirewoodLicenseTab = () => {
  const workflow = useWorkflow("Pedido actualizado");

  return (
    <ResourceWorkspace<FirewoodLicenseDto, CreateFirewoodLicenseRequest>
      service={SERVICE.LICENSING}
      title="Lenha, Carvão e PFNL (PR-11)"
      description="Modo simplificado — requerente com ou sem registo, produto, quantidade e localização."
      crumbs={[{ label: "Exploração" }, { label: "Licenciamento" }, { label: "Lenha, Carvão e PFNL" }]}
      queryKey="licensing-firewood"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem pedidos registados"
      statuses={["Draft", "Submitted", "PrecheckVerification", "PendingPayment", "Issued", "Active", "Expired"]}
      fetchPage={({ page, status }) => listFirewoodLicenses({ page, pageSize: 10, status })}
      getStatus={(item) => item.status}
      getTitle={(item) => item.verificationCode ?? `#${item.id.slice(0, 8)}`}
      columns={[
        { key: "applicant", header: "Requerente", render: (item) => item.applicantName },
        { key: "product", header: "Produto", render: (item) => PRODUCTS.find((p) => p.value === item.product)?.label },
        { key: "quantity", header: "Quantidade", render: (item) => `${item.quantity} ${UNITS.find((u) => u.value === item.unit)?.label}` },
      ]}
      create={{
        label: "Novo pedido",
        dialogTitle: "Pedido — Lenha, Carvão e PFNL",
        wide: true,
        initial: () => ({
          applicantMode: "Simplified",
          applicantName: "",
          applicantContact: "",
          operatorId: null,
          product: "Firewood",
          quantity: 0,
          unit: "m3",
          locationMode: "Commune",
          coordinates: null,
          commune: "",
          carbonizationUnitId: null,
          sourceFirewoodLotId: null,
        }),
        submit: createFirewoodLicense,
        render: ({ value, setValue, errors }) => {
          const balance = getRubricQuotaBalance(value.product);
          const overBalance = value.quantity > balance;

          return (
            <>
              <RadioGroup
                value={value.applicantMode}
                onValueChange={(v) => setValue((prev) => ({ ...prev, applicantMode: v as "Simplified" | "Registered", operatorId: v === "Registered" ? prev.operatorId : null }))}
                className="flex gap-4"
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="Simplified" /> Requerente simplificado
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="Registered" /> Operador registado
                </label>
              </RadioGroup>

              {value.applicantMode === "Simplified" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fw-name">Nome</Label>
                    <Input id="fw-name" value={value.applicantName} onChange={(e) => setValue((prev) => ({ ...prev, applicantName: e.target.value }))} />
                    {fieldError(errors, "applicantName") && <p className="text-sm text-destructive">{fieldError(errors, "applicantName")}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fw-contact">Contacto</Label>
                    <Input id="fw-contact" value={value.applicantContact ?? ""} onChange={(e) => setValue((prev) => ({ ...prev, applicantContact: e.target.value }))} />
                  </div>
                </div>
              ) : (
                <EntityPicker
                  id="fw-operator"
                  label="Operador"
                  queryKey={["idf", "picker", "active-operators"]}
                  load={loadActiveOperators}
                  value={value.operatorId ?? ""}
                  onChange={(v) => setValue((prev) => ({ ...prev, operatorId: v, applicantName: "" }))}
                  error={fieldError(errors, "operatorId")}
                />
              )}

              <div className="space-y-2">
                <Label>Produto</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRODUCTS.map((p) => (
                    <Button
                      key={p.value}
                      type="button"
                      variant={value.product === p.value ? "default" : "outline"}
                      className="h-auto py-3 text-sm"
                      onClick={() => setValue((prev) => ({ ...prev, product: p.value }))}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fw-unit">Unidade</Label>
                  {/* Mudar de unidade limpa a quantidade — nunca converte silenciosamente. */}
                  <Select value={value.unit} onValueChange={(v) => setValue((prev) => ({ ...prev, unit: v as FirewoodUnit, quantity: 0 }))}>
                    <SelectTrigger id="fw-unit">
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
                <div className="space-y-2">
                  <Label htmlFor="fw-quantity">Quantidade</Label>
                  <Input
                    id="fw-quantity"
                    type="number"
                    className={cn(overBalance && "border-destructive")}
                    value={value.quantity || ""}
                    onChange={(e) => setValue((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <p className={cn("text-xs", overBalance ? "text-destructive" : "text-muted-foreground")}>
                Saldo de quota da rubrica: {balance} {UNITS.find((u) => u.value === value.unit)?.label}
                {overBalance ? " — quantidade acima do saldo." : ""}
              </p>

              <RadioGroup
                value={value.locationMode}
                onValueChange={(v) => setValue((prev) => ({ ...prev, locationMode: v as "Coordinates" | "Commune" }))}
                className="flex gap-4"
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="Commune" /> Por comuna
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="Coordinates" /> Por coordenadas
                </label>
              </RadioGroup>
              {value.locationMode === "Commune" ? (
                <div className="space-y-2">
                  <Label htmlFor="fw-commune">Comuna</Label>
                  <Input id="fw-commune" value={value.commune ?? ""} onChange={(e) => setValue((prev) => ({ ...prev, commune: e.target.value }))} />
                </div>
              ) : (
                <CoordinatePicker
                  value={value.coordinates ?? { latitude: 0, longitude: 0 }}
                  onChange={(coordinates) => setValue((prev) => ({ ...prev, coordinates }))}
                />
              )}

              {value.product === "Charcoal" && (
                <div className="space-y-4 rounded-lg border p-3">
                  <EntityPicker
                    id="fw-carbonization-unit"
                    label="Unidade de carbonização"
                    queryKey={["idf", "picker", "carbonization-units"]}
                    load={loadCarbonizationUnits}
                    value={value.carbonizationUnitId ?? ""}
                    onChange={(v) => setValue((prev) => ({ ...prev, carbonizationUnitId: v }))}
                  />
                  <div className="space-y-2">
                    <Label>Coeficiente de conversão lenha→carvão</Label>
                    <Input readOnly disabled value={getCarbonizationCoefficient(value.carbonizationUnitId) ?? "—"} />
                  </div>
                  <EntityPicker
                    id="fw-source-lot"
                    label="Lote de lenha de origem (opcional)"
                    queryKey={["idf", "picker", "closed-firewood-lots"]}
                    load={loadClosedFirewoodLots}
                    value={value.sourceFirewoodLotId ?? ""}
                    onChange={(v) => setValue((prev) => ({ ...prev, sourceFirewoodLotId: v }))}
                    emptyMessage="Sem lotes de lenha disponíveis."
                  />
                </div>
              )}
            </>
          );
        },
      }}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Requerente</dt>
              <dd className="font-medium">{item.applicantMode === "Registered" ? <EntityLabel kind="operator" id={item.operatorId} /> : item.applicantName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Produto</dt>
              <dd className="font-medium">{PRODUCTS.find((p) => p.value === item.product)?.label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Quantidade</dt>
              <dd className="font-medium">{item.quantity} {UNITS.find((u) => u.value === item.unit)?.label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Localização</dt>
              <dd className="font-medium">{item.locationMode === "Commune" ? item.commune : `${item.coordinates?.latitude}, ${item.coordinates?.longitude}`}</dd>
            </div>
          </dl>

          <LicensingWorkflowPanel
            service={SERVICE.LICENSING}
            status={item.status}
            feeAmount={item.feeAmount}
            paymentConfirmed={item.paymentConfirmed}
            verificationCode={item.verificationCode}
            isBusy={workflow.isBusy}
            onSubmit={() => workflow.run(() => firewoodWorkflow.submit(item.id))}
            onVerify={() => workflow.run(() => firewoodWorkflow.verify(item.id))}
            onMarkPendingPayment={(amount) => workflow.run(async () => { await firewoodWorkflow.markPendingPayment(item.id, amount); refresh(); })}
            onConfirmPayment={() => workflow.run(() => firewoodWorkflow.confirmPayment(item.id))}
            onIssue={() => workflow.run(() => firewoodWorkflow.issue(item.id))}
            onActivate={() => workflow.run(() => firewoodWorkflow.activate(item.id))}
          />
        </div>
      )}
    />
  );
};

export default FirewoodLicenseTab;
