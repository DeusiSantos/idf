import { Link } from "react-router-dom";
import { Award, ExternalLink } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  beginCertificateValidation,
  issueCertificate,
  listCertificates,
  markCertificatePaid,
  markCertificatePendingPayment,
  requestCertificate,
} from "@/modules/idf/api/certificates";
import { loadClosedLots } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import type { CertificateStatus, CertificateType, ForestCertificateDto, RequestCertificateRequest } from "@/modules/idf/types";

const TYPE_LABELS: Record<CertificateType, string> = {
  Origin: "Origem",
  Export: "Exportação",
  Phytosanitary: "Fitossanitário",
};

const CertificatesPage = () => {
  const workflow = useWorkflow("Certificado actualizado");

  return (
    <ResourceWorkspace<ForestCertificateDto, RequestCertificateRequest>
      service={SERVICE.CERTIFICATES}
      title="Certificados"
      description="Certificados de origem, exportação e fitossanitário, emitidos sobre um lote fechado."
      crumbs={[{ label: "Comercialização" }, { label: "Certificados" }]}
      queryKey="certificates"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem certificados emitidos"
      statuses={["Requested", "UnderValidation", "PendingPayment", "Paid", "Issued", "Expired", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Award },
        { key: "issued", label: "Emitidos", status: "Issued", icon: Award },
        { key: "pending", label: "Pendentes de pagamento", status: "PendingPayment", icon: Award },
      ]}
      fetchPage={({ page, status }) =>
        listCertificates({ page, pageSize: 10, status: status as CertificateStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.certificateNumber ?? `#${item.id.slice(0, 8)}`}
      columns={[
        {
          key: "number",
          header: "Certificado",
          render: (item) => <span className="font-medium">{item.certificateNumber ?? `#${item.id.slice(0, 8)}`}</span>,
        },
        { key: "type", header: "Tipo", render: (item) => TYPE_LABELS[item.certificateType] },
        {
          key: "lot",
          header: "Lote",
          render: (item) => (item.forestLotId ? <EntityLabel kind="lot" id={item.forestLotId} /> : "—"),
        },
      ]}
      create={{
        label: "Novo certificado",
        dialogTitle: "Requisitar certificado",
        dialogDescription: "Emitido sobre um lote fechado; a emissão gera receita.",
        initial: () => ({ certificateType: "Origin", forestLotId: null, exportProcessId: null }),
        submit: requestCertificate,
        render: ({ value, setValue, errors }) => (
          <>
            <div className="space-y-2">
              <Label htmlFor="cert-type">Tipo de certificado</Label>
              <Select
                value={value.certificateType}
                onValueChange={(certificateType) => setValue((prev) => ({ ...prev, certificateType: certificateType as CertificateType }))}
              >
                <SelectTrigger id="cert-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABELS) as CertificateType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <EntityPicker
              id="cert-lot"
              label="Lote"
              queryKey={["idf", "picker", "closed-lots"]}
              load={loadClosedLots}
              value={value.forestLotId ?? ""}
              onChange={(v) => setValue((prev) => ({ ...prev, forestLotId: v || null }))}
              emptyMessage="Sem lotes fechados disponíveis."
              error={fieldError(errors, "forestLotId")}
            />
          </>
        ),
      }}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="font-medium">{TYPE_LABELS[item.certificateType]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Lote</dt>
              <dd className="font-medium">
                {item.forestLotId ? <EntityLabel kind="lot" id={item.forestLotId} /> : "—"}
              </dd>
            </div>
          </dl>

          <PaymentPanel revenueTransactionId={item.revenueTransactionId ?? undefined} />

          <Separator />

          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.CERTIFICATES}
              status={item.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "validate",
                  label: "Colocar em validação",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Requested"],
                  onRun: () => workflow.run(() => beginCertificateValidation(item.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markCertificatePaid(item.id)),
                },
                {
                  key: "issue",
                  label: "Emitir certificado",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => issueCertificate(item.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.CERTIFICATES}
              permission={PERMISSION.UPDATE}
              status={item.status}
              enabledFor={["UnderValidation"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(async () => {
                  await markCertificatePendingPayment(item.id, { amount, currency });
                  refresh();
                })
              }
            />
          </div>

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/certificates/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default CertificatesPage;
