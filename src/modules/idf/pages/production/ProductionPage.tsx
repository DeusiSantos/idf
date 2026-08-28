import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Boxes, ExternalLink } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { WorkflowActions } from "@/components/idf/WorkflowActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryEmpty, QueryTableSkeleton } from "@/components/ui/query-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addLogToLot,
  closeLot,
  createLog,
  createLot,
  getLog,
  listLots,
  listOperationLogs,
  markLogAvailable,
  measureLog,
} from "@/modules/idf/api/production";
import { getExploitationOperation } from "@/modules/idf/api/exploitation";
import { loadOpenOperations, loadOperations, loadSpecies } from "@/modules/idf/api/pickers";
import { PERMISSION, SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError, toProblem } from "@/modules/idf/hooks/useProblem";
import { getApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ForestLotDto, ForestLotStatus, LogDto, LogStatus } from "@/modules/idf/types";

const shortId = (id: string) => `#${id.slice(0, 8)}`;

const LOG_STATUSES: (LogStatus | "all")[] = [
  "all",
  "Created",
  "Measured",
  "Available",
  "AllocatedToLot",
  "InTransit",
  "Stored",
  "Exported",
];

const MeasureLogForm = ({ log, onMeasured }: { log: LogDto; onMeasured: (log: LogDto) => void }) => {
  const [length, setLength] = useState(log.length || 0);
  const [diameter, setDiameter] = useState(log.diameter || 0);
  const [volume, setVolume] = useState(log.volume.value || 0);
  const workflow = useWorkflow("Tora medida");

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-semibold">Registar medição</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Input type="number" step="0.1" placeholder="Comprimento (m)" value={length || ""} onChange={(e) => setLength(Number(e.target.value))} />
        <Input type="number" placeholder="Diâmetro (cm)" value={diameter || ""} onChange={(e) => setDiameter(Number(e.target.value))} />
        <Input type="number" step="0.01" placeholder="Volume (m3)" value={volume || ""} onChange={(e) => setVolume(Number(e.target.value))} />
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy || !length || !diameter || !volume}
        onClick={() =>
          workflow.run(async () => {
            const updated = await measureLog(log.id, { length, diameter, volume, volumeUnit: "m3" });
            onMeasured(updated);
          })
        }
      >
        Guardar medição
      </Button>
    </div>
  );
};

