import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions, type WorkflowAction } from "@/components/idf/WorkflowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  activateOperator,
  approveOperator,
  getOperator,
  rejectOperator,
  startLegalValidation,
  startTechnicalValidation,
  submitOperator,
  suspendOperator,
} from "@/modules/idf/api/operators";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { ApiError } from "@/modules/idf/types";

const TYPE_LABELS: Record<string, string> = {
  Individual: "Individual",
  Company: "Empresa",
  Cooperative: "Cooperativa",
  PublicEntity: "Entidade pública",
};

const OperatorDetailPage = () => {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();

  const { data: operator, isLoading } = useQuery({
    queryKey: ["idf", "operators", id],
    queryFn: () => getOperator(id),
  });

  const mutation = useMutation({
    mutationFn: (action: (operatorId: string) => Promise<unknown>) => action(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idf", "operators"] });
      queryClient.invalidateQueries({ queryKey: ["idf", "summary"] });
      toast({ title: "Estado actualizado" });
    },
    onError: (error: unknown) => {
      const detail = error instanceof ApiError ? error.problem.detail : "Não foi possível executar a acção.";
      toast({ variant: "destructive", title: "Acção inválida", description: detail });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!operator) return <p className="text-muted-foreground">Operador não encontrado.</p>;

  const actions: WorkflowAction[] = [
    {
      key: "submit",
      label: "Submeter",
      permission: PERMISSION.UPDATE,
      enabledFor: ["Draft"],
      onRun: () => mutation.mutate(submitOperator),
    },
    {
      key: "technical",
      label: "Validação técnica",
      permission: PERMISSION.UPDATE,
      variant: "outline",
      enabledFor: ["Submitted"],
      onRun: () => mutation.mutate(startTechnicalValidation),
    },
    {
      key: "legal",
      label: "Validação jurídica",
      permission: PERMISSION.UPDATE,
      variant: "outline",
      enabledFor: ["TechnicalValidation"],
      onRun: () => mutation.mutate(startLegalValidation),
    },
    {
      key: "approve",
      label: "Aprovar",
      permission: PERMISSION.APPROVE,
      enabledFor: ["Submitted", "TechnicalValidation", "LegalValidation"],
      onRun: () => mutation.mutate(approveOperator),
    },
    {
      key: "reject",
      label: "Rejeitar",
      permission: PERMISSION.APPROVE,
      variant: "destructive",
      enabledFor: ["Submitted", "TechnicalValidation", "LegalValidation"],
      onRun: () => mutation.mutate(rejectOperator),
    },
    {
      key: "activate",
      label: "Activar",
      permission: PERMISSION.ENABLE,
      enabledFor: ["Approved", "Suspended"],
      onRun: () => mutation.mutate(activateOperator),
    },
    {
      key: "suspend",
      label: "Suspender",
      permission: PERMISSION.DISABLE,
      variant: "destructive",
      enabledFor: ["Active"],
      onRun: () => mutation.mutate(suspendOperator),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={operator.legalName}
        description={`NIF ${operator.taxIdentificationNumber} · ${TYPE_LABELS[operator.type] ?? operator.type}`}
        crumbs={[{ label: "Cadastro" }, { label: "Operadores", to: "/idf/operators" }, { label: operator.legalName }]}
        actions={<StatusBadge status={operator.status} className="px-3 py-1 text-sm" />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowActions
            service={SERVICE.OPERATORS}
            status={operator.status}
            actions={actions}
            isBusy={mutation.isPending}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Morada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{operator.address.street || "—"}</p>
            <p className="text-muted-foreground">
              {operator.address.municipality}
              {operator.address.municipality && operator.address.province ? " · " : ""}
              {operator.address.province}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contactos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {operator.contacts.length === 0 && <p className="text-muted-foreground">Sem contactos.</p>}
            {operator.contacts.map((contact, index) => (
              <div key={index} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-muted-foreground">{contact.email}</p>
                  {contact.phoneNumber && <p className="text-muted-foreground">{contact.phoneNumber}</p>}
                </div>
                {contact.isPrimary && <StatusBadge status="Active" className="shrink-0" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {operator.documents.length === 0 && <p className="text-muted-foreground">Sem documentos carregados.</p>}
            {operator.documents.map((document, index) => (
              <div key={index} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                <div>
                  <p className="font-medium">{document.documentType}</p>
                  <p className="text-muted-foreground">{document.documentNumber}</p>
                </div>
                {document.fileReference ? (
                  <a
                    href={document.fileReference}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Paperclip className="h-4 w-4" />
                    Ver ficheiro
                  </a>
                ) : (
                  <span className="text-xs text-destructive">Ficheiro em falta</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OperatorDetailPage;
