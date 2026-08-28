import { call, cleanParams, http } from "@/modules/idf/api/http";
import { MANAGEMENT_PLAN_STATUS, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  AddCuttingSelectionRequest,
  CreateManagementPlanRequest,
  ManagementPlanDto,
  ManagementPlanStatus,
  PagedQuery,
  PagedResult,
} from "@/modules/idf/types";

const BASE = "idf/management-plans";

interface RawPlan extends Omit<ManagementPlanDto, "status"> {
  status: number;
}

const mapPlan = (raw: RawPlan): ManagementPlanDto => ({ ...raw, status: toEnumName(MANAGEMENT_PLAN_STATUS, raw.status) });

export interface ManagementPlanListQuery extends PagedQuery {
  concessionId?: string;
  forestInventoryId?: string;
  status?: ManagementPlanStatus | "all";
}

export const listManagementPlans = async (
  query: ManagementPlanListQuery = {},
): Promise<PagedResult<ManagementPlanDto>> => {
  const raw = await call<PagedResult<RawPlan>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        ConcessionId: query.concessionId,
        ForestInventoryId: query.forestInventoryId,
        Status:
          query.status && query.status !== "all" ? toEnumOrdinal(MANAGEMENT_PLAN_STATUS, query.status) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapPlan) };
};

export const getManagementPlan = (id: string): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.get(`${BASE}/${id}`)).then(mapPlan);

export const createManagementPlan = (request: CreateManagementPlanRequest): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.post(BASE, request)).then(mapPlan);

export const addCuttingSelection = (planId: string, request: AddCuttingSelectionRequest): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.post(`${BASE}/${planId}/cutting-selection`, request)).then(mapPlan);

export const submitManagementPlan = (id: string): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.post(`${BASE}/${id}/submit`)).then(mapPlan);

export const beginTechnicalReview = (id: string): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.post(`${BASE}/${id}/begin-technical-review`)).then(mapPlan);

export const approveManagementPlan = (id: string): Promise<ManagementPlanDto> =>
  call<RawPlan>(http.post(`${BASE}/${id}/approve`)).then(mapPlan);
