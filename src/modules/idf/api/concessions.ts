import { createMockStore, newMockId } from "@/modules/idf/mock/store";
import { ApiError } from "@/modules/idf/types";
import type { ConcessionDto, ConcessionStatus, ConcessionType, CreateConcessionRequest, PagedQuery, PagedResult } from "@/modules/idf/types";

/**
 * Concessões — mock local (sem chamadas à API real), para poder testar a tramitação completa
 * (fases A–H, `concessionPhases.ts`) sem depender de um backend disponível. Decisão do
 * utilizador: substitui a versão anterior ligada à API real (`POST idf/concessions`, etc.).
 * Mesma forma de um `api/*.ts` real — `list*`/`get*`/`create*`/transições devolvem `Promise`,
 * `PagedResult`, erros `ApiError` — para `ResourceWorkspace`/`EntityPicker`/`WorkflowActions`/
 * `useWorkflow` e todo o resto do código (que importa por nome desta ficheiro) continuarem a
 * funcionar sem nenhuma alteração.
 */

const store = createMockStore<ConcessionDto>("idf.mock.concessions");

export interface ConcessionListQuery extends PagedQuery {
  forestOperatorId?: string;
  code?: string;
  status?: ConcessionStatus | "all";
  type?: ConcessionType;
}

export const listConcessions = (query: ConcessionListQuery = {}): Promise<PagedResult<ConcessionDto>> =>
  store.list({
    page: query.page,
    pageSize: query.pageSize,
    filter: (item) =>
      (!query.forestOperatorId || item.forestOperatorId === query.forestOperatorId) &&
      (!query.code || item.code.toLowerCase().includes(query.code.toLowerCase())) &&
      (!query.status || query.status === "all" || item.status === query.status) &&
      (!query.type || item.type === query.type),
  });

export const getConcession = (id: string): Promise<ConcessionDto> => store.get(id);

/** `CON-{ano}-{sequência 3 dígitos}` — sequência conta globalmente por ano (código simples, distinto do processo — ver `concessionProcess.ts`). */
function generateCode(year: number): string {
  const sequence = store.all().filter((c) => c.code.startsWith(`CON-${year}-`)).length + 1;
  return `CON-${year}-${String(sequence).padStart(3, "0")}`;
}

export const createConcession = (request: CreateConcessionRequest): Promise<ConcessionDto> => {
  const errors: Record<string, string[]> = {};
  if (!request.forestOperatorId) errors.forestOperatorId = ["Seleccione o operador florestal."];
  if (!request.validityPeriod.startDate) errors["validityPeriod.startDate"] = ["Obrigatória."];
  if (!request.validityPeriod.endDate) errors["validityPeriod.endDate"] = ["Obrigatória."];
  if (!request.areaHectares || request.areaHectares <= 0) errors.areaHectares = ["Área tem de ser maior que zero."];
  if (Object.keys(errors).length > 0) throw new ApiError({ status: 422, title: "Dados inválidos", errors });

  const now = new Date().toISOString();
  const concession: ConcessionDto = {
    id: newMockId(),
    forestOperatorId: request.forestOperatorId,
    code: generateCode(new Date().getFullYear()),
    type: request.type,
    status: "Draft",
    validityPeriod: request.validityPeriod,
    areaHectares: request.areaHectares,
    boundary: request.boundary,
    location: request.location,
    createdAt: now,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
    isDeleted: false,
    isActive: true,
    deletedAt: null,
    deletedBy: null,
  };
  return store.create(concession);
};

const ALLOWED_TRANSITIONS = {
  submit: { from: ["Draft"] as ConcessionStatus[], to: "Submitted" as ConcessionStatus },
  "begin-review": { from: ["Submitted"] as ConcessionStatus[], to: "UnderReview" as ConcessionStatus },
  approve: { from: ["Submitted", "UnderReview"] as ConcessionStatus[], to: "Approved" as ConcessionStatus },
  activate: { from: ["Approved"] as ConcessionStatus[], to: "Active" as ConcessionStatus },
};

const transition = async (id: string, action: keyof typeof ALLOWED_TRANSITIONS): Promise<ConcessionDto> => {
  const current = await store.get(id);
  const rule = ALLOWED_TRANSITIONS[action];
  if (!rule.from.includes(current.status)) {
    throw new ApiError({ status: 422, detail: `Transição inválida — a concessão está em "${current.status}".` });
  }
  return store.update(id, { status: rule.to, updatedAt: new Date().toISOString() });
};

export const submitConcession = (id: string) => transition(id, "submit");
export const beginConcessionReview = (id: string) => transition(id, "begin-review");
export const approveConcession = (id: string) => transition(id, "approve");
export const activateConcession = (id: string) => transition(id, "activate");
