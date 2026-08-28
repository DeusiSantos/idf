import { call, cleanParams, http } from "@/modules/idf/api/http";
import {
  WAREHOUSE_MOVEMENT_TYPE,
  WAREHOUSE_STATUS,
  WAREHOUSE_STOCK_STATUS,
  toEnumName,
  toEnumOrdinal,
} from "@/modules/idf/types/enums";
import type {
  PagedQuery,
  PagedResult,
  RegisterWarehouseRequest,
  WarehouseDto,
  WarehouseMovementDto,
  WarehouseMovementRequest,
  WarehouseStatus,
  WarehouseStockDto,
} from "@/modules/idf/types";

const BASE = "idf/warehouses";

interface RawMovement extends Omit<WarehouseMovementDto, "movementType"> {
  movementType: number;
}
interface RawStock extends Omit<WarehouseStockDto, "stockStatus"> {
  stockStatus: number;
}
interface RawWarehouse extends Omit<WarehouseDto, "status" | "movements" | "stocks"> {
  status: number;
  movements: RawMovement[];
  stocks: RawStock[];
}

const mapWarehouse = (raw: RawWarehouse): WarehouseDto => ({
  ...raw,
  status: toEnumName(WAREHOUSE_STATUS, raw.status),
  movements: raw.movements.map((m) => ({ ...m, movementType: toEnumName(WAREHOUSE_MOVEMENT_TYPE, m.movementType) })),
  stocks: raw.stocks.map((s) => ({ ...s, stockStatus: toEnumName(WAREHOUSE_STOCK_STATUS, s.stockStatus) })),
});

export interface WarehouseListQuery extends PagedQuery {
  code?: string;
  name?: string;
  status?: WarehouseStatus | "all";
}

export const listWarehouses = async (query: WarehouseListQuery = {}): Promise<PagedResult<WarehouseDto>> => {
  const raw = await call<PagedResult<RawWarehouse>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Code: query.code,
        Name: query.name,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(WAREHOUSE_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapWarehouse) };
};

export const getWarehouse = (id: string): Promise<WarehouseDto> =>
  call<RawWarehouse>(http.get(`${BASE}/${id}`)).then(mapWarehouse);

export const registerWarehouse = (request: RegisterWarehouseRequest): Promise<WarehouseDto> =>
  call<RawWarehouse>(http.post(BASE, request)).then(mapWarehouse);

export const registerWarehouseEntry = (id: string, request: WarehouseMovementRequest): Promise<WarehouseDto> =>
  call<RawWarehouse>(http.post(`${BASE}/${id}/entries`, request)).then(mapWarehouse);

export const registerWarehouseExit = (id: string, request: WarehouseMovementRequest): Promise<WarehouseDto> =>
  call<RawWarehouse>(http.post(`${BASE}/${id}/exits`, request)).then(mapWarehouse);
