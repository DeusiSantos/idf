import { Link } from "react-router-dom";
import { ExternalLink, FileCheck, Plus } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  activateLicense,
  issueLicense,
  listLicenses,
  markLicensePendingPayment,
  submitLicense,
  suspendLicense,
} from "@/modules/idf/api/licenses";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { usePermission } from "@/modules/idf/hooks/usePermission";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import type { ForestLicenseDto, ForestLicenseStatus } from "@/modules/idf/types";

const LicensesPage = () => {
  const workflow = useWorkflow("Licença actualizada");
  const canCreate = usePermission(SERVICE.LICENSES, PERMISSION.CREATE);

  return (
    <ResourceWorkspace<ForestLicenseDto, never>
      service={SERVICE.LICENSES}
      title="Licenças"
      description="Pedido → emissão (gera receita) → pagamento confirmado → activação."
      crumbs={[{ label: "Exploração" }, { label: "Licenças" }]}
      queryKey="licenses"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem licenças registadas"
      statuses={["Draft", "Submitted", "PendingPayment", "Issued", "Active", "Suspended", "Expired", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: FileCheck },
        { key: "active", label: "Activas", status: "Active", icon: FileCheck },
        { key: "pending", label: "Pendentes de pagamento", status: "PendingPayment", icon: FileCheck },
        { key: "expired", label: "Expiradas", status: "Expired", icon: FileCheck },
      ]}
      fetchPage={({ page, status }) =>
        listLicenses({ page, pageSize: 10, status: status as ForestLicenseStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.licenseNumber ?? `#${item.id.slice(0, 8)}`}
      extraActions={
        canCreate ? (
          <Button asChild>
            <Link to="/idf/licenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova licença
            </Link>
          </Button>
        ) : null
      }
      columns={[
        {
          key: "number",
          header: "Licença",
          render: (item) => <span className="font-medium">{item.licenseNumber ?? `#${item.id.slice(0, 8)}`}</span>,
        },
        {
          key: "concession",
          header: "Concessão",
          render: (item) => <EntityLabel kind="concession" id={item.concessionId} />,
        },
        { key: "quota", header: "Quota", render: (item) => <EntityLabel kind="quota" id={item.quotaId} /> },
        {
          key: "volume",
          header: "Volume",
          render: (item) => `${item.authorizedVolume.value.toLocaleString("pt-AO")} ${item.authorizedVolume.unit}`,
        },
      ]}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Concessão</dt>
              <dd className="font-medium">
                <EntityLabel kind="concession" id={item.concessionId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Quota</dt>
              <dd className="font-medium">
                <EntityLabel kind="quota" id={item.quotaId} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Volume autorizado</dt>
              <dd className="font-medium">
                {item.authorizedVolume.value} {item.authorizedVolume.unit}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Validade</dt>
              <dd className="font-medium">
                {formatDate(item.validityPeriod.startDate)} → {formatDate(item.validityPeriod.endDate)}
              </dd>
            </div>
          </dl>

          <PaymentPanel revenueTransactionId={item.revenueTransactionId ?? undefined} />

          <Separator />

          <div className="flex flex-wrap gap-2">
            <WorkflowActions
              service={SERVICE.LICENSES}
              status={item.status}
              isBusy={workflow.isBusy}
              actions={[
                {
                  key: "submit",
                  label: "Submeter",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["Draft"],
                  onRun: () => workflow.run(() => submitLicense(item.id)),
                },
                {
                  key: "issue",
                  label: "Emitir",
                  permission: PERMISSION.UPDATE,
                  enabledFor: ["PendingPayment"],
                  onRun: () => workflow.run(() => issueLicense(item.id)),
                },
                {
                  key: "activate",
                  label: "Activar",
                  permission: PERMISSION.ENABLE,
                  enabledFor: ["Issued", "Suspended"],
                  onRun: () => workflow.run(() => activateLicense(item.id)),
                },
                {
                  key: "suspend",
                  label: "Suspender",
                  permission: PERMISSION.DISABLE,
                  variant: "destructive",
                  enabledFor: ["Active"],
                  onRun: () => workflow.run(() => suspendLicense(item.id)),
                },
              ]}
            />
            <PendingPaymentButton
              service={SERVICE.LICENSES}
              permission={PERMISSION.UPDATE}
              status={item.status}
              enabledFor={["Submitted"]}
              disabled={workflow.isBusy}
              onConfirm={(feeAmount, currency) =>
                workflow.run(async () => {
                  await markLicensePendingPayment(item.id, { feeAmount, currency });
                  refresh();
                })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Regra 9.3: a licença só pode ser activada depois de o pagamento estar confirmado.
          </p>

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/licenses/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default LicensesPage;
