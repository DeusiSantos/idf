import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, Truck } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  beginTransit,
  beginTransitGuideValidation,
  completeTransitGuide,
  issueTransitGuide,
  listTransitGuides,
  markTransitGuidePaid,
  markTransitGuidePendingPayment,
  requestTransitGuide,
  submitTransitGuide,
} from "@/modules/idf/api/transitGuides";
import { loadActiveLicenses, loadClosedLots } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { RequestTransitGuideRequest, TransitGuideDto, TransitGuideStatus } from "@/modules/idf/types";

const TransitGuidesPage = () => {
  const workflow = useWorkflow("Guia actualizada");

  return (
    <ResourceWorkspace<TransitGuideDto, RequestTransitGuideRequest>
      service={SERVICE.TRANSIT_GUIDES}
      title="Guias de Trânsito"
      description="Circulação de lotes fechados, com emissão de QR Code para verificação no terreno."
      crumbs={[{ label: "Cadeia de Custódia" }, { label: "Guias de Trânsito" }]}
      queryKey="guides"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem guias emitidas"
      statuses={["Draft", "Submitted", "Validating", "PendingPayment", "Paid", "Issued", "InTransit", "Completed", "Cancelled", "Expired"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Truck },
        { key: "transit", label: "Em trânsito", status: "InTransit", icon: Truck },
        { key: "completed", label: "Concluídas", status: "Completed", icon: Truck },
        { key: "pending", label: "Pendentes de pagamento", status: "PendingPayment", icon: Truck },
      ]}
      fetchPage={({ page, status }) =>
        listTransitGuides({ page, pageSize: 10, status: status as TransitGuideStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.guideNumber ?? `#${item.id.slice(0, 8)}`}
      columns={[
        {
          key: "number",
          header: "Guia",
          render: (item) => <span className="font-medium">{item.guideNumber ?? `#${item.id.slice(0, 8)}`}</span>,
        },
        { key: "lot", header: "Lote", render: (item) => <EntityLabel kind="lot" id={item.forestLotId} /> },
        { key: "route", header: "Trajecto", render: (item) => `${item.origin} → ${item.destination}` },
        { key: "vehicle", header: "Veículo", render: (item) => item.vehicleRegistration },
      ]}
      create={{
        label: "Nova guia",
        dialogTitle: "Emitir guia de trânsito",
        dialogDescription: "A guia está sempre associada a um lote fechado e a uma licença (regra 9.5).",
        wide: true,
        initial: () => ({
          forestLotId: "",
          forestLicenseId: "",
          origin: "",
          destination: "",
          vehicleRegistration: "",
          driverName: "",
          driverLicenseNumber: "",
        }),
        submit: requestTransitGuide,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="guide-lot"
              label="Lote"
              queryKey={["idf", "picker", "closed-lots"]}
              load={loadClosedLots}
              value={value.forestLotId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestLotId: v }))}
              emptyMessage="Sem lotes fechados disponíveis."
              error={fieldError(errors, "forestLotId")}
            />
            <EntityPicker
              id="guide-license"
              label="Licença"
              queryKey={["idf", "picker", "active-licenses"]}
              load={loadActiveLicenses}
              value={value.forestLicenseId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestLicenseId: v }))}
              emptyMessage="Sem licenças activas."
              error={fieldError(errors, "forestLicenseId")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["origin", "Origem", "Concessão / parque de toras"],
                  ["destination", "Destino", "Entreposto / porto"],
                  ["vehicleRegistration", "Matrícula", "LD-00-00-AA"],
                  ["driverName", "Nome do motorista", ""],
                  ["driverLicenseNumber", "Carta de condução Nº", ""],
                ] as const
              ).map(([field, label, placeholder]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`guide-${field}`}>{label}</Label>
                  <Input
                    id={`guide-${field}`}
                    value={value[field]}
                    placeholder={placeholder}
                    onChange={(e) => setValue((prev) => ({ ...prev, [field]: e.target.value }))}
                  />
                  {fieldError(errors, field) && <p className="text-sm text-destructive">{fieldError(errors, field)}</p>}
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
              <dt className="text-muted-foreground">Lote</dt>
              <dd className="font-medium">
                <EntityLabel kind="lot" id={item.forestLotId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Motorista</dt>
              <dd className="font-medium">
                {item.driverName} · {item.driverLicenseNumber}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Origem</dt>
              <dd className="font-medium">{item.origin}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Destino</dt>
              <dd className="font-medium">{item.destination}</dd>
            </div>
          </dl>

          {item.guideNumber && (
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <QRCodeSVG value={`${window.location.origin}/verificar/${item.guideNumber}`} size={148} />
              <p className="text-sm font-medium">{item.guideNumber}</p>
              <p className="text-xs text-muted-foreground">Verificação pública da guia</p>
            </div>
          )}

          <PaymentPanel revenueTransactionId={item.revenueTransactionId ?? undefined} />

          <Separator />

          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.TRANSIT_GUIDES}
              status={item.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitTransitGuide(item.id)),
                },
                {
                  key: "validate",
                  label: "Colocar em validação",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Submitted"],
                  onRun: () => workflow.run(() => beginTransitGuideValidation(item.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markTransitGuidePaid(item.id)),
                },
                {
                  key: "issue",
                  label: "Emitir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => issueTransitGuide(item.id)),
                },
                {
                  key: "transit",
                  label: "Iniciar trânsito",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Issued"],
                  onRun: () => workflow.run(() => beginTransit(item.id)),
                },
                {
                  key: "complete",
                  label: "Concluir trânsito",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["InTransit"],
                  onRun: () => workflow.run(() => completeTransitGuide(item.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.TRANSIT_GUIDES}
              permission={PERMISSION.UPDATE}
              status={item.status}
              enabledFor={["Validating"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(async () => {
                  await markTransitGuidePendingPayment(item.id, { amount, currency });
                  refresh();
                })
              }
            />
          </div>

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/transit-guides/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default TransitGuidesPage;
