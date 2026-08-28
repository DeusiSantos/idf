import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/idf/StatusBadge";
import {
  calculateRevenueTransaction,
  confirmRevenuePayment,
  getRevenueTransaction,
  liquidateRevenueTransaction,
} from "@/modules/idf/api/revenue";
import { toProblem } from "@/modules/idf/hooks/useProblem";
import { useToast } from "@/hooks/use-toast";

export const formatKwanza = (amount: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(amount);

interface PaymentPanelProps {
  revenueTransactionId?: string;
  onPaid?: () => void;
}

/** Componente transversal: Pendente → Calculado → Liquidado → Pago (secção 4.16). */
export const PaymentPanel = ({ revenueTransactionId, onPaid }: PaymentPanelProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transaction } = useQuery({
    queryKey: ["idf", "revenue", revenueTransactionId],
    queryFn: () => getRevenueTransaction(revenueTransactionId as string),
    enabled: Boolean(revenueTransactionId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["idf"] });
    onPaid?.();
  };

  const onError = (error: unknown) =>
    toast({ variant: "destructive", title: "Erro", description: toProblem(error).detail });

  const calculate = useMutation({
    mutationFn: () => calculateRevenueTransaction(transaction!.id),
    onSuccess: invalidate,
    onError,
  });

  const liquidate = useMutation({
    mutationFn: () => liquidateRevenueTransaction(transaction!.id),
    onSuccess: invalidate,
    onError,
  });

  const pay = useMutation({
    mutationFn: () => confirmRevenuePayment(transaction!.id),
    onSuccess: () => {
      toast({ title: "Pagamento confirmado" });
      invalidate();
    },
    onError,
  });

  if (!revenueTransactionId) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Ainda não existe receita associada a este processo.</p>
        </CardContent>
      </Card>
    );
  }

  if (!transaction) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Pagamento</CardTitle>
        <StatusBadge status={transaction.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold text-primary">{formatKwanza(transaction.amount)}</p>
          <p className="text-sm text-muted-foreground">{transaction.description}</p>
        </div>

        {transaction.status === "Pending" && (
          <Button size="sm" variant="outline" disabled={calculate.isPending} onClick={() => calculate.mutate()}>
            Calcular
          </Button>
        )}

        {transaction.status === "Calculated" && (
          <Button size="sm" variant="outline" disabled={liquidate.isPending} onClick={() => liquidate.mutate()}>
            Liquidar
          </Button>
        )}

        {(transaction.status === "Liquidated" || transaction.status === "PartiallyPaid") && (
          <Button size="sm" disabled={pay.isPending} onClick={() => pay.mutate()}>
            Confirmar pagamento
          </Button>
        )}

        {transaction.status === "Paid" && <p className="text-sm text-success">Pagamento confirmado.</p>}
      </CardContent>
    </Card>
  );
};

export default PaymentPanel;
