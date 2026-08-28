import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { PaymentPanel } from "@/components/idf/PaymentPanel";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  appealEnforcementCase,
  closeEnforcementCase,
  issueFine,
  listEnforcementCases,
  markDecisionPending,
  openEnforcementCase,
  registerViolation,
} from "@/modules/idf/api/enforcement";
import { loadCompletedInspections } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError, toProblem } from "@/modules/idf/hooks/useProblem";
import { formatDate } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import type {
  EnforcementCaseDto,
  EnforcementCaseStatus,
  IssueFineRequest,
  OpenEnforcementCaseRequest,
  RegisterViolationRequest,
  ViolationSeverity,
} from "@/modules/idf/types";

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
        <Textarea
          id="v-desc"
          value={violation.description}
          onChange={(e) => setViolation({ ...violation, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="v-sev">Gravidade</Label>
        <Select
          value={violation.severity}
          onValueChange={(severity) => setViolation({ ...violation, severity: severity as ViolationSeverity })}
        >
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
          <Input
            id="f-amount"
            type="number"
            min={0}
            value={fine.amount || ""}
            onChange={(e) => setFine({ ...fine, amount: Number(e.target.value) })}
          />
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

const EnforcementPage = () => {
  const workflow = useWorkflow("Processo actualizado");
  const { toast } = useToast();

  return (
    <ResourceWorkspace<EnforcementCaseDto, OpenEnforcementCaseRequest>
      service={SERVICE.ENFORCEMENT}
      title="Fiscalização"
      description="Processos de fiscalização: violações, multas e recurso, normalmente originados por uma inspecção."
      crumbs={[{ label: "Controlo" }, { label: "Fiscalização" }]}
      queryKey="enforcement-cases"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem processos de fiscalização"
      statuses={["Open", "UnderInvestigation", "DecisionPending", "Fined", "Appealed", "Closed", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: ShieldAlert },
        { key: "open", label: "Em aberto", status: "Open", icon: ShieldAlert },
        { key: "fined", label: "Multados", status: "Fined", icon: ShieldAlert },
        { key: "closed", label: "Fechados", status: "Closed", icon: ShieldAlert },
      ]}
      fetchPage={({ page, status }) =>
        listEnforcementCases({ page, pageSize: 10, status: status as EnforcementCaseStatus | "all" })
      }
      getStatus={(item) => item.status}
      getTitle={(item) => item.caseNumber ?? shortId(item.id)}
      columns={[
        {
          key: "number",
          header: "Processo",
          render: (item) => <span className="font-medium">{item.caseNumber ?? shortId(item.id)}</span>,
        },
        {
          key: "inspection",
          header: "Inspecção",
          render: (item) => (item.inspectionId ? <EntityLabel kind="inspection" id={item.inspectionId} /> : "—"),
        },
        { key: "violations", header: "Violações", render: (item) => item.violations.length },
        { key: "fines", header: "Multas", render: (item) => item.fines.length },
        { key: "opened", header: "Aberto em", render: (item) => formatDate(item.createdAt) },
      ]}
      create={{
        label: "Abrir processo",
        dialogTitle: "Abrir processo de fiscalização",
        dialogDescription: "Normalmente originado por uma inspecção concluída.",
        initial: () => ({ inspectionId: null }),
        submit: openEnforcementCase,
        render: ({ value, setValue, errors }) => (
          <EntityPicker
            id="ec-inspection"
            label="Inspecção de origem"
            queryKey={["idf", "picker", "completed-inspections"]}
            load={loadCompletedInspections}
            value={value.inspectionId ?? ""}
            onChange={(v) => setValue((prev) => ({ ...prev, inspectionId: v || null }))}
            emptyMessage="Sem inspecções concluídas disponíveis."
            error={fieldError(errors, "inspectionId")}
          />
        ),
      }}
      detail={(item, { refresh }) => (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Inspecção de origem</dt>
              <dd className="font-medium">
                {item.inspectionId ? <EntityLabel kind="inspection" id={item.inspectionId} /> : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Aberto em</dt>
              <dd className="font-medium">{formatDate(item.createdAt)}</dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Violações ({item.violations.length})</p>
            {item.violations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem violações registadas.</p>
            ) : (
              <ul className="space-y-2">
                {item.violations.map((v) => (
                  <li key={v.id} className="space-y-1 rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{v.description}</span>
                      <Badge variant="outline">{SEVERITY_LABELS[v.severity]}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {item.status !== "Closed" && item.status !== "Cancelled" && <ViolationForm enforcementCase={item} />}

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-semibold">Multas ({item.fines.length})</p>
            {item.fines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem multas aplicadas.</p>
            ) : (
              <div className="space-y-3">
                {item.fines.map((fine) =>
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
          </div>

          {item.status !== "Closed" && item.status !== "Cancelled" && <FineForm enforcementCase={item} />}

          <Separator />

          <WorkflowActions
            service={SERVICE.ENFORCEMENT}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "decision-pending",
                label: "Colocar em decisão",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Open", "UnderInvestigation"],
                onRun: () => workflow.run(() => markDecisionPending(item.id)),
              },
              {
                key: "appeal",
                label: "Registar recurso",
                permission: PERMISSION.UPDATE,
                variant: "outline",
                enabledFor: ["Fined"],
                onRun: () => workflow.run(() => appealEnforcementCase(item.id)),
              },
              {
                key: "close",
                label: "Fechar processo",
                permission: PERMISSION.UPDATE,
                enabledFor: ["DecisionPending", "Fined", "Appealed"],
                onRun: () =>
                  workflow.run(async () => {
                    await closeEnforcementCase(item.id);
                    toast({ title: "Processo fechado" });
                  }),
              },
            ]}
          />

          <Separator />

          <Button asChild className="w-full">
            <Link to={`/idf/enforcement/${item.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir processo completo
            </Link>
          </Button>
        </div>
      )}
    />
  );
};

export default EnforcementPage;
