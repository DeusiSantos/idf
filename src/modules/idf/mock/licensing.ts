import { ApiError, type PagedResult } from "@/modules/idf/types";
import type { PickerOption } from "@/components/idf/EntityPicker";
import { createMockStore, newMockId, type MockStore } from "@/modules/idf/mock/store";
import { hashPolygon } from "@/lib/geoPolygon";
import type {
  BeekeepingLicenseDto,
  CreateBeekeepingLicenseRequest,
  CreateExploitationLicenseRequest,
  CreateFaunaLicenseRequest,
  CreateFirewoodLicenseRequest,
  ExploitationLicenseDto,
  FaunaLicenseDto,
  FirewoodLicenseDto,
  LicensingBaseFields,
  LicensingCampaignSettings,
} from "@/modules/idf/types/licensing";

/**
 * Licenciamento standalone — mock local (sem endpoint no backend). 4 stores, uma máquina de
 * estados partilhada (`createLicensingWorkflow`) e os seeds auxiliares pedidos por aba.
 */

const CAMPAIGN_SETTINGS_KEY = "idf.mock.licensing.campaignSettings";

export const getCampaignSettings = (): LicensingCampaignSettings => {
  try {
    const raw = window.localStorage.getItem(CAMPAIGN_SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as LicensingCampaignSettings) : { extensionEnabled: false, extensionDays: 90 };
  } catch {
    return { extensionEnabled: false, extensionDays: 90 };
  }
};

export const setCampaignSettings = (settings: LicensingCampaignSettings): void => {
  try {
    window.localStorage.setItem(CAMPAIGN_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // localStorage indisponível — fica só em memória nesta sessão
  }
};

const newVerificationCode = () => newMockId().slice(0, 8).toUpperCase();

/** Máquina de estados partilhada pelas 4 abas (submissão → verificação → pagamento → emissão → activação). */
export function createLicensingWorkflow<T extends LicensingBaseFields>(store: MockStore<T>) {
  const transition = (id: string, patch: Partial<T>) => store.update(id, patch);
  return {
    submit: (id: string) => transition(id, { status: "Submitted" } as Partial<T>),
    verify: (id: string) => transition(id, { status: "PrecheckVerification" } as Partial<T>),
    markPendingPayment: (id: string, feeAmount: number) => transition(id, { status: "PendingPayment", feeAmount } as Partial<T>),
    confirmPayment: (id: string) => transition(id, { paymentConfirmed: true } as Partial<T>),
    // Nunca permite emissão sem pagamento confirmado (aviso comum às 4 abas).
    issue: async (id: string) => {
      const item = await store.get(id);
      if (!item.paymentConfirmed) {
        throw new ApiError({ status: 422, detail: "Pagamento ainda não confirmado — não é possível emitir." });
      }
      return transition(id, { status: "Issued", verificationCode: newVerificationCode() } as Partial<T>);
    },
    activate: (id: string) => transition(id, { status: "Active" } as Partial<T>),
  };
}

const baseFields = (): LicensingBaseFields => ({
  id: newMockId(),
  createdAt: new Date().toISOString(),
  status: "Draft",
  feeAmount: null,
  paymentConfirmed: false,
  verificationCode: null,
});

export interface LicensingListQuery {
  page?: number;
  pageSize?: number;
  status?: string;
}

/* --------------------------------------------------------- Aba 1 · Exploração Florestal (PR-10) */

const exploitationStore = createMockStore<ExploitationLicenseDto>("idf.mock.licensing.exploitation");
export const exploitationWorkflow = createLicensingWorkflow(exploitationStore);

export const listExploitationLicenses = (query: LicensingListQuery = {}): Promise<PagedResult<ExploitationLicenseDto>> =>
  exploitationStore.list({ page: query.page, pageSize: query.pageSize, filter: (i) => !query.status || query.status === "all" || i.status === query.status });
export const getExploitationLicense = (id: string) => exploitationStore.get(id);
export const createExploitationLicense = (request: CreateExploitationLicenseRequest): Promise<ExploitationLicenseDto> => {
  if (!request.areaId) throw new ApiError({ status: 422, errors: { areaId: ["Seleccione uma área elegível."] } });
  const errors: Record<string, string[]> = {};
  request.lines.forEach((line, index) => {
    const balance = getQuotaBalance(line.speciesCode, request.province, request.campaignYear);
    if (line.volume > balance) errors[`lines.${index}.volume`] = [`Volume acima do saldo de quota (${balance} m³).`];
    if (line.treeCount > line.cuttingLimit) errors[`lines.${index}.treeCount`] = ["Nº de árvores acima do limite de abate."];
  });
  if (Object.keys(errors).length > 0) throw new ApiError({ status: 422, errors });
  return exploitationStore.create({ ...baseFields(), ...request });
};

export const hashString = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(hash);
};

