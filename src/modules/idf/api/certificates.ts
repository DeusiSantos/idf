import { call, cleanParams, http } from "@/modules/idf/api/http";
import { CERTIFICATE_STATUS, CERTIFICATE_TYPE, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  CertificatePaymentRequest,
  CertificateStatus,
  CertificateType,
  ForestCertificateDto,
  PagedQuery,
  PagedResult,
  RequestCertificateRequest,
} from "@/modules/idf/types";

const BASE = "idf/forest-certificates";

interface RawCertificate extends Omit<ForestCertificateDto, "certificateType" | "status"> {
  certificateType: number;
  status: number;
}

const mapCertificate = (raw: RawCertificate): ForestCertificateDto => ({
  ...raw,
  certificateType: toEnumName(CERTIFICATE_TYPE, raw.certificateType),
  status: toEnumName(CERTIFICATE_STATUS, raw.status),
});

export interface CertificateListQuery extends PagedQuery {
  certificateType?: CertificateType;
  status?: CertificateStatus | "all";
  forestLotId?: string;
  exportProcessId?: string;
}

export const listCertificates = async (
  query: CertificateListQuery = {},
): Promise<PagedResult<ForestCertificateDto>> => {
  const raw = await call<PagedResult<RawCertificate>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        CertificateType: query.certificateType ? toEnumOrdinal(CERTIFICATE_TYPE, query.certificateType) : undefined,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(CERTIFICATE_STATUS, query.status) : undefined,
        ForestLotId: query.forestLotId,
        ExportProcessId: query.exportProcessId,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapCertificate) };
};

export const getCertificate = (id: string): Promise<ForestCertificateDto> =>
  call<RawCertificate>(http.get(`${BASE}/${id}`)).then(mapCertificate);

export const requestCertificate = (request: RequestCertificateRequest): Promise<ForestCertificateDto> =>
  call<RawCertificate>(
    http.post(BASE, { ...request, certificateType: toEnumOrdinal(CERTIFICATE_TYPE, request.certificateType) }),
  ).then(mapCertificate);

export const beginCertificateValidation = (id: string): Promise<ForestCertificateDto> =>
  call<RawCertificate>(http.post(`${BASE}/${id}/begin-validation`)).then(mapCertificate);

export const markCertificatePendingPayment = (
  id: string,
  request: CertificatePaymentRequest,
): Promise<ForestCertificateDto> =>
  call<RawCertificate>(http.post(`${BASE}/${id}/mark-pending-payment`, request)).then(mapCertificate);

export const markCertificatePaid = (id: string): Promise<ForestCertificateDto> =>
  call<RawCertificate>(http.post(`${BASE}/${id}/mark-paid`)).then(mapCertificate);

export const issueCertificate = (id: string): Promise<ForestCertificateDto> =>
  call<RawCertificate>(http.post(`${BASE}/${id}/issue`)).then(mapCertificate);
