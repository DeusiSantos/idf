import { call, cleanParams, http } from "@/modules/idf/api/http";
import { FOREST_INVENTORY_STATUS, TREE_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  CreateInventoryRequest,
  ForestInventoryDto,
  ForestInventoryStatus,
  InventoryTreeDto,
  PagedQuery,
  PagedResult,
  RegisterTreeRequest,
  TreeStatus,
} from "@/modules/idf/types";

const BASE = "idf/forest-inventories";

interface RawTree extends Omit<InventoryTreeDto, "status"> {
  status: number;
}
interface RawInventory extends Omit<ForestInventoryDto, "status" | "trees"> {
  status: number;
  trees: RawTree[];
}

const mapTree = (raw: RawTree): InventoryTreeDto => ({ ...raw, status: toEnumName(TREE_STATUS, raw.status) });

const mapInventory = (raw: RawInventory): ForestInventoryDto => ({
  ...raw,
  status: toEnumName(FOREST_INVENTORY_STATUS, raw.status),
  trees: raw.trees.map(mapTree),
});

export interface InventoryListQuery extends PagedQuery {
  concessionId?: string;
  status?: ForestInventoryStatus | "all";
}

export const listInventories = async (query: InventoryListQuery = {}): Promise<PagedResult<ForestInventoryDto>> => {
  const raw = await call<PagedResult<RawInventory>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ConcessionId: query.concessionId,
        Status:
          query.status && query.status !== "all" ? toEnumOrdinal(FOREST_INVENTORY_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapInventory) };
};

export const getInventory = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.get(`${BASE}/${id}`)).then(mapInventory);

export const createInventory = (request: CreateInventoryRequest): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(BASE, request)).then(mapInventory);

export const registerTree = (inventoryId: string, request: RegisterTreeRequest): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${inventoryId}/trees`, request)).then(mapInventory);

/** Fluxo linear: Draft → InProgress (só depois disto é que se podem registar árvores). */
export const beginInventorySurvey = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${id}/begin-survey`)).then(mapInventory);

export const submitInventory = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${id}/submit`)).then(mapInventory);

export const beginInventoryTechnicalReview = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${id}/begin-technical-review`)).then(mapInventory);

export const validateInventory = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${id}/validate`)).then(mapInventory);

export const rejectInventory = (id: string): Promise<ForestInventoryDto> =>
  call<RawInventory>(http.post(`${BASE}/${id}/reject`)).then(mapInventory);

export interface InventoryTreeListQuery {
  status?: TreeStatus | "all";
}

/**
 * `GET /idf/concessions/{concessionId}/inventories/{inventoryId}/trees` — árvores para selecção de
 * corte no plano de maneio; só devolve resultado quando o inventário está `Validated`.
 */
export const listInventoryTrees = async (
  concessionId: string,
  inventoryId: string,
  query: InventoryTreeListQuery = {},
): Promise<InventoryTreeDto[]> => {
  const raw = await call<RawTree[]>(
    http.get(`idf/concessions/${concessionId}/inventories/${inventoryId}/trees`, {
      params: cleanParams({
        Status: query.status && query.status !== "all" ? toEnumOrdinal(TREE_STATUS, query.status) : undefined,
      }),
    }),
  );
  return raw.map(mapTree);
};
