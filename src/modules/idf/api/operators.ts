import { call, cleanParams, http } from "@/modules/idf/api/http";
import { OPERATOR_STATUS, OPERATOR_TYPE, toEnumName, toEnumOrdinal } from "@/modules/idf/types/enums";
import type {
  ForestOperatorDto,
  OperatorStatus,
  OperatorType,
  PagedQuery,
  PagedResult,
  RegisterOperatorRequest,
} from "@/modules/idf/types";

const BASE = "idf/forest-operators";

interface RawOperator extends Omit<ForestOperatorDto, "type" | "status"> {
  type: number;
  status: number;
}

const mapOperator = (raw: RawOperator): ForestOperatorDto => ({
  ...raw,
  type: toEnumName(OPERATOR_TYPE, raw.type),
  status: toEnumName(OPERATOR_STATUS, raw.status),
});

export interface OperatorListQuery extends PagedQuery {
  legalName?: string;
  taxIdentificationNumber?: string;
  status?: OperatorStatus | "all";
  type?: OperatorType;
}

export const listOperators = async (query: OperatorListQuery = {}): Promise<PagedResult<ForestOperatorDto>> => {
  const raw = await call<PagedResult<RawOperator>>(
    http.get(BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        LegalName: query.legalName,
        TaxIdentificationNumber: query.taxIdentificationNumber,
        Status: query.status && query.status !== "all" ? toEnumOrdinal(OPERATOR_STATUS, query.status) : undefined,
        Type: query.type ? toEnumOrdinal(OPERATOR_TYPE, query.type) : undefined,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
  return { ...raw, items: raw.items.map(mapOperator) };
};

export const getOperator = (id: string): Promise<ForestOperatorDto> =>
  call<RawOperator>(http.get(`${BASE}/${id}`)).then(mapOperator);

export const createOperator = (request: RegisterOperatorRequest): Promise<ForestOperatorDto> =>
  call<RawOperator>(
    http.post(BASE, { ...request, type: toEnumOrdinal(OPERATOR_TYPE, request.type) }),
  ).then(mapOperator);

const transition = (id: string, action: string) =>
  call<RawOperator>(http.post(`${BASE}/${id}/${action}`)).then(mapOperator);

export const submitOperator = (id: string) => transition(id, "submit");
export const startTechnicalValidation = (id: string) => transition(id, "begin-technical-validation");
export const startLegalValidation = (id: string) => transition(id, "begin-legal-validation");
export const approveOperator = (id: string) => transition(id, "approve");
export const activateOperator = (id: string) => transition(id, "activate");
export const rejectOperator = (id: string) => transition(id, "reject");
export const suspendOperator = (id: string) => transition(id, "suspend");
export const cancelOperator = (id: string) => transition(id, "cancel");
