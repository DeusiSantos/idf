import { ReactNode, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Plus, Search, type LucideIcon } from "lucide-react";
import { PageHeader, type Crumb } from "@/components/idf/PageHeader";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QueryEmpty, QueryTableSkeleton } from "@/components/ui/query-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PERMISSION, type ServiceCode } from "@/modules/idf/config/modules";
import { usePermission } from "@/modules/idf/hooks/usePermission";
import { toProblem } from "@/modules/idf/hooks/useProblem";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PagedResult } from "@/modules/idf/types";

export interface ResourceColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

export interface CreateFormContext<C> {
  value: C;
  setValue: (updater: (prev: C) => C) => void;
  errors: Record<string, string[]>;
}

/** Card de resumo clicável acima da tabela — clicar aplica `status` como filtro (o mesmo do dropdown). */
export interface ResourceStat {
  key: string;
  label: string;
  /** "all" para o total geral, ou um dos valores de `statuses`. */
  status: string;
  icon?: LucideIcon;
}

export interface ResourceWorkspaceProps<T extends { id: string }, C> {
  service: ServiceCode;
  title: string;
  description: string;
  crumbs: Crumb[];
  queryKey: string;
  fetchPage: (query: { page: number; search: string; status: string }) => Promise<PagedResult<T>>;
  columns: ResourceColumn<T>[];
  getStatus?: (item: T) => string;
  getTitle: (item: T) => string;
  statuses?: string[];
  /** Cards de totais acima da tabela (secção 10 — visão rápida antes de filtrar manualmente). */
  stats?: ResourceStat[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  create?: {
    label: string;
    dialogTitle: string;
    dialogDescription?: string;
    initial: () => C;
    render: (ctx: CreateFormContext<C>) => ReactNode;
    submit: (value: C) => Promise<unknown>;
    wide?: boolean;
  };
  detail?: (item: T, ctx: { refresh: () => void; close: () => void }) => ReactNode;
  extraActions?: ReactNode;
}

/**
 * Estrutura comum a todos os módulos IDF: listagem paginada com filtros,
 * formulário de criação (erros ProblemDetails por campo) e painel de detalhe
 * com o workflow do processo.
 */
export function ResourceWorkspace<T extends { id: string }, C>({
  service,
  title,
  description,
  crumbs,
  queryKey,
  fetchPage,
  columns,
  getStatus,
  getTitle,
  statuses,
  stats,
  searchPlaceholder = "Pesquisar…",
  emptyMessage = "Sem registos.",
  create,
  detail,
  extraActions,
}: ResourceWorkspaceProps<T, C>) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [formValue, setFormValue] = useState<C | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canCreate = usePermission(service, PERMISSION.CREATE);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["idf", queryKey, { search, status, page }],
    queryFn: () => fetchPage({ page, search, status }),
  });

  // Contagens dos cards de resumo — um totalCount por card (pageSize:1, é só a contagem que interessa),
  // sempre globais (independentes da pesquisa em curso) para responderem sempre "quantos ao todo".
  const statResults = useQueries({
    queries: (stats ?? []).map((stat) => ({
      queryKey: ["idf", queryKey, "stat", stat.status],
      queryFn: () => fetchPage({ page: 1, search: "", status: stat.status }).then((r) => r.totalCount),
      staleTime: 30_000,
    })),
  });

  const selected = data?.items.find((item) => item.id === selectedId) ?? null;

  const openCreate = () => {
    setFormValue(create!.initial());
    setErrors({});
    setCreateOpen(true);
  };

  const submit = useMutation({
    mutationFn: () => create!.submit(formValue as C),
    onSuccess: () => {
      setCreateOpen(false);
      toast({ title: "Registo criado com sucesso" });
      queryClient.invalidateQueries({ queryKey: ["idf"] });
    },
    onError: (error) => {
      const problem = toProblem(error);
      setErrors(problem.errors ?? {});
      if (!problem.errors) toast({ variant: "destructive", title: "Não foi possível guardar", description: problem.detail });
    },
  });

  const columnCount = columns.length + (getStatus ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        crumbs={crumbs}
        actions={
          <>
            {extraActions}
            {create && canCreate && (
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {create.label}
              </Button>
            )}
          </>
        }
      />

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {stats.map((stat, index) => {
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
                {stat.icon && (
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      isCurrent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                    )}
                  >
                    <stat.icon className="h-[18px] w-[18px]" />
                  </span>
                )}
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
      )}

      <Card className="overflow-hidden border-border/70 shadow-sm">
        <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center md:px-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="bg-background pl-9"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {statuses && (
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-background sm:w-56">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {statuses.map((option) => (
                  <SelectItem key={option} value={option}>
                    <StatusBadge status={option} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 md:p-6">
              <QueryTableSkeleton rows={5} cols={Math.max(columnCount, 1)} />
            </div>
          ) : !data || data.items.length === 0 ? (
            <QueryEmpty
              icon={<Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />}
              title={emptyMessage}
              description={create ? `Use "${create.label}" para iniciar o processo.` : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {columns.map((column) => (
                        <TableHead key={column.key} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {column.header}
                        </TableHead>
                      ))}
                      {getStatus && (
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className={cn(detail && "cursor-pointer", "even:bg-muted/20")}
                        onClick={detail ? () => setSelectedId(item.id) : undefined}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.key}>{column.render(item)}</TableCell>
                        ))}
                        {getStatus && (
                          <TableCell>
                            <StatusBadge status={getStatus(item)} />
                          </TableCell>
                        )}
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

      {create && formValue !== null && (
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogContent className={create.wide ? "max-h-[90vh] overflow-y-auto sm:max-w-2xl" : "max-h-[90vh] overflow-y-auto"}>
            <DialogHeader>
              <DialogTitle className="font-display">{create.dialogTitle}</DialogTitle>
              {create.dialogDescription && <DialogDescription>{create.dialogDescription}</DialogDescription>}
            </DialogHeader>
            <div className="space-y-4">
              {create.render({
                value: formValue,
                setValue: (updater) => setFormValue((prev) => updater(prev as C)),
                errors,
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button disabled={submit.isPending} onClick={() => submit.mutate()}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {detail && (
        <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
            {selected && (
              <>
                <SheetHeader className="mb-6 space-y-2 text-left">
                  <SheetTitle className="flex flex-wrap items-center gap-2 font-display text-xl">
                    {getTitle(selected)}
                    {getStatus && <StatusBadge status={getStatus(selected)} />}
                  </SheetTitle>
                </SheetHeader>
                {detail(selected, {
                  refresh: () => queryClient.invalidateQueries({ queryKey: ["idf"] }),
                  close: () => setSelectedId(null),
                })}
              </>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export default ResourceWorkspace;