/** Saldo de quota por espécie/província/ano — mock determinístico (sem ligação real à Quota). */
export const getQuotaBalance = (speciesCode: string, province: string, year: number): number =>
  50 + (hashString(`${speciesCode}|${province}|${year}`) % 450);

/* ---------------------------------------------------- Aba 2 · Lenha, Carvão e PFNL (PR-11) */

const firewoodStore = createMockStore<FirewoodLicenseDto>("idf.mock.licensing.firewood");
export const firewoodWorkflow = createLicensingWorkflow(firewoodStore);

export const listFirewoodLicenses = (query: LicensingListQuery = {}): Promise<PagedResult<FirewoodLicenseDto>> =>
  firewoodStore.list({ page: query.page, pageSize: query.pageSize, filter: (i) => !query.status || query.status === "all" || i.status === query.status });
export const getFirewoodLicense = (id: string) => firewoodStore.get(id);
export const createFirewoodLicense = (request: CreateFirewoodLicenseRequest): Promise<FirewoodLicenseDto> =>
  firewoodStore.create({ ...baseFields(), ...request });

/** Unidades de carbonização + coeficiente de conversão lenha→carvão — seed fixa de protótipo. */
export const CARBONIZATION_UNITS: { id: string; label: string; coefficient: number }[] = [
  { id: "traditional-kiln", label: "Forno tradicional (covacho)", coefficient: 0.15 },
  { id: "improved-kiln", label: "Forno melhorado (meia-laranja)", coefficient: 0.22 },
  { id: "industrial-kiln", label: "Forno industrial metálico", coefficient: 0.3 },
];
export const loadCarbonizationUnits = async (): Promise<PickerOption[]> =>
  CARBONIZATION_UNITS.map((u) => ({ value: u.id, label: u.label, hint: `coef. ${u.coefficient}` }));
export const getCarbonizationCoefficient = (unitId: string | null): number | null =>
  CARBONIZATION_UNITS.find((u) => u.id === unitId)?.coefficient ?? null;

/** Saldo de quota específica da rubrica (produto) — mock determinístico. */
export const getRubricQuotaBalance = (product: string): number => 20 + (hashString(product) % 180);

export const loadClosedFirewoodLots = async (): Promise<PickerOption[]> => {
  const { items } = await firewoodStore.list({ pageSize: 200, filter: (i) => i.product === "Firewood" && i.status !== "Draft" });
  return items.map((i) => ({ value: i.id, label: `Lote ${i.id.slice(0, 8)}`, hint: `${i.quantity} ${i.unit}` }));
};

/* ----------------------------------------------------------- Aba 3 · Recursos Faunísticos (PR-12) */

const faunaStore = createMockStore<FaunaLicenseDto>("idf.mock.licensing.fauna");
export const faunaWorkflow = createLicensingWorkflow(faunaStore);

export const listFaunaLicenses = (query: LicensingListQuery = {}): Promise<PagedResult<FaunaLicenseDto>> =>
  faunaStore.list({ page: query.page, pageSize: query.pageSize, filter: (i) => !query.status || query.status === "all" || i.status === query.status });
export const getFaunaLicense = (id: string) => faunaStore.get(id);
export const createFaunaLicense = (request: CreateFaunaLicenseRequest): Promise<FaunaLicenseDto> => {
  const rule = getFaunaSpeciesRule(request.speciesCode);
  if (rule?.status === "Prohibited") throw new ApiError({ status: 422, errors: { speciesCode: ["Espécie proibida — não pode ser licenciada."] } });
  if (rule && isWithinClosedSeason(rule, request.periodStart, request.periodEnd)) {
    throw new ApiError({
      status: 422,
      errors: { periodStart: [`Período dentro da época de defeso da espécie (${rule.closedSeasonStart} a ${rule.closedSeasonEnd}).`] },
    });
  }
  return faunaStore.create({ ...baseFields(), ...request, supervenientRevocationStatus: "None" });
};
export const setFaunaRevocationStatus = (id: string, supervenientRevocationStatus: FaunaLicenseDto["supervenientRevocationStatus"]) =>
  faunaStore.update(id, { supervenientRevocationStatus });

