import { call, cleanParams, http } from "@/modules/idf/api/http";
import { EXPORT_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  CreateExportProcessRequest,
  ExportPaymentRequest,
  ExportProcessDto,
  ExportStatus,
  PagedQuery,
  PagedResult,
} from "@/modules/idf/types";

const BASE = "idf/export-processes";

interface RawExport extends Omit<ExportProcessDto, "status"> {
  status: number;
}

const mapExport = (raw: RawExport): ExportProcessDto => ({ ...raw, status: toEnumName(EXPORT_STATUS, raw.status) });

export interface ExportListQuery extends PagedQuery {
  forestLotId?: string;
  status?: ExportStatus | "all";
  destinationCountry?: string;
}

export const listExportProcesses = async (query: ExportListQuery = {}): Promise<PagedResult<ExportProcessDto>> => {
  const raw = await call<PagedResult<RawExport>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ForestLotId: query.forestLotId,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(EXPORT_STATUS, query.status) : undefined,
        DestinationCountry: query.destinationCountry,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapExport) };
};

export const getExportProcess = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.get(`${BASE}/${id}`)).then(mapExport);

export const createExportProcess = (request: CreateExportProcessRequest): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(BASE, request)).then(mapExport);

export const submitExportProcess = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/submit`)).then(mapExport);

export const beginExportDocumentValidation = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/begin-document-validation`)).then(mapExport);

export const markExportPendingPayment = (id: string, request: ExportPaymentRequest): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/mark-pending-payment`, request)).then(mapExport);

export const markExportPaid = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/mark-paid`)).then(mapExport);

export const authorizeExportProcess = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/authorize`)).then(mapExport);

export const dispatchExportProcess = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/dispatch`)).then(mapExport);

export const completeExportProcess = (id: string): Promise<ExportProcessDto> =>
  call<RawExport>(http.post(`${BASE}/${id}/complete`)).then(mapExport);
