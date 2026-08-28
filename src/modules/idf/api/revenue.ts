import { call, cleanParams, http } from "@/modules/idf/api/http";
import { REVENUE_ACT_TYPE, REVENUE_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  CreateRevenueTransactionRequest,
  PagedQuery,
  PagedResult,
  RevenueActType,
  RevenueStatus,
  RevenueTransactionDto,
} from "@/modules/idf/types";

const BASE = "idf/revenue-transactions";

interface RawTransaction extends Omit<RevenueTransactionDto, "actType" | "status"> {
  actType: number;
  status: number;
}

const mapTransaction = (raw: RawTransaction): RevenueTransactionDto => ({
  ...raw,
  actType: toEnumName(REVENUE_ACT_TYPE, raw.actType),
  status: toEnumName(REVENUE_STATUS, raw.status),
});

export interface RevenueListQuery extends PagedQuery {
  actType?: RevenueActType;
  sourceEntityId?: string;
  status?: RevenueStatus | "all";
}

export const listRevenueTransactions = async (
  query: RevenueListQuery = {},
): Promise<PagedResult<RevenueTransactionDto>> => {
  const raw = await call<PagedResult<RawTransaction>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ActType: query.actType ? toEnumOrdinal(REVENUE_ACT_TYPE, query.actType) : undefined,
        SourceEntityId: query.sourceEntityId,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(REVENUE_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapTransaction) };
};

export const getRevenueTransaction = (id: string): Promise<RevenueTransactionDto> =>
  call<RawTransaction>(http.get(`${BASE}/${id}`)).then(mapTransaction);

export const createRevenueTransaction = (request: CreateRevenueTransactionRequest): Promise<RevenueTransactionDto> =>
  call<RawTransaction>(
    http.post(BASE, { ...request, actType: toEnumOrdinal(REVENUE_ACT_TYPE, request.actType) }),
  ).then(mapTransaction);

export const calculateRevenueTransaction = (id: string): Promise<RevenueTransactionDto> =>
  call<RawTransaction>(http.post(`${BASE}/${id}/calculate`)).then(mapTransaction);

export const liquidateRevenueTransaction = (id: string): Promise<RevenueTransactionDto> =>
  call<RawTransaction>(http.post(`${BASE}/${id}/liquidate`)).then(mapTransaction);

export const confirmRevenuePayment = (id: string): Promise<RevenueTransactionDto> =>
  call<RawTransaction>(http.post(`${BASE}/${id}/confirm-payment`)).then(mapTransaction);
