import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Warehouse as WarehouseIcon } from "lucide-react";
import { ResourceWorkspace } from "@/components/idf/ResourceWorkspace";
import { EntityPicker } from "@/components/idf/EntityPicker";
import { EntityLabel } from "@/components/idf/EntityLabel";
import { CoordinatePicker } from "@/components/idf/CoordinatePicker";
import { StatusBadge } from "@/components/idf/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  listWarehouses,
  registerWarehouse,
  registerWarehouseEntry,
  registerWarehouseExit,
} from "@/modules/idf/api/warehouses";
import { loadClosedLots } from "@/modules/idf/api/pickers";
import { SERVICE } from "@/modules/idf/config/modules";
import { useWorkflow } from "@/modules/idf/hooks/useWorkflow";
import { fieldError } from "@/modules/idf/hooks/useProblem";
import { formatDate } from "@/lib/date";
import type {
  RegisterWarehouseRequest,
  WarehouseDto,
  WarehouseMovementRequest,
  WarehouseMovementType,
  WarehouseStatus,
} from "@/modules/idf/types";

const MOVEMENT_TYPE_LABELS: Record<WarehouseMovementType, string> = {
  Entry: "Entrada",
  Exit: "Saída",
  InternalTransfer: "Transferência interna",
  Adjustment: "Ajuste",
};

const emptyMovement = (): WarehouseMovementRequest => ({
  forestLotId: "",
  volume: 0,
  movementDate: new Date().toISOString().slice(0, 10),
});

const MovementForm = ({ warehouse }: { warehouse: WarehouseDto }) => {
  const [direction, setDirection] = useState<"Entry" | "Exit">("Entry");
  const [movement, setMovement] = useState(emptyMovement());
  const workflow = useWorkflow("Movimento registado");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">Registar movimento</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mv-type">Tipo</Label>
          <Select value={direction} onValueChange={(value) => setDirection(value as "Entry" | "Exit")}>
            <SelectTrigger id="mv-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry">Entrada</SelectItem>
              <SelectItem value="Exit">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <EntityPicker
          id="mv-lot"
          label="Lote"
          queryKey={["idf", "picker", "closed-lots"]}
          load={loadClosedLots}
          value={movement.forestLotId}
          onChange={(v) => setMovement({ ...movement, forestLotId: v })}
        />
        <div className="space-y-2">
          <Label htmlFor="mv-volume">Volume (m3)</Label>
          <Input
            id="mv-volume"
            type="number"
            step="0.01"
            value={movement.volume || ""}
            onChange={(e) => setMovement({ ...movement, volume: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mv-date">Data</Label>
          <Input
            id="mv-date"
            type="date"
            value={movement.movementDate}
            onChange={(e) => setMovement({ ...movement, movementDate: e.target.value })}
          />
        </div>
      </div>
      <Button
        size="sm"
        disabled={workflow.isBusy}
        onClick={() =>
          workflow.run(async () => {
            const register = direction === "Entry" ? registerWarehouseEntry : registerWarehouseExit;
            await register(warehouse.id, movement);
            setMovement(emptyMovement());
          })
        }
      >
        Registar movimento
      </Button>
      <p className="text-xs text-muted-foreground">Regra 9.6: stock físico e documental são actualizados em conjunto.</p>
    </div>
  );
};

const WarehousesPage = () => (
  <ResourceWorkspace<WarehouseDto, RegisterWarehouseRequest>
    service={SERVICE.WAREHOUSES}
    title="Entrepostos"
    description="Gestão de entrepostos e stock de madeira (entradas e saídas de lotes)."
    crumbs={[{ label: "Cadeia de Custódia" }, { label: "Entrepostos" }]}
    queryKey="warehouses"
    searchPlaceholder="Pesquisar por código ou nome"
    emptyMessage="Sem entrepostos registados"
    statuses={["Active", "Inactive", "Suspended"]}
    stats={[
      { key: "total", label: "Total", status: "all", icon: WarehouseIcon },
      { key: "active", label: "Activos", status: "Active", icon: WarehouseIcon },
      { key: "suspended", label: "Suspensos", status: "Suspended", icon: WarehouseIcon },
    ]}
    fetchPage={({ page, search, status }) =>
      listWarehouses({ page, pageSize: 10, code: search, status: status as WarehouseStatus | "all" })
    }
    getStatus={(item) => item.status}
    getTitle={(item) => item.name}
    columns={[
      { key: "code", header: "Código", render: (item) => <span className="font-medium">{item.code}</span> },
      { key: "name", header: "Nome", render: (item) => item.name },
      {
        key: "location",
        header: "Localização",
        render: (item) => `${item.location.latitude.toFixed(3)}, ${item.location.longitude.toFixed(3)}`,
      },
      {
        key: "stock",
        header: "Stock (m3)",
        render: (item) => item.stocks.reduce((sum, s) => sum + s.volume, 0).toLocaleString("pt-AO"),
      },
    ]}
    create={{
      label: "Novo entreposto",
      dialogTitle: "Registar entreposto",
      initial: () => ({ code: "", name: "", location: { latitude: 0, longitude: 0 } }),
      submit: registerWarehouse,
      render: ({ value, setValue, errors }) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wh-code">Código</Label>
              <Input
                id="wh-code"
                value={value.code}
                placeholder="ENT-001"
                onChange={(e) => setValue((prev) => ({ ...prev, code: e.target.value }))}
              />
              {fieldError(errors, "code") && <p className="text-sm text-destructive">{fieldError(errors, "code")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="wh-name">Nome</Label>
              <Input
                id="wh-name"
                value={value.name}
                onChange={(e) => setValue((prev) => ({ ...prev, name: e.target.value }))}
              />
              {fieldError(errors, "name") && <p className="text-sm text-destructive">{fieldError(errors, "name")}</p>}
            </div>
          </div>
          <CoordinatePicker
            label="Localização"
            value={value.location}
            onChange={(location) => setValue((prev) => ({ ...prev, location }))}
          />
        </>
      ),
    }}
    detail={(item) => (
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Stock total</dt>
            <dd className="text-lg font-semibold">
              {item.stocks.reduce((sum, s) => sum + s.volume, 0).toLocaleString("pt-AO")} m3
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Localização</dt>
            <dd className="font-medium">
              {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
            </dd>
          </div>
        </dl>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-semibold">Stock por lote ({item.stocks.length})</p>
          {item.stocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem stock registado.</p>
          ) : (
            <ul className="space-y-2">
              {item.stocks.map((stock) => (
                <li key={stock.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <EntityLabel kind="lot" id={stock.forestLotId} />
                    <StatusBadge status={stock.stockStatus} />
                  </div>
                  <p className="text-muted-foreground">{stock.volume} m3</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Movimentos ({item.movements.length})</p>
          {item.movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem movimentos registados.</p>
          ) : (
            <ul className="space-y-2">
              {item.movements.map((movement) => (
                <li key={movement.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{MOVEMENT_TYPE_LABELS[movement.movementType]}</span>
                    <span className="text-muted-foreground">{formatDate(movement.movementDate)}</span>
                  </div>
                  <p className="text-muted-foreground">
                    {movement.forestLotId ? <EntityLabel kind="lot" id={movement.forestLotId} /> : "—"} · {movement.volume} m3
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <MovementForm warehouse={item} />

        <Separator />

        <Button asChild className="w-full">
          <Link to={`/idf/warehouses/${item.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir processo completo
          </Link>
        </Button>
      </div>
    )}
  />
);

export default WarehousesPage;
