import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ExternalLink, Paperclip, Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QueryEmpty, QueryTableSkeleton } from "@/components/ui/query-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  activateOperator,
  approveOperator,
  listOperators,
  rejectOperator,
  startLegalValidation,
  startTechnicalValidation,
  submitOperator,
  suspendOperator,
} from "@/modules/idf/api/operators";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { usePermission } from "@/modules/idf/hooks/usePermission";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { cn } from "@/lib/utils";
import type { OperatorStatus } from "@/modules/idf/types";

const STATS: { key: string; label: string; status: OperatorStatus | "all" }[] = [
  { key: "total", label: "Total", status: "all" },
  { key: "draft", label: "Rascunhos", status: "Draft" },
  { key: "active", label: "Activos", status: "Active" },
  { key: "suspended", label: "Suspensos", status: "Suspended" },
];

const STATUSES: (OperatorStatus | "all")[] = [
  "all",
  "Draft",
  "Submitted",
  "TechnicalValidation",
  "LegalValidation",
  "Approved",
  "Active",
  "Suspended",
  "Rejected",
];

const TYPE_LABELS: Record<string, string> = {
  Individual: "Individual",
  Company: "Empresa",
  Cooperative: "Cooperativa",
  PublicEntity: "Entidade pública",
};

const OperatorsListPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OperatorStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canCreate = usePermission(SERVICE.OPERATORS, PERMISSION.CREATE);
  const workflow = useWorkflow("Operador actualizado");

  const { data, isLoading } = useQuery({
    queryKey: ["idf", "operators", { search, status, page }],
    queryFn: () => listOperators({ legalName: search, status, page, pageSize: 10 }),
  });

  const selected = data?.items.find((item) => item.id === selectedId) ?? null;

  const statResults = useQueries({
    queries: STATS.map((stat) => ({
      queryKey: ["idf", "operators", "stat", stat.status],
      queryFn: () => listOperators({ status: stat.status, page: 1, pageSize: 1 }).then((r) => r.totalCount),
      staleTime: 30_000,
    })),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operadores Florestais"
        description="Registo, validação e activação das entidades autorizadas a operar no sector florestal."
        crumbs={[{ label: "Cadastro" }, { label: "Operadores" }]}
        actions={
          canCreate ? (
            <Button asChild>
              <Link to="/idf/operators/new">
                <Plus className="mr-2 h-4 w-4" />
                Novo operador
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap gap-3">
        {STATS.map((stat, index) => {
          const result = statResults[index];
          const isCurrent = status === stat.status;
          return (
            <button
              key={stat.key}
              type="button"
              onClick={() => {
                setStatus(stat.status);
                setPage(1);
              }}
              className={cn(
                "flex min-w-[150px] flex-1 items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                isCurrent ? "border-primary/50 bg-primary/5" : "border-border/70 bg-card hover:border-primary/30",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isCurrent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                )}
              >
                <Users className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                {result?.isLoading ? (
                  <Skeleton className="mt-1 h-6 w-10" />
                ) : (
                  <p className="font-display text-xl font-extrabold tabular-nums leading-tight">
                    {result?.isError ? "—" : (result?.data ?? 0)}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden border-border/70 shadow-sm">
        <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center md:px-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="bg-background pl-9"
              placeholder="Pesquisar por denominação ou NIF"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as OperatorStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-background sm:w-56">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "Todos os estados" : <StatusBadge status={option} />}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 md:p-6">
              <QueryTableSkeleton rows={5} cols={5} />
            </div>
          ) : !data || data.items.length === 0 ? (
            <QueryEmpty
              icon={<Users className="mb-4 h-12 w-12 text-muted-foreground/40" />}
              title="Sem operadores registados"
              description="Crie o primeiro operador para iniciar a cadeia florestal."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Denominação legal
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">NIF</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Província
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((operator) => (
                      <TableRow
                        key={operator.id}
                        className={cn("cursor-pointer", "even:bg-muted/20")}
                        onClick={() => setSelectedId(operator.id)}
                      >
                        <TableCell className="font-medium">{operator.legalName}</TableCell>
                        <TableCell>{operator.taxIdentificationNumber}</TableCell>
                        <TableCell>{TYPE_LABELS[operator.type] ?? operator.type}</TableCell>
                        <TableCell>{operator.address.province}</TableCell>
                        <TableCell>
                          <StatusBadge status={operator.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 text-sm text-muted-foreground md:px-6">
                <span>
                  <span className="font-medium text-foreground">{data.totalCount}</span> registo(s) · página{" "}
                  <span className="font-medium text-foreground">{data.page}</span> de {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={!data.hasPreviousPage} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled={!data.hasNextPage} onClick={() => setPage((p) => p + 1)}>
                    Seguinte
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader className="mb-6 space-y-2 text-left">
                <SheetTitle className="flex flex-wrap items-center gap-2 font-display text-xl">
                  {selected.legalName}
                  <StatusBadge status={selected.status} />
                </SheetTitle>
                {selected.operatorNumber && (
                  <p className="text-xs text-muted-foreground">Nº {selected.operatorNumber}</p>
                )}
              </SheetHeader>

              <div className="space-y-5">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">NIF</dt>
                    <dd className="font-medium">{selected.taxIdentificationNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Tipo</dt>
                    <dd className="font-medium">{TYPE_LABELS[selected.type] ?? selected.type}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Morada</dt>
                    <dd className="font-medium">
                      {[selected.address.street, selected.address.municipality, selected.address.province]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </dd>
                  </div>
                </dl>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Contactos</p>
                  {selected.contacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem contactos.</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.contacts.map((contact, index) => (
                        <div key={index} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-muted-foreground">{contact.email}</p>
                            {contact.phoneNumber && <p className="text-muted-foreground">{contact.phoneNumber}</p>}
                          </div>
                          {contact.isPrimary && <StatusBadge status="Active" className="shrink-0" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Documentos</p>
                  {selected.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem documentos carregados.</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.documents.map((document, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium">{document.documentType}</p>
                            <p className="text-muted-foreground">{document.documentNumber}</p>
                          </div>
                          {document.fileReference ? (
                            <a
                              href={document.fileReference}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-primary hover:underline"
                            >
                              <Paperclip className="h-4 w-4" />
                              Ver ficheiro
                            </a>
                          ) : (
                            <span className="text-xs text-destructive">Ficheiro em falta</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Fluxo do processo</p>
                  <WorkflowActions
                    service={SERVICE.OPERATORS}
                    status={selected.status}
                    isBusy={workflow.isBusy}
                    actions={[
                      {
                        key: "submit",
                        label: "Submeter",
                        permission: PERMISSION.UPDATE,
                        enabledFor: ["Draft"],
                        onRun: () => workflow.run(() => submitOperator(selected.id)),
                      },
                      {
                        key: "technical",
                        label: "Validação técnica",
                        permission: PERMISSION.UPDATE,
                        variant: "outline",
                        enabledFor: ["Submitted"],
                        onRun: () => workflow.run(() => startTechnicalValidation(selected.id)),
                      },
                      {
                        key: "legal",
                        label: "Validação jurídica",
                        permission: PERMISSION.UPDATE,
                        variant: "outline",
                        enabledFor: ["TechnicalValidation"],
                        onRun: () => workflow.run(() => startLegalValidation(selected.id)),
                      },
                      {
                        key: "approve",
                        label: "Aprovar",
                        permission: PERMISSION.APPROVE,
                        enabledFor: ["Submitted", "TechnicalValidation", "LegalValidation"],
                        onRun: () => workflow.run(() => approveOperator(selected.id)),
                      },
                      {
                        key: "reject",
                        label: "Rejeitar",
                        permission: PERMISSION.APPROVE,
                        variant: "destructive",
                        enabledFor: ["Submitted", "TechnicalValidation", "LegalValidation"],
                        onRun: () => workflow.run(() => rejectOperator(selected.id)),
                      },
                      {
                        key: "activate",
                        label: "Activar",
                        permission: PERMISSION.ENABLE,
                        enabledFor: ["Approved", "Suspended"],
                        onRun: () => workflow.run(() => activateOperator(selected.id)),
                      },
                      {
                        key: "suspend",
                        label: "Suspender",
                        permission: PERMISSION.DISABLE,
                        variant: "destructive",
                        enabledFor: ["Active"],
                        onRun: () => workflow.run(() => suspendOperator(selected.id)),
                      },
                    ]}
                  />
                </div>

                <Separator />

                <Button asChild className="w-full">
                  <Link to={`/idf/operators/${selected.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir processo completo
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OperatorsListPage;
