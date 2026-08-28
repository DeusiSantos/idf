import { call, cleanParams, http } from "@/modules/idf/api/http";
import { TRANSIT_GUIDE_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  PagedQuery,
  PagedResult,
  RequestTransitGuideRequest,
  TransitGuideDto,
  TransitGuidePaymentRequest,
  TransitGuideStatus,
} from "@/modules/idf/types";

const BASE = "idf/transit-guides";

interface RawGuide extends Omit<TransitGuideDto, "status"> {
  status: number;
}

const mapGuide = (raw: RawGuide): TransitGuideDto => ({ ...raw, status: toEnumName(TRANSIT_GUIDE_STATUS, raw.status) });

export interface TransitGuideListQuery extends PagedQuery {
  forestLotId?: string;
  forestLicenseId?: string;
  status?: TransitGuideStatus | "all";
}

export const listTransitGuides = async (query: TransitGuideListQuery = {}): Promise<PagedResult<TransitGuideDto>> => {
  const raw = await call<PagedResult<RawGuide>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ForestLotId: query.forestLotId,
        ForestLicenseId: query.forestLicenseId,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(TRANSIT_GUIDE_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapGuide) };
};

export const getTransitGuide = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.get(`${BASE}/${id}`)).then(mapGuide);

export const requestTransitGuide = (request: RequestTransitGuideRequest): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(BASE, request)).then(mapGuide);

export const submitTransitGuide = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/submit`)).then(mapGuide);

export const beginTransitGuideValidation = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/begin-validation`)).then(mapGuide);

export const markTransitGuidePendingPayment = (
  id: string,
  request: TransitGuidePaymentRequest,
): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/mark-pending-payment`, request)).then(mapGuide);

export const markTransitGuidePaid = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/mark-paid`)).then(mapGuide);

export const issueTransitGuide = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/issue`)).then(mapGuide);

export const beginTransit = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/begin-transit`)).then(mapGuide);

export const completeTransitGuide = (id: string): Promise<TransitGuideDto> =>
  call<RawGuide>(http.post(`${BASE}/${id}/complete`)).then(mapGuide);
