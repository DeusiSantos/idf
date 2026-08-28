import { call, cleanParams, http } from "@/modules/idf/api/http";
import { ENFORCEMENT_CASE_STATUS, VIOLATION_SEVERITY, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  EnforcementCaseDto,
  EnforcementCaseStatus,
  FineDto,
  IssueFineRequest,
  OpenEnforcementCaseRequest,
  PagedQuery,
  PagedResult,
  RegisterViolationRequest,
  ViolationDto,
} from "@/modules/idf/types";

const BASE = "idf/enforcement-cases";

interface RawViolation extends Omit<ViolationDto, "severity"> {
  severity: number;
}
interface RawCase extends Omit<EnforcementCaseDto, "status" | "violations"> {
  status: number;
  violations: RawViolation[];
  fines: FineDto[];
}

const mapCase = (raw: RawCase): EnforcementCaseDto => ({
  ...raw,
  status: toEnumName(ENFORCEMENT_CASE_STATUS, raw.status),
  violations: raw.violations.map((v) => ({ ...v, severity: toEnumName(VIOLATION_SEVERITY, v.severity) })),
});

export interface EnforcementListQuery extends PagedQuery {
  status?: EnforcementCaseStatus | "all";
  inspectionId?: string;
}

export const listEnforcementCases = async (
  query: EnforcementListQuery = {},
): Promise<PagedResult<EnforcementCaseDto>> => {
  const raw = await call<PagedResult<RawCase>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Status:
          query.status && query.status !== "all" ? toEnumOrdinal(ENFORCEMENT_CASE_STATUS, query.status) : undefined,
        InspectionId: query.inspectionId,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapCase) };
};

export const getEnforcementCase = (id: string): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.get(`${BASE}/${id}`)).then(mapCase);

export const openEnforcementCase = (request: OpenEnforcementCaseRequest): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.post(BASE, request)).then(mapCase);

export const registerViolation = (id: string, request: RegisterViolationRequest): Promise<EnforcementCaseDto> =>
  call<RawCase>(
    http.post(`${BASE}/${id}/violations`, { ...request, severity: toEnumOrdinal(VIOLATION_SEVERITY, request.severity) }),
  ).then(mapCase);

export const issueFine = (id: string, request: IssueFineRequest): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.post(`${BASE}/${id}/fines`, request)).then(mapCase);

export const markDecisionPending = (id: string): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.post(`${BASE}/${id}/mark-decision-pending`)).then(mapCase);

export const appealEnforcementCase = (id: string): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.post(`${BASE}/${id}/appeal`)).then(mapCase);

export const closeEnforcementCase = (id: string): Promise<EnforcementCaseDto> =>
  call<RawCase>(http.post(`${BASE}/${id}/close`)).then(mapCase);
