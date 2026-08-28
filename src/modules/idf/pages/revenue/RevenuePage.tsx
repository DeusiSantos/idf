import { Link } from "react-router-dom";
import { Coins, ExternalLink } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityLabel, type EntityLabelKind } from "@/components/idf/EntityLabel";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateRevenueTransaction,
  confirmRevenuePayment,
  createRevenueTransaction,
  liquidateRevenueTransaction,
  listRevenueTransactions,
} from "@/modules/idf/api/revenue";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { formatDate } from "@/lib/date";
import type { CreateRevenueTransactionRequest, RevenueActType, RevenueStatus, RevenueTransactionDto } from "@/modules/idf/types";

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

/** Nem todo actType tem uma entidade consultável directamente — nesses casos cai-se para o tipo. */
const SOURCE_KIND: Partial<Record<RevenueActType, EntityLabelKind>> = {
  License: "license",
  TransitGuide: "transitGuide",
  Certificate: "certificate",
  Warehouse: "warehouse",
  Inspection: "inspection",
  InspectionVisit: "inspection",
};

/** Nunca mostra o id em bruto: resolve o nome real da origem quando é possível consultá-la. */
const SourceLabel = ({ item }: { item: RevenueTransactionDto }) => {
  const kind = SOURCE_KIND[item.actType];
  if (!kind) return <>{ACT_TYPE_LABELS[item.actType]}</>;
  return <EntityLabel kind={kind} id={item.sourceEntityId} />;
};

export const formatKwanza = (amount: number, currency = "AOA") =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const RevenuePage = () => {
  const workflow = useWorkflow("Receita actualizada");

  return (
    <ResourceWorkspace<RevenueTransactionDto, CreateRevenueTransactionRequest>
      service={SERVICE.REVENUE}
      title="Receitas"
      description="Todas as transacções de receita geradas pelo sistema: Pendente → Calculado → Liquidado → Pago."
      crumbs={[{ label: "Financeiro" }, { label: "Receitas" }]}
      queryKey="revenue-transactions"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem transacções de receita"
      statuses={["Pending", "Calculated", "Liquidated", "PartiallyPaid", "Paid", "Cancelled", "Refunded"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Coins },
        { key: "pending", label: "Pendentes", status: "Pending", icon: Coins },
        { key: "paid", label: "Pagas", status: "Paid", icon: Coins },
      ]}
      fetchPage={({ page, status }) =>
        listRevenueTransactions({ page, pageSize: 10, status: status as RevenueStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.description || ACT_TYPE_LABELS[item.actType]}
      columns={[
        {
          key: "description",
          header: "Descrição",
          render: (item) =>
            item.description ? (
              <span className="font-medium">{item.description}</span>
            ) : (
              <span className="font-medium">
                <SourceLabel item={item} />
              </span>
            ),
        },
        { key: "type", header: "Origem", render: (item) => ACT_TYPE_LABELS[item.actType] },
        { key: "amount", header: "Valor", render: (item) => formatKwanza(item.amount, item.currency) },
        { key: "date", header: "Criada em", render: (item) => formatDate(item.createdAt) },
      ]}
      create={{
        label: "Nova receita",
        dialogTitle: "Registar transacção de receita",
        dialogDescription:
          "A maioria das receitas é gerada automaticamente pelos módulos (Licenças, Guias, Certificados, Fiscalização…). Use isto apenas para lançamentos manuais.",
        wide: true,
        initial: () => ({ actType: "Other", sourceEntityId: "", amount: 0, currency: "AOA", description: "" }),
        submit: createRevenueTransaction,
        render: ({ value, setValue, errors }) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rev-type">Tipo de acto</Label>
                <Select
                  value={value.actType}
                  onValueChange={(actType) => setValue((prev) => ({ ...prev, actType: actType as RevenueActType }))}
                >
                  <SelectTrigger id="rev-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ACT_TYPE_LABELS) as RevenueActType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {ACT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-source">ID da entidade de origem</Label>
                <Input
                  id="rev-source"
                  value={value.sourceEntityId}
                  placeholder="uuid da licença/guia/certificado/etc."
                  onChange={(e) => setValue((prev) => ({ ...prev, sourceEntityId: e.target.value }))}
                />
                {fieldError(errors, "sourceEntityId") && (
                  <p className="text-sm text-destructive">{fieldError(errors, "sourceEntityId")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-amount">Valor</Label>
                <Input
                  id="rev-amount"
                  type="number"
                  min={0}
                  value={value.amount || ""}
                  onChange={(e) => setValue((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                />
                {fieldError(errors, "amount") && <p className="text-sm text-destructive">{fieldError(errors, "amount")}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-currency">Moeda</Label>
                <Input
                  id="rev-currency"
                  value={value.currency}
                  onChange={(e) => setValue((prev) => ({ ...prev, currency: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-desc">Descrição</Label>
              <Textarea
                id="rev-desc"
                value={value.description}
                onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
              />
              {fieldError(errors, "description") && (
                <p className="text-sm text-destructive">{fieldError(errors, "description")}</p>
              )}
            </div>
          </>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <div>
            <p className="text-2xl font-bold text-primary">{formatKwanza(item.amount, item.currency)}</p>
            <p className="text-sm text-muted-foreground">
              {item.description || <SourceLabel item={item} />}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Tipo de acto</dt>
              <dd className="font-medium">{ACT_TYPE_LABELS[item.actType]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Entidade de origem</dt>
              <dd className="font-medium">
                <SourceLabel item={item} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Criada em</dt>
              <dd className="font-medium">{formatDate(item.createdAt)}</dd>
            </div>
          </dl>

          <Separator />

          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
          </div>

          <WorkflowActions
            service={SERVICE.REVENUE}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "calculate",
                label: "Calcular",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Pending"],
                onRun: () => workflow.run(() => calculateRevenueTransaction(item.id)),
              },
              {
                key: "liquidate",
                label: "Liquidar",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Calculated"],
                onRun: () => workflow.run(() => liquidateRevenueTransaction(item.id)),
              },
              {
                key: "confirm-payment",
                label: "Confirmar pagamento",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Liquidated", "PartiallyPaid"],
                onRun: () => workflow.run(() => confirmRevenuePayment(item.id)),
              },
            ]}
          />

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/revenue/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default RevenuePage;
