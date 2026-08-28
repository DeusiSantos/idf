import { call, cleanParams, http } from "@/modules/idf/api/http";
import { FOREST_LOT_STATUS, LOG_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  CreateLogRequest,
  ForestLotDto,
  ForestLotStatus,
  LogDto,
  LogStatus,
  MeasureLogRequest,
  PagedQuery,
  PagedResult,
} from "@/modules/idf/types";

const LOGS_BASE = "idf/logs";
const LOTS_BASE = "idf/forest-lots";
const OPERATIONS_BASE = "idf/exploitation-operations";

interface RawLog extends Omit<LogDto, "status"> {
  status: number;
}
interface RawLot extends Omit<ForestLotDto, "status"> {
  status: number;
}

const mapLog = (raw: RawLog): LogDto => ({ ...raw, status: toEnumName(LOG_STATUS, raw.status) });
const mapLot = (raw: RawLot): ForestLotDto => ({ ...raw, status: toEnumName(FOREST_LOT_STATUS, raw.status) });

/* ------------------------------------------------------------------- Toras */

export const getLog = (id: string): Promise<LogDto> => call<RawLog>(http.get(`${LOGS_BASE}/${id}`)).then(mapLog);

export const createLog = (request: CreateLogRequest): Promise<LogDto> =>
  call<RawLog>(http.post(LOGS_BASE, request)).then(mapLog);

export const measureLog = (id: string, request: MeasureLogRequest): Promise<LogDto> =>
  call<RawLog>(http.post(`${LOGS_BASE}/${id}/measure`, request)).then(mapLog);

export const markLogAvailable = (id: string): Promise<LogDto> =>
  call<RawLog>(http.post(`${LOGS_BASE}/${id}/mark-available`)).then(mapLog);

/**
 * `GET /idf/exploitation-operations/{operationId}/logs` — toras de uma operação; omitir `status`
 * devolve todas. É a única listagem de toras que a API expõe (por operação, não global).
 */
export const listOperationLogs = async (operationId: string, status?: LogStatus | "all"): Promise<LogDto[]> => {
  const raw = await call<RawLog[]>(
    http.get(`${OPERATIONS_BASE}/${operationId}/logs`, {
      params: cleanParams({ status: status && status !== "all" ? status : undefined }),
    }),
  );
  return raw.map(mapLog);
};

/* ------------------------------------------------------------------- Lotes */

export interface LotListQuery extends PagedQuery {
  lotCode?: string;
  status?: ForestLotStatus | "all";
}

export const listLots = async (query: LotListQuery = {}): Promise<PagedResult<ForestLotDto>> => {
  const raw = await call<PagedResult<RawLot>>(
    http.get(LOTS_BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        LotCode: query.lotCode,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(FOREST_LOT_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapLot) };
};

export const getLot = (id: string): Promise<ForestLotDto> => call<RawLot>(http.get(`${LOTS_BASE}/${id}`)).then(mapLot);

/** Sem corpo — o `lotCode` é gerado pela API. */
export const createLot = (): Promise<ForestLotDto> => call<RawLot>(http.post(LOTS_BASE)).then(mapLot);

export const addLogToLot = (lotId: string, logId: string): Promise<ForestLotDto> =>
  call<RawLot>(http.post(`${LOTS_BASE}/${lotId}/add-log`, { logId })).then(mapLot);

export const closeLot = (id: string): Promise<ForestLotDto> =>
  call<RawLot>(http.post(`${LOTS_BASE}/${id}/close`)).then(mapLot);
