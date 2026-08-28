import { call, cleanParams, http } from "@/modules/idf/api/http";
import {
  FINDING_SEVERITY,
  INSPECTION_STATUS,
  TARGET_ENTITY_TYPE,
  toEnumName,
  toEnumOrdinal,
} from "@/modules/idf/types/enums";
import type {
  AddInspectionFindingRequest,
  InspectionDto,
  InspectionFindingDto,
  InspectionStatus,
  PagedQuery,
  PagedResult,
  ScheduleInspectionRequest,
  TargetEntityType,
} from "@/modules/idf/types";

const BASE = "idf/inspections";

interface RawFinding extends Omit<InspectionFindingDto, "severity"> {
  severity: number;
}
interface RawInspection extends Omit<InspectionDto, "status" | "targetEntityType" | "findings"> {
  status: number;
  targetEntityType: number;
  findings: RawFinding[];
}

const mapInspection = (raw: RawInspection): InspectionDto => ({
  ...raw,
  status: toEnumName(INSPECTION_STATUS, raw.status),
  targetEntityType: toEnumName(TARGET_ENTITY_TYPE, raw.targetEntityType),
  findings: raw.findings.map((f) => ({ ...f, severity: toEnumName(FINDING_SEVERITY, f.severity) })),
});

export interface InspectionListQuery extends PagedQuery {
  status?: InspectionStatus | "all";
  targetEntityType?: TargetEntityType;
  targetEntityId?: string;
}

export const listInspections = async (query: InspectionListQuery = {}): Promise<PagedResult<InspectionDto>> => {
  const raw = await call<PagedResult<RawInspection>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(INSPECTION_STATUS, query.status) : undefined,
        TargetEntityType: query.targetEntityType ? toEnumOrdinal(TARGET_ENTITY_TYPE, query.targetEntityType) : undefined,
        TargetEntityId: query.targetEntityId,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapInspection) };
};

export const getInspection = (id: string): Promise<InspectionDto> =>
  call<RawInspection>(http.get(`${BASE}/${id}`)).then(mapInspection);

export const scheduleInspection = (request: ScheduleInspectionRequest): Promise<InspectionDto> =>
  call<RawInspection>(
    http.post(BASE, { ...request, targetEntityType: toEnumOrdinal(TARGET_ENTITY_TYPE, request.targetEntityType) }),
  ).then(mapInspection);

export const startInspection = (id: string): Promise<InspectionDto> =>
  call<RawInspection>(http.post(`${BASE}/${id}/start`)).then(mapInspection);

export const addInspectionFinding = (id: string, request: AddInspectionFindingRequest): Promise<InspectionDto> =>
  call<RawInspection>(
    http.post(`${BASE}/${id}/findings`, { ...request, severity: toEnumOrdinal(FINDING_SEVERITY, request.severity) }),
  ).then(mapInspection);

export const completeInspection = (id: string): Promise<InspectionDto> =>
  call<RawInspection>(http.post(`${BASE}/${id}/complete`)).then(mapInspection);
