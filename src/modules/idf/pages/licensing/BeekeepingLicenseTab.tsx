import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { CoordinatePicker } from "@/components/idf/CoordinatePicker";
import { FileUploadField } from "@/components/idf/FileUploadField";
import { LicensingWorkflowPanel } from "@/components/idf/LicensingWorkflowPanel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE } from "@/modules/idf/config/modules";
import { loadSpecies } from "@/modules/idf/api/pickers";
import { beekeepingWorkflow, createBeekeepingLicense, listBeekeepingLicenses } from "@/modules/idf/mock/licensing";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type {
  BeekeepingHolderType,
  BeekeepingLandRegime,
  BeekeepingLicenseDto,
  BeekeepingProduct,
  CreateBeekeepingLicenseRequest,
  HiveType,
} from "@/modules/idf/types/licensing";

const HOLDER_TYPES: { value: BeekeepingHolderType; label: string }[] = [
  { value: "Individual", label: "Individual" },
  { value: "Cooperative", label: "Cooperativa" },
  { value: "Company", label: "Empresa" },
];
const HIVE_TYPES: { value: HiveType; label: string }[] = [
  { value: "Traditional", label: "Tradicional" },
  { value: "Langstroth", label: "Langstroth" },
  { value: "Kenyan", label: "Kenyan" },
  { value: "Other", label: "Outra" },
];
const LAND_REGIMES: { value: BeekeepingLandRegime; label: string }[] = [
  { value: "PublicForestDomain", label: "Domínio público florestal" },
  { value: "GrantedArea", label: "Área concedida" },
  { value: "OwnLand", label: "Terreno próprio" },
  { value: "CommunityArea", label: "Área comunitária" },
];
const PRODUCTS: { value: BeekeepingProduct; label: string }[] = [
  { value: "Honey", label: "Mel" },
  { value: "Wax", label: "Cera" },
  { value: "Propolis", label: "Própolis" },
  { value: "Pollen", label: "Pólen" },
];

