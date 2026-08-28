import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  authorizeExportProcess,
  beginExportDocumentValidation,
  completeExportProcess,
  dispatchExportProcess,
  getExportProcess,
  markExportPaid,
  markExportPendingPayment,
  submitExportProcess,
} from "@/modules/idf/api/exports";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const ExportDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Processo de exportação actualizado");

  const { data: exportProcess, isLoading } = useQuery({
    queryKey: ["idf", "exports", id],
    queryFn: () => getExportProcess(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!exportProcess) return <p className="text-muted-foreground">Processo de exportação não encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={shortId(exportProcess.id)}
        description={`${exportProcess.destinationCountry} · ${exportProcess.destinationPort}`}
        crumbs={[{ label: "Comercialização" }, { label: "Exportação", to: "/idf/exports" }, { label: shortId(exportProcess.id) }]}
        actions={<StatusBadge status={exportProcess.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="lot" id={exportProcess.forestLotId} />
        <RelatedEntityCard kind="revenue" id={exportProcess.revenueTransactionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.EXPORTS}
              status={exportProcess.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitExportProcess(exportProcess.id)),
                },
                {
                  key: "validate",
                  label: "Validar documentos",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Submitted"],
                  onRun: () => workflow.run(() => beginExportDocumentValidation(exportProcess.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markExportPaid(exportProcess.id)),
                },
                {
                  key: "authorize",
                  label: "Autorizar exportação",
                  permission: PERMISSION.APPROVE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => authorizeExportProcess(exportProcess.id)),
                },
                {
                  key: "dispatch",
                  label: "Despachar",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Authorized"],
                  onRun: () => workflow.run(() => dispatchExportProcess(exportProcess.id)),
                },
                {
                  key: "complete",
                  label: "Concluir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Dispatched"],
                  onRun: () => workflow.run(() => completeExportProcess(exportProcess.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.EXPORTS}
              permission={PERMISSION.UPDATE}
              status={exportProcess.status}
              enabledFor={["DocumentValidation"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(() => markExportPendingPayment(exportProcess.id, { amount, currency }))
              }
            />
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/idf/traceability/ExportProcess/${exportProcess.id}`}>Ver rastreabilidade</Link>
          </Button>
        </CardContent>
      </Card>

      <PaymentPanel revenueTransactionId={exportProcess.revenueTransactionId ?? undefined} />
    </div>
  );
};

export default ExportDetailPage;
