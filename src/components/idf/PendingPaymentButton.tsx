import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePermission } from "@/modules/idf/hooks/usePermission";
import type { PermissionCode, ServiceCode } from "@/modules/idf/config/modules";

interface PendingPaymentButtonProps {
  service: ServiceCode;
  permission: PermissionCode;
  /** Só aparece quando o estado actual estiver nesta lista. */
  enabledFor: string[];
  status: string;
  disabled?: boolean;
  /** Pré-preenche o valor (ex.: estimativa calculada a partir de preços por espécie) — continua sempre editável antes de confirmar. */
  initialAmount?: number;
  onConfirm: (amount: number, currency: string) => void | Promise<void>;
}

/**
 * Botão + diálogo para as transições "mark-pending-payment" (Licenças, Guias, Certificados,
 * Exportação) — pedem o valor a cobrar antes de avançar o processo para "Pendente de pagamento".
 */
export const PendingPaymentButton = ({
  service,
  permission,
  enabledFor,
  status,
  disabled,
  initialAmount,
  onConfirm,
}: PendingPaymentButtonProps) => {
  const canRun = usePermission(service, permission);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(initialAmount ?? 0);
  const [currency, setCurrency] = useState("AOA");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canRun || !enabledFor.includes(status)) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(amount, currency);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => {
          setAmount(initialAmount ?? 0);
          setOpen(true);
        }}
      >
        Marcar pendente de pagamento
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir valor a cobrar</DialogTitle>
          <DialogDescription>Gera/actualiza a receita associada a este processo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pp-amount">Valor</Label>
            <Input
              id="pp-amount"
              type="number"
              min={0}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pp-currency">Moeda</Label>
            <Input id="pp-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={isSubmitting || amount <= 0} onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PendingPaymentButton;
