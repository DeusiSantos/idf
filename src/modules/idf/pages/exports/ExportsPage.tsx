import { Link } from "react-router-dom";
import { ExternalLink, Ship } from "lucide-react";
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
  authorizeExportProcess,
  beginExportDocumentValidation,
  completeExportProcess,
  createExportProcess,
  dispatchExportProcess,
  listExportProcesses,
  markExportPaid,
  markExportPendingPayment,
  submitExportProcess,
} from "@/modules/idf/api/exports";
import { loadClosedLots } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { CreateExportProcessRequest, ExportProcessDto, ExportStatus } from "@/modules/idf/types";

const ExportsPage = () => {
  const workflow = useWorkflow("Processo de exportação actualizado");

  return (
    <ResourceWorkspace<ExportProcessDto, CreateExportProcessRequest>
      service={SERVICE.EXPORTS}
      title="Exportação"
      description="Processos de exportação de lotes fechados, do envio de documentos à autorização."
      crumbs={[{ label: "Comercialização" }, { label: "Exportação" }]}
      queryKey="exports"
      searchPlaceholder="Pesquisar por país de destino"
      emptyMessage="Sem processos de exportação"
      statuses={["Draft", "Submitted", "DocumentValidation", "PendingPayment", "Paid", "Authorized", "Dispatched", "Completed", "Rejected", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Ship },
        { key: "authorized", label: "Autorizados", status: "Authorized", icon: Ship },
        { key: "completed", label: "Concluídos", status: "Completed", icon: Ship },
        { key: "pending", label: "Pendentes de pagamento", status: "PendingPayment", icon: Ship },
      ]}
      fetchPage={({ page, search, status }) =>
        listExportProcesses({ page, pageSize: 10, destinationCountry: search, status: status as ExportStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => `#${item.id.slice(0, 8)}`}
      columns={[
        { key: "id", header: "Processo", render: (item) => <span className="font-medium">#{item.id.slice(0, 8)}</span> },
        { key: "lot", header: "Lote", render: (item) => <EntityLabel kind="lot" id={item.forestLotId} /> },
        { key: "destination", header: "Destino", render: (item) => `${item.destinationCountry} · ${item.destinationPort}` },
      ]}
      create={{
        label: "Novo processo",
        dialogTitle: "Registar processo de exportação",
        dialogDescription: "Exige lote fechado.",
        wide: true,
        initial: () => ({ forestLotId: "", destinationCountry: "", destinationPort: "" }),
        submit: createExportProcess,
        render: ({ value, setValue, errors }) => (
          <>
            <EntityPicker
              id="exp-lot"
              label="Lote"
              queryKey={["idf", "picker", "closed-lots"]}
              load={loadClosedLots}
              value={value.forestLotId}
              onChange={(v) => setValue((prev) => ({ ...prev, forestLotId: v }))}
              emptyMessage="Sem lotes fechados disponíveis."
              error={fieldError(errors, "forestLotId")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exp-country">País de destino</Label>
                <Input
                  id="exp-country"
                  value={value.destinationCountry}
                  onChange={(e) => setValue((prev) => ({ ...prev, destinationCountry: e.target.value }))}
                />
                {fieldError(errors, "destinationCountry") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "destinationCountry")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-port">Porto de destino</Label>
                <Input
                  id="exp-port"
                  value={value.destinationPort}
                  onChange={(e) => setValue((prev) => ({ ...prev, destinationPort: e.target.value }))}
                />
                {fieldError(errors, "destinationPort") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "destinationPort")}</p>
                )}
              </div>
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
              <dt className="text-muted-foreground">Destino</dt>
              <dd className="font-medium">
                {item.destinationCountry} · {item.destinationPort}
              </dd>
            </div>
          </dl>

          <PaymentPanel revenueTransactionId={item.revenueTransactionId ?? undefined} />

          <Separator />

          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.EXPORTS}
              status={item.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitExportProcess(item.id)),
                },
                {
                  key: "validate",
                  label: "Validar documentos",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Submitted"],
                  onRun: () => workflow.run(() => beginExportDocumentValidation(item.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markExportPaid(item.id)),
                },
                {
                  key: "authorize",
                  label: "Autorizar exportação",
                  permission: PERMISSION.APPROVE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => authorizeExportProcess(item.id)),
                },
                {
                  key: "dispatch",
                  label: "Despachar",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Authorized"],
                  onRun: () => workflow.run(() => dispatchExportProcess(item.id)),
                },
                {
                  key: "complete",
                  label: "Concluir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Dispatched"],
                  onRun: () => workflow.run(() => completeExportProcess(item.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.EXPORTS}
              permission={PERMISSION.UPDATE}
              status={item.status}
              enabledFor={["DocumentValidation"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(async () => {
                  await markExportPendingPayment(item.id, { amount, currency });
                  refresh();
                })
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/idf/traceability/ExportProcess/${item.id}`}>Ver rastreabilidade</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={`/idf/exports/${item.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir processo completo
              </Link>
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export default ExportsPage;
