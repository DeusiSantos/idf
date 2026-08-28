import { call, cleanParams, http } from "@/modules/idf/api/http";
import { CONCESSION_STATUS, CONCESSION_TYPE, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  ConcessionDto,
  ConcessionStatus,
  ConcessionType,
  CreateConcessionRequest,
  PagedQuery,
  PagedResult,
} from "@/modules/idf/types";

const BASE = "idf/concessions";

interface RawConcession extends Omit<ConcessionDto, "type" | "status"> {
  type: number;
  status: number;
}

const mapConcession = (raw: RawConcession): ConcessionDto => ({
  ...raw,
  type: toEnumName(CONCESSION_TYPE, raw.type),
  status: toEnumName(CONCESSION_STATUS, raw.status),
});

export interface ConcessionListQuery extends PagedQuery {
  forestOperatorId?: string;
  code?: string;
  status?: ConcessionStatus | "all";
  type?: ConcessionType;
}

export const listConcessions = async (query: ConcessionListQuery = {}): Promise<PagedResult<ConcessionDto>> => {
  const raw = await call<PagedResult<RawConcession>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ForestOperatorId: query.forestOperatorId,
        Code: query.code,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(CONCESSION_STATUS, query.status) : undefined,
        Type: query.type ? toEnumOrdinal(CONCESSION_TYPE, query.type) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapConcession) };
};

export const getConcession = (id: string): Promise<ConcessionDto> =>
  call<RawConcession>(http.get(`${BASE}/${id}`)).then(mapConcession);

export const createConcession = (request: CreateConcessionRequest): Promise<ConcessionDto> =>
  call<RawConcession>(
    http.post(BASE, { ...request, type: toEnumOrdinal(CONCESSION_TYPE, request.type) }),
  ).then(mapConcession);

const transition = (id: string, action: string) =>
  call<RawConcession>(http.post(`${BASE}/${id}/${action}`)).then(mapConcession);

export const submitConcession = (id: string) => transition(id, "submit");
export const beginConcessionReview = (id: string) => transition(id, "begin-review");
export const approveConcession = (id: string) => transition(id, "approve");
export const activateConcession = (id: string) => transition(id, "activate");
