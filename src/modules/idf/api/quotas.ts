import { call, cleanParams, http } from "@/modules/idf/api/http";
import { QUOTA_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type { ForestQuotaDto, PagedQuery, PagedResult, QuotaStatus, RequestQuotaRequest } from "@/modules/idf/types";

const BASE = "idf/forest-quotas";

interface RawQuota extends Omit<ForestQuotaDto, "status"> {
  status: number;
}

const mapQuota = (raw: RawQuota): ForestQuotaDto => ({ ...raw, status: toEnumName(QUOTA_STATUS, raw.status) });

export interface QuotaListQuery extends PagedQuery {
  concessionId?: string;
  forestInventoryId?: string;
  managementPlanId?: string;
  status?: QuotaStatus | "all";
}

export const listQuotas = async (query: QuotaListQuery = {}): Promise<PagedResult<ForestQuotaDto>> => {
  const raw = await call<PagedResult<RawQuota>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ConcessionId: query.concessionId,
        ForestInventoryId: query.forestInventoryId,
        ManagementPlanId: query.managementPlanId,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(QUOTA_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapQuota) };
};

export const getQuota = (id: string): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.get(`${BASE}/${id}`)).then(mapQuota);

export const requestQuota = (request: RequestQuotaRequest): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.post(BASE, request)).then(mapQuota);

export const beginQuotaAnalysis = (id: string): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.post(`${BASE}/${id}/begin-analysis`)).then(mapQuota);

export const approveQuota = (id: string): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.post(`${BASE}/${id}/approve`)).then(mapQuota);

export const consumeQuota = (id: string, volume: number): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.post(`${BASE}/${id}/consume`, { volume })).then(mapQuota);

export const completeQuotaConsumption = (id: string): Promise<ForestQuotaDto> =>
  call<RawQuota>(http.post(`${BASE}/${id}/complete-consumption`)).then(mapQuota);