const BeekeepingLicenseTab = () => {
  const workflow = useWorkflow("Pedido de apicultura actualizado");
  const { data: speciesOptions } = useQuery({ queryKey: ["idf", "picker", "species"], queryFn: loadSpecies });

  return (
    <ResourceWorkspace<BeekeepingLicenseDto, CreateBeekeepingLicenseRequest>
      service={SERVICE.LICENSING}
      title="Apicultura (PR-13)"
      description="Modo simplificado — titular, colmeias, regime fundiário e produção anual."
      crumbs={[{ label: "Exploração" }, { label: "Licenciamento" }, { label: "Apicultura" }]}
      queryKey="licensing-beekeeping"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem pedidos registados"
      statuses={["Draft", "Submitted", "PrecheckVerification", "PendingPayment", "Issued", "Active", "Expired"]}
      fetchPage={({ page, status }) => listBeekeepingLicenses({ page, pageSize: 10, status })}
      getStatus={(item) => item.status}
      getTitle={(item) => item.apiaryRegistrationNumber ?? `#${item.id.slice(0, 8)}`}
      columns={[
        { key: "holder", header: "Titular", render: (item) => item.holderName },
        { key: "hives", header: "Colmeias", render: (item) => `${item.hiveCount} (${HIVE_TYPES.find((h) => h.value === item.hiveType)?.label})` },
        { key: "regime", header: "Regime", render: (item) => LAND_REGIMES.find((r) => r.value === item.landRegime)?.label },
      ]}
      create={{
        label: "Novo pedido",
        dialogTitle: "Pedido — Apicultura",
        wide: true,
        initial: () => ({
          holderType: "Individual",
          holderName: "",
          holderTaxId: null,
          coordinates: { latitude: 0, longitude: 0 },
          hiveCount: 0,
          hiveType: "Traditional",
          supportSpeciesCodes: [],
          landRegime: "OwnLand",
          concessionAuthorizationFileReference: null,
          productionLines: [],
        }),
        submit: createBeekeepingLicense,
        render: ({ value, setValue, errors }) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bk-holder-type">Tipo de titular</Label>
                <Select value={value.holderType} onValueChange={(v) => setValue((prev) => ({ ...prev, holderType: v as BeekeepingHolderType, holderTaxId: v === "Individual" ? null : prev.holderTaxId }))}>
                  <SelectTrigger id="bk-holder-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOLDER_TYPES.map((h) => (
                      <SelectItem key={h.value} value={h.value}>
                        {h.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bk-name">Nome</Label>
                <Input id="bk-name" value={value.holderName} onChange={(e) => setValue((prev) => ({ ...prev, holderName: e.target.value }))} />
                {fieldError(errors, "holderName") && <p className="text-sm text-destructive">{fieldError(errors, "holderName")}</p>}
              </div>
            </div>

            {value.holderType !== "Individual" && (
              <div className="space-y-2">
                <Label htmlFor="bk-taxid">NIF</Label>
                <Input id="bk-taxid" value={value.holderTaxId ?? ""} onChange={(e) => setValue((prev) => ({ ...prev, holderTaxId: e.target.value }))} />
              </div>
            )}

            <CoordinatePicker label="Localização do apiário (GPS)" value={value.coordinates} onChange={(coordinates) => setValue((prev) => ({ ...prev, coordinates }))} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bk-hive-count">Nº de colmeias</Label>
                <Input id="bk-hive-count" type="number" value={value.hiveCount || ""} onChange={(e) => setValue((prev) => ({ ...prev, hiveCount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bk-hive-type">Tipo de colmeia</Label>
                <Select value={value.hiveType} onValueChange={(v) => setValue((prev) => ({ ...prev, hiveType: v as HiveType }))}>
                  <SelectTrigger id="bk-hive-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HIVE_TYPES.map((h) => (
                      <SelectItem key={h.value} value={h.value}>
                        {h.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Espécies florestais de suporte (opcional)</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 sm:grid-cols-3">
                {(speciesOptions ?? []).map((s) => (
                  <label key={s.value} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={value.supportSpeciesCodes.includes(s.value)}
                      onCheckedChange={(checked) =>
                        setValue((prev) => ({
                          ...prev,
                          supportSpeciesCodes: checked ? [...prev.supportSpeciesCodes, s.value] : prev.supportSpeciesCodes.filter((c) => c !== s.value),
                        }))
                      }
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bk-regime">Regime fundiário</Label>
              <Select value={value.landRegime} onValueChange={(v) => setValue((prev) => ({ ...prev, landRegime: v as BeekeepingLandRegime }))}>
                <SelectTrigger id="bk-regime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LAND_REGIMES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {value.landRegime === "GrantedArea" && (
              <div className="space-y-2 rounded-lg border p-3">
                <FileUploadField
                  id="bk-authorization"
                  label="Autorização do concessionário"
                  value={value.concessionAuthorizationFileReference}
                  onChange={(v) => setValue((prev) => ({ ...prev, concessionAuthorizationFileReference: v }))}
                  error={fieldError(errors, "concessionAuthorizationFileReference")}
                />
                <p className="text-xs text-muted-foreground">A apicultura é uso compatível — não exclui a concessão existente.</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Produção anual</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setValue((prev) => ({ ...prev, productionLines: [...prev.productionLines, { product: "Honey", quantityKg: 0, year: new Date().getFullYear() }] }))}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Acrescentar linha
                </Button>
              </div>
              {value.productionLines.map((line, index) => (
                <div key={index} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-4">
                  <Select value={line.product} onValueChange={(v) => setValue((prev) => ({ ...prev, productionLines: prev.productionLines.map((l, i) => (i === index ? { ...l, product: v as BeekeepingProduct } : l)) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Quantidade (kg)"
                    value={line.quantityKg || ""}
                    onChange={(e) => setValue((prev) => ({ ...prev, productionLines: prev.productionLines.map((l, i) => (i === index ? { ...l, quantityKg: Number(e.target.value) } : l)) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Ano"
                    value={line.year || ""}
                    onChange={(e) => setValue((prev) => ({ ...prev, productionLines: prev.productionLines.map((l, i) => (i === index ? { ...l, year: Number(e.target.value) } : l)) }))}
                  />
                  <Button type="button" size="icon" variant="ghost" onClick={() => setValue((prev) => ({ ...prev, productionLines: prev.productionLines.filter((_, i) => i !== index) }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ),
      }}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Titular</dt>
              <dd className="font-medium">{item.holderName} ({HOLDER_TYPES.find((h) => h.value === item.holderType)?.label})</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Nº registo do apiário</dt>
              <dd className="font-medium">{item.apiaryRegistrationNumber ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Colmeias</dt>
              <dd className="font-medium">{item.hiveCount} ({HIVE_TYPES.find((h) => h.value === item.hiveType)?.label})</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Regime fundiário</dt>
              <dd className="font-medium">{LAND_REGIMES.find((r) => r.value === item.landRegime)?.label}</dd>
            </div>
          </dl>

          <LicensingWorkflowPanel
            service={SERVICE.LICENSING}
            status={item.status}
            feeAmount={item.feeAmount}
            paymentConfirmed={item.paymentConfirmed}
            verificationCode={item.verificationCode}
            isBusy={workflow.isBusy}
            onSubmit={() => workflow.run(() => beekeepingWorkflow.submit(item.id))}
            onVerify={() => workflow.run(() => beekeepingWorkflow.verify(item.id))}
            onMarkPendingPayment={(amount) => workflow.run(async () => { await beekeepingWorkflow.markPendingPayment(item.id, amount); refresh(); })}
            onConfirmPayment={() => workflow.run(() => beekeepingWorkflow.confirmPayment(item.id))}
            onIssue={() => workflow.run(() => beekeepingWorkflow.issue(item.id))}
            onActivate={() => workflow.run(() => beekeepingWorkflow.activate(item.id))}
          />
        </div>
      )}
    />
  );
};

export default BeekeepingLicenseTab;
