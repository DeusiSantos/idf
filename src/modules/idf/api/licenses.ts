import { call, cleanParams, http } from "@/modules/idf/api/http";
import { FOREST_LICENSE_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  ForestLicenseDto,
  ForestLicenseStatus,
  MarkLicensePendingPaymentRequest,
  PagedQuery,
  PagedResult,
  RequestLicenseRequest,
} from "@/modules/idf/types";

const BASE = "idf/forest-licenses";

interface RawLicense extends Omit<ForestLicenseDto, "status"> {
  status: number;
}

const mapLicense = (raw: RawLicense): ForestLicenseDto => ({
  ...raw,
  status: toEnumName(FOREST_LICENSE_STATUS, raw.status),
});

export interface LicenseListQuery extends PagedQuery {
  concessionId?: string;
  operatorId?: string;
  status?: ForestLicenseStatus | "all";
}

export const listLicenses = async (query: LicenseListQuery = {}): Promise<PagedResult<ForestLicenseDto>> => {
  const raw = await call<PagedResult<RawLicense>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ConcessionId: query.concessionId,
        OperatorId: query.operatorId,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(FOREST_LICENSE_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapLicense) };
};

export const getLicense = (id: string): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.get(`${BASE}/${id}`)).then(mapLicense);

export const requestLicense = (request: RequestLicenseRequest): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(BASE, request)).then(mapLicense);

export const submitLicense = (id: string): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(`${BASE}/${id}/submit`)).then(mapLicense);

export const markLicensePendingPayment = (
  id: string,
  request: MarkLicensePendingPaymentRequest,
): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(`${BASE}/${id}/mark-pending-payment`, request)).then(mapLicense);

export const issueLicense = (id: string): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(`${BASE}/${id}/issue`)).then(mapLicense);

export const activateLicense = (id: string): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(`${BASE}/${id}/activate`)).then(mapLicense);

export const suspendLicense = (id: string): Promise<ForestLicenseDto> =>
  call<RawLicense>(http.post(`${BASE}/${id}/suspend`)).then(mapLicense);
