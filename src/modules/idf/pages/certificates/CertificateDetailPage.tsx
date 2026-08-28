import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  beginCertificateValidation,
  getCertificate,
  issueCertificate,
  markCertificatePaid,
  markCertificatePendingPayment,
} from "@/modules/idf/api/certificates";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import type { CertificateType } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const TYPE_LABELS: Record<CertificateType, string> = {
  Origin: "Origem",
  Export: "Exportação",
  Phytosanitary: "Fitossanitário",
};

const CertificateDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Certificado actualizado");

  const { data: certificate, isLoading } = useQuery({
    queryKey: ["idf", "certificates", id],
    queryFn: () => getCertificate(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!certificate) return <p className="text-muted-foreground">Certificado não encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={certificate.certificateNumber ?? shortId(certificate.id)}
        description={TYPE_LABELS[certificate.certificateType]}
        crumbs={[
          { label: "Comercialização" },
          { label: "Certificados", to: "/idf/certificates" },
          { label: certificate.certificateNumber ?? shortId(certificate.id) },
        ]}
        actions={<StatusBadge status={certificate.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="lot" id={certificate.forestLotId} />
        <RelatedEntityCard kind="export" id={certificate.exportProcessId} />
        <RelatedEntityCard kind="revenue" id={certificate.revenueTransactionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.CERTIFICATES}
              status={certificate.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "validate",
                  label: "Colocar em validação",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Requested"],
                  onRun: () => workflow.run(() => beginCertificateValidation(certificate.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markCertificatePaid(certificate.id)),
                },
                {
                  key: "issue",
                  label: "Emitir certificado",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => issueCertificate(certificate.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.CERTIFICATES}
              permission={PERMISSION.UPDATE}
              status={certificate.status}
              enabledFor={["UnderValidation"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(() => markCertificatePendingPayment(certificate.id, { amount, currency }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <PaymentPanel revenueTransactionId={certificate.revenueTransactionId ?? undefined} />
    </div>
  );
};

export default CertificateDetailPage;
