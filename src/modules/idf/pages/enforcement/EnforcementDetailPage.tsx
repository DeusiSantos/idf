import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { RelatedSection } from "@/components/idf/RelatedSection";
import { RelatedEntityCard } from "@/components/idf/RelatedEntityCard";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  appealEnforcementCase,
  closeEnforcementCase,
  getEnforcementCase,
  issueFine,
  markDecisionPending,
  registerViolation,
} from "@/modules/idf/api/enforcement";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { formatDate } from "@/lib/date";
import type { EnforcementCaseDto, IssueFineRequest, RegisterViolationRequest, ViolationSeverity } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const SEVERITY_LABELS: Record<ViolationSeverity, string> = {
  Low: "Baixa",
  Medium: "Média",
  High: "Alta",
  Critical: "Crítica",
};

const emptyViolation = (): RegisterViolationRequest => ({ description: "", severity: "Low" });

const ViolationForm = ({ enforcementCase }: { enforcementCase: EnforcementCaseDto }) => {
  const [violation, setViolation] = useState(emptyViolation());
  const workflow = useWorkflow("Violação registada");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Registar violação</p>
      <div className="space-y-2">
        <Label htmlFor="v-desc">Descrição</Label>
        <Textarea id="v-desc" value={violation.description} onChange={(e) => setViolation({ ...violation, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="v-sev">Gravidade</Label>
        <Select value={violation.severity} onValueChange={(severity) => setViolation({ ...violation, severity: severity as ViolationSeverity })}>
          <SelectTrigger id="v-sev">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SEVERITY_LABELS) as ViolationSeverity[]).map((value) => (
              <SelectItem key={value} value={value}>
                {SEVERITY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy || !violation.description.trim()}
        onClick={() =>
          workflow.run(async () => {
            await registerViolation(enforcementCase.id, violation);
            setViolation(emptyViolation());
          })
        }
      >
        Registar violação
      </Button>
    </div>
  );
};

const emptyFine = (): IssueFineRequest => ({ amount: 0, currency: "AOA" });

const FineForm = ({ enforcementCase }: { enforcementCase: EnforcementCaseDto }) => {
  const [fine, setFine] = useState(emptyFine());
  const workflow = useWorkflow("Multa aplicada");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Aplicar multa</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="f-amount">Valor</Label>
          <Input id="f-amount" type="number" min={0} value={fine.amount || ""} onChange={(e) => setFine({ ...fine, amount: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-currency">Moeda</Label>
          <Input id="f-currency" value={fine.currency} onChange={(e) => setFine({ ...fine, currency: e.target.value })} />
        </div>
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy || fine.amount <= 0}
        onClick={() =>
          workflow.run(async () => {
            await issueFine(enforcementCase.id, fine);
            setFine(emptyFine());
          })
        }
      >
        Aplicar multa
      </Button>
    </div>
  );
};

const EnforcementDetailPage = () => {
  const { id = "" } = useParams();
  const workflow = useWorkflow("Processo actualizado");
  const queryClient = useQueryClient();

  const { data: enforcementCase, isLoading } = useQuery({
    queryKey: ["idf", "enforcement-cases", id],
    queryFn: () => getEnforcementCase(id),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!enforcementCase) return <p className="text-muted-foreground">Processo de fiscalização não encontrado.</p>;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["idf", "enforcement-cases", id] });

  return (
    <div className="space-y-6">
      <PageHeader
        title={enforcementCase.caseNumber ?? shortId(enforcementCase.id)}
        description={`Aberto em ${formatDate(enforcementCase.createdAt)}`}
        crumbs={[
          { label: "Controlo" },
          { label: "Fiscalização", to: "/idf/enforcement" },
          { label: enforcementCase.caseNumber ?? shortId(enforcementCase.id) },
        ]}
        actions={<StatusBadge status={enforcementCase.status} className="px-3 py-1 text-sm" />}
      />

      <RelatedSection>
        <RelatedEntityCard kind="inspection" id={enforcementCase.inspectionId} />
      </RelatedSection>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.ENFORCEMENT}
            status={enforcementCase.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "decision-pending",
                label: "Colocar em decisão",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Open", "UnderInvestigation"],
                onRun: () => workflow.run(() => markDecisionPending(enforcementCase.id)),
              },
              {
                key: "appeal",
                label: "Registar recurso",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Fined"],
                onRun: () => workflow.run(() => appealEnforcementCase(enforcementCase.id)),
              },
              {
                key: "close",
                label: "Fechar processo",
                permission: PERMISSION.UPDATE,
                enabledFor: ["DecisionPending", "Fined", "Appealed"],
                onRun: () => workflow.run(() => closeEnforcementCase(enforcementCase.id)),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Violações ({enforcementCase.violations.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enforcementCase.violations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem violações registadas.</p>
          ) : (
            <ul className="space-y-2">
              {enforcementCase.violations.map((v) => (
                <li key={v.id} className="space-y-1 rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{v.description}</span>
                    <Badge variant="outline">{SEVERITY_LABELS[v.severity]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {enforcementCase.status !== "Closed" && enforcementCase.status !== "Cancelled" && (
            <ViolationForm enforcementCase={enforcementCase} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Multas ({enforcementCase.fines.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enforcementCase.fines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem multas aplicadas.</p>
          ) : (
            <div className="space-y-3">
              {enforcementCase.fines.map((fine) =>
                fine.revenueTransactionId ? (
                  <PaymentPanel key={fine.id} revenueTransactionId={fine.revenueTransactionId} onPaid={refresh} />
                ) : (
                  <div key={fine.id} className="rounded-md border p-3 text-sm">
                    {fine.amount.toLocaleString("pt-AO")} {fine.currency}
                  </div>
                ),
              )}
            </div>
          )}
          {enforcementCase.status !== "Closed" && enforcementCase.status !== "Cancelled" && (
            <FineForm enforcementCase={enforcementCase} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnforcementDetailPage;