/** Estado + época de defeso por espécie — seed fixa de protótipo (sem ligação real ao cadastro de espécies). */
export interface FaunaSpeciesRule {
  code: string;
  name: string;
  status: "Prohibited" | "Conditional" | "Free";
  closedSeasonStart: string; // "MM-DD"
  closedSeasonEnd: string; // "MM-DD"
}
export const FAUNA_SPECIES: FaunaSpeciesRule[] = [
  { code: "PANT-PARDUS", name: "Leopardo", status: "Prohibited", closedSeasonStart: "01-01", closedSeasonEnd: "12-31" },
  { code: "LOXO-AFRICANA", name: "Elefante-africano", status: "Prohibited", closedSeasonStart: "01-01", closedSeasonEnd: "12-31" },
  { code: "SYNC-CAFFER", name: "Búfalo-africano", status: "Conditional", closedSeasonStart: "10-01", closedSeasonEnd: "02-28" },
  { code: "PHAC-AFRICANUS", name: "Javali-africano", status: "Conditional", closedSeasonStart: "11-01", closedSeasonEnd: "01-31" },
  { code: "NUMI-MELEAGRIS", name: "Galinha-d'angola", status: "Free", closedSeasonStart: "12-01", closedSeasonEnd: "01-31" },
];
export const getFaunaSpeciesRule = (code: string) => FAUNA_SPECIES.find((s) => s.code === code);
export const loadFaunaSpecies = async (): Promise<PickerOption[]> =>
  FAUNA_SPECIES.map((s) => ({ value: s.code, label: s.name, hint: s.status === "Prohibited" ? "Proibida" : s.status === "Conditional" ? "Condicionada" : "Livre" }));

const inClosedRange = (date: Date, startMD: string, endMD: string) => {
  const [sm, sd] = startMD.split("-").map(Number);
  const [em, ed] = endMD.split("-").map(Number);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const val = m * 100 + d;
  const start = sm * 100 + sd;
  const end = em * 100 + ed;
  return start <= end ? val >= start && val <= end : val >= start || val <= end; // época que atravessa o fim do ano
};

export const isWithinClosedSeason = (rule: FaunaSpeciesRule, periodStart: string, periodEnd: string): boolean => {
  if (!periodStart || !periodEnd) return false;
  return inClosedRange(new Date(periodStart), rule.closedSeasonStart, rule.closedSeasonEnd) || inClosedRange(new Date(periodEnd), rule.closedSeasonStart, rule.closedSeasonEnd);
};

/** Sobreposição com área de conservação ambiental — mock determinístico a partir do polígono (mesmo princípio do Registo de Área). */
export const checkFaunaAreaOverlap = (boundary: { latitude: number; longitude: number }[]): boolean =>
  boundary.length >= 3 && hashPolygon(boundary) % 100 < 20;

/* --------------------------------------------------------------------- Aba 4 · Apicultura (PR-13) */

const beekeepingStore = createMockStore<BeekeepingLicenseDto>("idf.mock.licensing.beekeeping");
export const beekeepingWorkflow = createLicensingWorkflow(beekeepingStore);

export const listBeekeepingLicenses = (query: LicensingListQuery = {}): Promise<PagedResult<BeekeepingLicenseDto>> =>
  beekeepingStore.list({ page: query.page, pageSize: query.pageSize, filter: (i) => !query.status || query.status === "all" || i.status === query.status });
export const getBeekeepingLicense = (id: string) => beekeepingStore.get(id);
export const createBeekeepingLicense = (request: CreateBeekeepingLicenseRequest): Promise<BeekeepingLicenseDto> => {
  if (request.landRegime === "GrantedArea" && !request.concessionAuthorizationFileReference) {
    throw new ApiError({ status: 422, errors: { concessionAuthorizationFileReference: ["Obrigatório quando o regime é Área concedida."] } });
  }
  const year = new Date().getFullYear();
  const sequence = beekeepingStore.all().length + 1;
  return beekeepingStore.create({
    ...baseFields(),
    ...request,
    apiaryRegistrationNumber: `API-${year}-${String(sequence).padStart(3, "0")}`,
  });
};
