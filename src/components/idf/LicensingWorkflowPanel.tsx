import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PendingPaymentButton } from "@/components/idf/PendingPaymentButton";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { PERMISSION, type ServiceCode } from "@/modules/idf/config/modules";
import { getCampaignSettings } from "@/modules/idf/mock/licensing";
import type { LicensingStatus } from "@/modules/idf/types/licensing";

interface LicensingWorkflowPanelProps {
  service: ServiceCode;
  status: LicensingStatus;
  feeAmount: number | null;
  paymentConfirmed: boolean;
  verificationCode: string | null;
  /** Estimativa calculada na criação (ex.: preço/m³ × volume) — pré-preenche "Marcar pendente de pagamento", nunca substitui a confirmação manual. */
  estimatedFeeAmount?: number;
  isBusy: boolean;
  onSubmit: () => void;
  onVerify: () => void;
  onMarkPendingPayment: (amount: number, currency: string) => void;
  onConfirmPayment: () => void;
  onIssue: () => void;
  onActivate: () => void;
}

/**
 * Painel comum às 4 abas do Licenciamento: fluxo Rascunho→Submetido→Verificação→Pagamento→Emitida→
 * Activa, código de verificação "verificável offline", e a barra de validade da campanha. Sem
 * datas de início/fim de campanha definidas na especificação (só "ano de campanha", Aba 1),
 * mostra-se aqui só o estado da prorrogação geral em vez de inventar um intervalo — decisão
 * documentada.
 */
export const LicensingWorkflowPanel = ({
  service,
  status,
  feeAmount,
  paymentConfirmed,
  verificationCode,
  estimatedFeeAmount,
  isBusy,
  onSubmit,
  onVerify,
  onMarkPendingPayment,
  onConfirmPayment,
  onIssue,
  onActivate,
}: LicensingWorkflowPanelProps) => {
  const campaign = getCampaignSettings();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Campanha {campaign.extensionEnabled ? `com prorrogação geral aplicada (+${campaign.extensionDays} dias)` : "sem prorrogação activa"}.
      </div>

      <WorkflowActions
        service={service}
        status={status}
        isBusy={isBusy}
        actions={[
          { key: "submit", label: "Submeter", permission: PERMISSION.UPDATE, enabledFor: ["Draft"], onRun: onSubmit },
          {
            key: "verify",
            label: "Verificar pré-condições",
            permission: PERMISSION.UPDATE,
            variant: "outline",
            enabledFor: ["Submitted"],
            onRun: onVerify,
          },
          {
            key: "issue",
            label: "Emitir",
            permission: PERMISSION.UPDATE,
            enabledFor: ["PendingPayment"],
            guard: () => paymentConfirmed,
            guardMessage: "Pagamento ainda não confirmado — nunca é possível emitir sem pagamento confirmado.",
            onRun: onIssue,
          },
          { key: "activate", label: "Activar", permission: PERMISSION.ENABLE, enabledFor: ["Issued"], onRun: onActivate },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <PendingPaymentButton
          service={service}
          permission={PERMISSION.UPDATE}
          status={status}
          enabledFor={["PrecheckVerification"]}
          disabled={isBusy}
          initialAmount={estimatedFeeAmount}
          onConfirm={onMarkPendingPayment}
        />
        {status === "PendingPayment" && feeAmount !== null && !paymentConfirmed && (
          <Button size="sm" disabled={isBusy} onClick={onConfirmPayment}>
            Confirmar pagamento
          </Button>
        )}
        {paymentConfirmed && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Pagamento confirmado{feeAmount !== null ? ` (${feeAmount.toLocaleString("pt-AO")} AOA)` : ""}
          </span>
        )}
      </div>

      {verificationCode && (
        <>
          <Separator />
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="font-mono font-medium">{verificationCode}</span>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">verificável offline</span>
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground">Licença sempre intransmissível — nunca disponível ceder/transferir.</p>
    </div>
  );
};

export default LicensingWorkflowPanel;
