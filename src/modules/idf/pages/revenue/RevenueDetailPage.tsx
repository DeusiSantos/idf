import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard, type RelatedKind } from "@/components/idf/RelatedEntityCard";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calculateRevenueTransaction,
  confirmRevenuePayment,
  getRevenueTransaction,
  liquidateRevenueTransaction,
} from "@/modules/idf/api/revenue";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import type { RevenueActType } from "@/modules/idf/types";

const ACT_TYPE_LABELS: Record<RevenueActType, string> = {
  License: "Licença",
  TransitGuide: "Guia de trânsito",
  Certificate: "Certificado",
  Authorization: "Autorização",
  Inspection: "Inspecção",
  InspectionVisit: "Visita de inspecção",
  Warehouse: "Entreposto",
  Fine: "Multa",
  Indemnification: "Indemnização",
  Other: "Outro",
};

/** Nem todo actType tem uma entidade consultável directamente. */
const SOURCE_KIND: Partial<Record<RevenueActType, RelatedKind>> = {
  License: "license",
  TransitGuide: "transitGuide",
  Certificate: "certificate",
  Warehouse: "warehouse",
  Inspection: "inspection",
  InspectionVisit: "inspection",
};

export const formatKwanza = (amount: number, currency = "AOA") =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const RevenueDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Receita actualizada");

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["idf", "revenue", id],
    queryFn: () => getRevenueTransaction(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!transaction) return <p className="text-muted-foreground">Transacção de receita não encontrada.</p>;

  const sourceKind = SOURCE_KIND[transaction.actType];

  return (
    <div className="space-y-6">
      <PageHeader
        title={transaction.description || ACT_TYPE_LABELS[transaction.actType]}
        description={formatKwanza(transaction.amount, transaction.currency)}
        crumbs={[{ label: "Financeiro" }, { label: "Receitas", to: "/idf/revenue" }, { label: ACT_TYPE_LABELS[transaction.actType] }]}
        actions={<StatusBadge status={transaction.status} className="px-3 py-1 text-sm" />}
      />

      {sourceKind ? (
        <RelatedSection>
          <RelatedEntityCard kind={sourceKind} id={transaction.sourceEntityId} />
        </RelatedSection>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Origem</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {ACT_TYPE_LABELS[transaction.actType]} · id {transaction.sourceEntityId}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.REVENUE}
            status={transaction.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "calculate",
                label: "Calcular",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Pending"],
                onRun: () => workflow.run(() => calculateRevenueTransaction(transaction.id)),
              },
              {
                key: "liquidate",
                label: "Liquidar",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Calculated"],
                onRun: () => workflow.run(() => liquidateRevenueTransaction(transaction.id)),
              },
              {
                key: "confirm-payment",
                label: "Confirmar pagamento",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Liquidated", "PartiallyPaid"],
                onRun: () => workflow.run(() => confirmRevenuePayment(transaction.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados da transacção</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Tipo de acto</dt>
              <dd className="font-medium">{ACT_TYPE_LABELS[transaction.actType]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Valor</dt>
              <dd className="font-medium">{formatKwanza(transaction.amount, transaction.currency)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Criada em</dt>
              <dd className="font-medium">{formatDate(transaction.createdAt)}</dd>
            </div>
            {transaction.description && (
              <div className="col-span-2">
                <dt className="text-muted-foreground">Descrição</dt>
                <dd className="font-medium">{transaction.description}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDetailPage;