/** Estado + acções de uma tora: medir → disponibilizar. */
const LogResultCard = ({ log, onUpdate }: { log: LogDto; onUpdate: (log: LogDto) => void }) => {
  const workflow = useWorkflow("Tora actualizada");

  return (
    <div className="space-y-3 rounded-lg border bg-muted/40 p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{log.logCode}</span>
        <StatusBadge status={log.status} />
      </div>
      <p className="text-muted-foreground">
        <EntityLabel kind="species" id={log.speciesCode} /> · {log.length} m · ⌀ {log.diameter} cm ·{" "}
        {log.volume.value} {log.volume.unit}
      </p>

      <WorkflowActions
        service={SERVICE.PRODUCTION}
        status={log.status}
        isBusy={workflow.isBusy}
        actions={[
          {
            key: "available",
            label: "Marcar disponível",
            permission: PERMISSION.UPDATE,
            enabledFor: ["Measured"],
            onRun: () => workflow.run(() => markLogAvailable(log.id).then(onUpdate)),
          },
        ]}
      />
      {log.status === "Created" && <MeasureLogForm log={log} onMeasured={onUpdate} />}

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/idf/traceability/Log/${log.id}`}>Ver rastreabilidade</Link>
        </Button>
        <Button asChild size="sm">
          <Link to={`/idf/production/logs/${log.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir processo completo
          </Link>
        </Button>
      </div>
    </div>
  );
};

/** Tabela das toras de uma operação de exploração (única listagem que a API expõe — secção 2.1 do guia). */
const OperationLogsTable = ({ operationId, onSelect }: { operationId: string; onSelect: (log: LogDto) => void }) => {
  const [status, setStatus] = useState<LogStatus | "all">("all");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["idf", "operation-logs", operationId, status],
    queryFn: () => listOperationLogs(operationId, status),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Toras desta operação</p>
        <Select value={status} onValueChange={(v) => setStatus(v as LogStatus | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOG_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "Todos os estados" : <StatusBadge status={s} />}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <QueryTableSkeleton rows={3} cols={4} />
      ) : !logs || logs.length === 0 ? (
        <QueryEmpty title="Sem toras" description="Ainda sem toras registadas nesta operação com este estado." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Código</TableHead>
                <TableHead>Espécie</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className={cn("cursor-pointer", "even:bg-muted/20")} onClick={() => onSelect(log)}>
                  <TableCell className="font-medium">{log.logCode}</TableCell>
                  <TableCell>
                    <EntityLabel kind="species" id={log.speciesCode} />
                  </TableCell>
                  <TableCell>
                    {log.volume.value ? `${log.volume.value} ${log.volume.unit}` : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const LogsWorkspace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [operationId, setOperationId] = useState("");
  const [originTreeId, setOriginTreeId] = useState("");
  const [speciesCode, setSpeciesCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [selectedLog, setSelectedLog] = useState<LogDto | null>(null);

  const [lookupId, setLookupId] = useState("");
  const [lookedUp, setLookedUp] = useState<LogDto | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const { data: operation, isLoading: isLoadingOperation } = useQuery({
    queryKey: ["idf", "operations", operationId],
    queryFn: () => getExploitationOperation(operationId),
    enabled: !!operationId,
  });

  const create = useMutation({
    mutationFn: () => createLog({ originTreeId, exploitationOperationId: operationId, speciesCode }),
    onSuccess: (log) => {
      setSelectedLog(log);
      setOriginTreeId("");
      toast({ title: "Tora registada" });
      queryClient.invalidateQueries({ queryKey: ["idf", "operation-logs", operationId] });
    },
    onError: (error) => {
      const problem = toProblem(error);
      setErrors(problem.errors ?? {});
      if (!problem.errors) toast({ variant: "destructive", title: "Não foi possível registar", description: problem.detail });
    },
  });

  const lookup = useMutation({
    mutationFn: () => getLog(lookupId),
    onSuccess: (log) => {
      setLookedUp(log);
      setLookupError(null);
    },
    onError: (error) => {
      setLookedUp(null);
      setLookupError(getApiErrorMessage(error, "Tora não encontrada."));
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registar tora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EntityPicker
            id="log-operation"
            label="Operação de exploração"
            queryKey={["idf", "picker", "operations"]}
            load={loadOpenOperations}
            value={operationId}
            onChange={(v) => {
              setOperationId(v);
              setOriginTreeId("");
            }}
            emptyMessage="Sem operações activas."
            error={fieldError(errors, "exploitationOperationId")}
          />
          {operationId && (
            <div className="space-y-2">
              <Label>Árvore de origem (abatida nesta operação)</Label>
              {isLoadingOperation ? (
                <Skeleton className="h-10 w-full" />
              ) : !operation?.harvestedTrees.length ? (
                <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  Esta operação ainda não tem abates registados.
                </p>
              ) : (
                <Select value={originTreeId} onValueChange={setOriginTreeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione a árvore abatida" />
                  </SelectTrigger>
                  <SelectContent>
                    {operation.harvestedTrees.map((t, i) => (
                      <SelectItem key={`${t.inventoryTreeId}-${i}`} value={t.inventoryTreeId}>
                        {t.treeCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {fieldError(errors, "originTreeId") && (
                <p className="text-sm text-destructive">{fieldError(errors, "originTreeId")}</p>
              )}
            </div>
          )}
          <EntityPicker
            id="log-species"
            label="Espécie"
            queryKey={["idf", "picker", "species"]}
            load={loadSpecies}
            value={speciesCode}
            onChange={setSpeciesCode}
            error={fieldError(errors, "speciesCode")}
          />
          <Button disabled={create.isPending || !operationId || !originTreeId || !speciesCode} onClick={() => create.mutate()}>
            Registar tora
          </Button>
          <p className="text-xs text-muted-foreground">
            A tora nasce em estado "Created" — medição e disponibilização são passos seguintes (clique na tora na tabela abaixo).
          </p>
        </CardContent>
      </Card>

      {operationId && (
        <Card>
          <CardContent className="pt-6">
            <OperationLogsTable operationId={operationId} onSelect={setSelectedLog} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consultar tora por ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="ID da tora (uuid)" />
            <Button variant="outline" disabled={!lookupId || lookup.isPending} onClick={() => lookup.mutate()}>
              Consultar
            </Button>
          </div>
          {lookupError && <p className="text-sm text-destructive">{lookupError}</p>}
          {lookedUp && <LogResultCard log={lookedUp} onUpdate={setLookedUp} />}
        </CardContent>
      </Card>

      <Sheet open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selectedLog && (
            <>
              <SheetHeader className="mb-4 text-left">
                <SheetTitle className="font-display">{selectedLog.logCode}</SheetTitle>
              </SheetHeader>
              <LogResultCard log={selectedLog} onUpdate={setSelectedLog} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

/** Adicionar tora ao lote: escolhe a operação, depois uma tora "Available" dessa operação (secção 2.1 do guia). */
const AddLogToLot = ({ lot }: { lot: ForestLotDto }) => {
  const [operationId, setOperationId] = useState("");
  const [logId, setLogId] = useState("");
  const workflow = useWorkflow("Tora adicionada ao lote");

  const { data: availableLogs, isLoading } = useQuery({
    queryKey: ["idf", "operation-logs", operationId, "Available"],
    queryFn: () => listOperationLogs(operationId, "Available"),
    enabled: !!operationId,
  });

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Adicionar tora</p>
      <EntityPicker
        id="lot-add-operation"
        label="Operação de exploração"
        queryKey={["idf", "picker", "all-operations"]}
        load={loadOperations}
        value={operationId}
        onChange={(v) => {
          setOperationId(v);
          setLogId("");
        }}
      />
      {operationId && (
        <div className="space-y-2">
          <Label>Tora disponível</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : !availableLogs?.length ? (
            <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
              Sem toras disponíveis ("Available") nesta operação.
            </p>
          ) : (
            <Select value={logId} onValueChange={setLogId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione a tora" />
              </SelectTrigger>
              <SelectContent>
                {availableLogs.map((log) => (
                  <SelectItem key={log.id} value={log.id}>
                    {log.logCode} · {log.volume.value} {log.volume.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      <Button
        size="sm"
        disabled={workflow.isBusy || !logId}
        onClick={() =>
          workflow.run(async () => {
            await addLogToLot(lot.id, logId);
            setLogId("");
          })
        }
      >
        Adicionar ao lote
      </Button>
    </div>
  );
};

const LotsWorkspace = () => {
  const workflow = useWorkflow("Lote actualizado");

  return (
    <ResourceWorkspace<ForestLotDto, Record<string, never>>
      service={SERVICE.PRODUCTION}
      title="Produção — Lotes"
      description="Agrupamento de toras em lotes para trânsito, entreposto e exportação."
      crumbs={[{ label: "Exploração" }, { label: "Produção" }, { label: "Lotes" }]}
      queryKey="lots"
      searchPlaceholder="Pesquisar…"
      emptyMessage="Sem lotes formados"
      statuses={["Open", "Closed", "InTransit", "Stored", "PartiallyDispatched", "Dispatched", "Exported", "Cancelled"]}
      stats={[
        { key: "total", label: "Total", status: "all", icon: Boxes },
        { key: "open", label: "Abertos", status: "Open", icon: Boxes },
        { key: "closed", label: "Fechados", status: "Closed", icon: Boxes },
        { key: "exported", label: "Exportados", status: "Exported", icon: Boxes },
      ]}
      fetchPage={({ page, status }) => listLots({ page, pageSize: 10, status: status as ForestLotStatus | "all" })}
      getStatus={(item) => item.status}
      getTitle={(item) => item.lotCode}
      columns={[
        { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.lotCode}</span> },
        { key: "logs", header: "Toras", render: (item) => item.items.length },
      ]}
      create={{
        label: "Novo lote",
        dialogTitle: "Formar lote",
        dialogDescription: "O código do lote é gerado automaticamente. As toras são adicionadas depois de criado.",
        initial: () => ({}),
        submit: createLot,
        render: () => (
          <p className="text-sm text-muted-foreground">Confirme para criar um lote vazio — o código é atribuído pela API.</p>
        ),
      }}
      detail={(item) => (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Toras no lote ({item.items.length})</p>
            {item.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ainda sem toras associadas.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {item.items.map((logItem) => (
                  <li key={logItem.logId}>
                    <Link
                      to={`/idf/production/logs/${logItem.logId}`}
                      className="rounded-md border px-2 py-1 text-sm hover:border-primary hover:text-primary"
                    >
                      {shortId(logItem.logId)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {item.status === "Open" && <AddLogToLot lot={item} />}

          <Separator />

          <WorkflowActions
            service={SERVICE.PRODUCTION}
            status={item.status}
            isBusy={workflow.isBusy}
            actions={[
              {
                key: "close",
                label: "Fechar lote",
                permission: PERMISSION.UPDATE,
                enabledFor: ["Open"],
                onRun: () => workflow.run(() => closeLot(item.id)),
              },
            ]}
          />

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/idf/traceability/ForestLot/${item.id}`}>Ver rastreabilidade</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={`/idf/production/lots/${item.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir processo completo
              </Link>
            </Button>
          </div>
        </div>
      )}
    />
  );
};

const ProductionPage = () => (
  <Tabs defaultValue="logs" className="space-y-4">
    <TabsList>
      <TabsTrigger value="logs">Toras</TabsTrigger>
      <TabsTrigger value="lots">Lotes</TabsTrigger>
    </TabsList>
    <TabsContent value="logs">
      <LogsWorkspace />
    </TabsContent>
    <TabsContent value="lots">
      <LotsWorkspace />
    </TabsContent>
  </Tabs>
);

export default ProductionPage;
