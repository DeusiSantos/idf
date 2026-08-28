import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
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
  beginTransit,
  beginTransitGuideValidation,
  completeTransitGuide,
  getTransitGuide,
  issueTransitGuide,
  markTransitGuidePaid,
  markTransitGuidePendingPayment,
  submitTransitGuide,
} from "@/modules/idf/api/transitGuides";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const TransitGuideDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Guia actualizada");

  const { data: guide, isLoading } = useQuery({
    queryKey: ["idf", "guides", id],
    queryFn: () => getTransitGuide(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!guide) return <p className="text-muted-foreground">Guia de trânsito não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={guide.guideNumber ?? shortId(guide.id)}
        description={`${guide.origin} → ${guide.destination}`}
        crumbs={[
          { label: "Cadeia de Custódia" },
          { label: "Guias de Trânsito", to: "/idf/transit-guides" },
          { label: guide.guideNumber ?? shortId(guide.id) },
        ]}
        actions={<StatusBadge status={guide.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="lot" id={guide.forestLotId} />
        <RelatedEntityCard kind="license" id={guide.forestLicenseId} />
        <RelatedEntityCard kind="revenue" id={guide.revenueTransactionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.TRANSIT_GUIDES}
              status={guide.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitTransitGuide(guide.id)),
                },
                {
                  key: "validate",
                  label: "Colocar em validação",
                  permission: PERMISSION.UPDATE,
                  variant: "outline",
                  enabledFor: ["Submitted"],
                  onRun: () => workflow.run(() => beginTransitGuideValidation(guide.id)),
                },
                {
                  key: "paid",
                  label: "Confirmar pagamento",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => markTransitGuidePaid(guide.id)),
                },
                {
                  key: "issue",
                  label: "Emitir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Paid"],
                  onRun: () => workflow.run(() => issueTransitGuide(guide.id)),
                },
                {
                  key: "transit",
                  label: "Iniciar trânsito",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Issued"],
                  onRun: () => workflow.run(() => beginTransit(guide.id)),
                },
                {
                  key: "complete",
                  label: "Concluir trânsito",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["InTransit"],
                  onRun: () => workflow.run(() => completeTransitGuide(guide.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.TRANSIT_GUIDES}
              permission={PERMISSION.UPDATE}
              status={guide.status}
              enabledFor={["Validating"]}
              disabled={workflow.isBusy}
              onConfirm={(amount, currency) =>
                workflow.run(() => markTransitGuidePendingPayment(guide.id, { amount, currency }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trajecto e veículo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Origem</dt>
                <dd className="font-medium">{guide.origin}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Destino</dt>
                <dd className="font-medium">{guide.destination}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Matrícula</dt>
                <dd className="font-medium">{guide.vehicleRegistration}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Motorista</dt>
                <dd className="font-medium">
                  {guide.driverName} · {guide.driverLicenseNumber}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {guide.guideNumber && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6">
              <QRCodeSVG value={`${window.location.origin}/verificar/${guide.guideNumber}`} size={148} />
              <p className="text-sm font-medium">{guide.guideNumber}</p>
              <p className="text-xs text-muted-foreground">Verificação pública da guia</p>
            </CardContent>
          </Card>
        )}
      </div>

      <PaymentPanel revenueTransactionId={guide.revenueTransactionId ?? undefined} />
    </div>
  );
};

export default TransitGuideDetailPage;
