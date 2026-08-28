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
  activateLicense,
  getLicense,
  issueLicense,
  markLicensePendingPayment,
  submitLicense,
  suspendLicense,
} from "@/modules/idf/api/licenses";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const LicenseDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Licença actualizada");

  const { data: license, isLoading } = useQuery({
    queryKey: ["idf", "licenses", id],
    queryFn: () => getLicense(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!license) return <p className="text-muted-foreground">Licença não encontrada.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={license.licenseNumber ?? shortId(license.id)}
        description={`${license.authorizedVolume.value.toLocaleString("pt-AO")} ${license.authorizedVolume.unit} autorizados`}
        crumbs={[
          { label: "Exploração" },
          { label: "Licenças", to: "/idf/licenses" },
          { label: license.licenseNumber ?? shortId(license.id) },
        ]}
        actions={<StatusBadge status={license.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="operator" id={license.operatorId} />
        <RelatedEntityCard kind="concession" id={license.concessionId} />
        <RelatedEntityCard kind="quota" id={license.quotaId} />
        <RelatedEntityCard kind="revenue" id={license.revenueTransactionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.LICENSES}
              status={license.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitLicense(license.id)),
                },
                {
                  key: "issue",
                  label: "Emitir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => issueLicense(license.id)),
                },
                {
                  key: "activate",
                  label: "Activar",
                  permission: PERMISSION.ENABLE,
                  enabledFor: ["Issued", "Suspended"],
                  onRun: () => workflow.run(() => activateLicense(license.id)),
                },
                {
                  key: "suspend",
                  label: "Suspender",
                  permission: PERMISSION.DISABLE,
                  variant: "destructive",
                  enabledFor: ["Active"],
                  onRun: () => workflow.run(() => suspendLicense(license.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.LICENSES}
              permission={PERMISSION.UPDATE}
              status={license.status}
              enabledFor={["Submitted"]}
              disabled={workflow.isBusy}
              onConfirm={(feeAmount, currency) =>
                workflow.run(() => markLicensePendingPayment(license.id, { feeAmount, currency }))
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Regra 9.3: a licença só pode ser activada depois de o pagamento estar confirmado.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados da licença</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Volume autorizado</dt>
              <dd className="font-medium">
                {license.authorizedVolume.value} {license.authorizedVolume.unit}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(license.validityPeriod.startDate)} → {formatDate(license.validityPeriod.endDate)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <PaymentPanel revenueTransactionId={license.revenueTransactionId ?? undefined} />
    </div>
  );
};

export default LicenseDetailPage;
