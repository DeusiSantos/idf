import { createMockStore } from "@/modules/idf/mock/store";
import { getConcession } from "@/modules/idf/api/concessions";
import type { CoordinateDto } from "@/modules/idf/types";
import type { Article167Charge, Article167ChargeKey, PhaseState } from "@/modules/idf/mock/concessionPhases";

/**
 * Extensão de processo da Concessão — mock local, "companion record" por `concessionId`, à parte
 * do `ConcessionDto` base (`api/concessions.ts`, também mock — decisão do utilizador, para testar
 * a tramitação sem depender de um backend disponível). Guarda n.º de processo, via de atribuição,
 * a parcela recortada da Área-mãe (ver `api/areas.ts`), a tramitação em 8 fases
 * (`concessionPhases.ts`) e os instrumentos técnicos da Fase G.
 *
 * Só importa tipos de `concessionPhases.ts` (`import type`, apagado em build) — quem importa
 * valores de lá é esse ficheiro a partir daqui (`patchExtension`), nunca o inverso, para não
 * haver dependência circular real.
 */

export type AcquisitionMethod = "SimplifiedContracting" | "PublicTender";

export const ACQUISITION_METHODS: { value: AcquisitionMethod; label: string }[] = [
  { value: "SimplifiedContracting", label: "Contratação simplificada" },
  { value: "PublicTender", label: "Concurso público" },
];

export const TECHNICAL_INSTRUMENT_KEYS = [
  "ManagementPlan",
  "ExploitationInventory",
  "ExploitationPlan",
  "BlockZoning",
  "TrailsAndYardPlan",
  "ReplantingPlan",
  "SocialAddendum",
  "EnvironmentalLicense",
] as const;
export type TechnicalInstrumentKey = (typeof TECHNICAL_INSTRUMENT_KEYS)[number];

export const TECHNICAL_INSTRUMENT_LABELS: Record<TechnicalInstrumentKey, string> = {
  ManagementPlan: "Plano de gestão",
  ExploitationInventory: "Inventário de exploração",
  ExploitationPlan: "Plano de exploração",
  BlockZoning: "Zoneamento em blocos",
  TrailsAndYardPlan: "Plano de picadas/parque",
  ReplantingPlan: "Plano de povoamento/repovoamento",
  SocialAddendum: "Adenda social",
  EnvironmentalLicense: "Licença ambiental",
};

export type TechnicalInstrumentStatus = "Missing" | "Submitted" | "Approved";

export interface TechnicalInstrumentState {
  status: TechnicalInstrumentStatus;
  fileReference: string | null;
}

export interface ConcessionExtension {
  id: string; // === concessionId
  processNumber: string;
  acquisitionMethod: AcquisitionMethod;
  province: string;
  year: number;
  // Parte 1 — a concessão é sempre uma parcela recortada dentro do polígono da Área-mãe.
  parentAreaId: string;
  parcelBoundary: CoordinateDto[];
  parcelAreaHectares: number;
  // Parte 2 — tramitação em 8 fases (A–H), ver concessionPhases.ts. Os anexos da Fase A vivem em
  // `phases[0].data` (preenchidos na própria tela de tramitação, nunca no cadastro).
  phases: PhaseState[];
  instruments: Record<TechnicalInstrumentKey, TechnicalInstrumentState>;
  charges: Record<Article167ChargeKey, Article167Charge>;
  /** Designado formalmente na Fase H — controla o guard de "Activar" (substitui o antigo toggle mock). */
  residentOfficerId: string | null;
}

const store = createMockStore<ConcessionExtension>("idf.mock.concessionExtensions");

/** `CON-{CS|CP}-{ano}-{sequência 3 dígitos por província}` — sequência conta só dentro da mesma província+ano. */
function generateProcessNumber(method: AcquisitionMethod, province: string, year: number): string {
  const prefix = method === "SimplifiedContracting" ? "CS" : "CP";
  const sequence = store.all().filter((e) => e.province === province && e.year === year).length + 1;
  return `CON-${prefix}-${year}-${String(sequence).padStart(3, "0")}`;
}

const emptyInstruments = (): Record<TechnicalInstrumentKey, TechnicalInstrumentState> =>
  Object.fromEntries(TECHNICAL_INSTRUMENT_KEYS.map((key) => [key, { status: "Missing", fileReference: null }])) as Record<
    TechnicalInstrumentKey,
    TechnicalInstrumentState
  >;

export interface CreateExtensionInput {
  concessionId: string;
  method: AcquisitionMethod;
  province: string;
  parentAreaId: string;
  parcelBoundary: CoordinateDto[];
  parcelAreaHectares: number;
  phases: PhaseState[];
  charges: Record<Article167ChargeKey, Article167Charge>;
}

export const createExtension = (input: CreateExtensionInput): Promise<ConcessionExtension> => {
  const year = new Date().getFullYear();
  return store.create({
    id: input.concessionId,
    processNumber: generateProcessNumber(input.method, input.province, year),
    acquisitionMethod: input.method,
    province: input.province,
    year,
    parentAreaId: input.parentAreaId,
    parcelBoundary: input.parcelBoundary,
    parcelAreaHectares: input.parcelAreaHectares,
    phases: input.phases,
    instruments: emptyInstruments(),
    charges: input.charges,
    residentOfficerId: null,
  });
};

/** Nunca lança — concessões criadas antes desta funcionalidade (ou pelo backend directamente) não têm extensão. */
export const getExtension = (concessionId: string): Promise<ConcessionExtension | null> =>
  store.get(concessionId).catch(() => null);

/** Actualização genérica — usada pela Fase G (instrumentos/encargos) e por `concessionPhases.ts` (fases). */
export const patchExtension = (concessionId: string, patch: Partial<ConcessionExtension>): Promise<ConcessionExtension> =>
  store.update(concessionId, patch);

export const setInstrumentFile = (
  concessionId: string,
  key: TechnicalInstrumentKey,
  fileReference: string | null,
  instruments: Record<TechnicalInstrumentKey, TechnicalInstrumentState>,
): Promise<ConcessionExtension> =>
  store.update(concessionId, {
    instruments: { ...instruments, [key]: { status: fileReference ? "Submitted" : "Missing", fileReference } },
  });

export const setCharge = (
  concessionId: string,
  key: Article167ChargeKey,
  charge: Article167Charge,
  charges: Record<Article167ChargeKey, Article167Charge>,
): Promise<ConcessionExtension> => store.update(concessionId, { charges: { ...charges, [key]: charge } });

/* -------------------------------------------------------------- Parte 1 — Área↔Concessão */

/** Todas as extensões recortadas da Área `areaId` — leitura síncrona local (sem paginação). */
export const getExtensionsByArea = (areaId: string): ConcessionExtension[] => store.all().filter((e) => e.parentAreaId === areaId);

export interface AreaCommitmentItem {
  concessionId: string;
  parcelAreaHectares: number;
  parcelBoundary: CoordinateDto[];
  status: string;
  code: string;
}

/**
 * Soma das parcelas já comprometidas (concessões não Rejeitadas/Canceladas) recortadas da Área
 * `areaId`, cruzando a extensão mock com o estado real da concessão (`getConcession`) — mesmo
 * princípio de `RelatedEntityCard` (nunca confiar em cache local para o estado).
 */
export const getAreaCommitment = async (
  areaId: string,
  excludeConcessionId?: string,
): Promise<{ committedHectares: number; items: AreaCommitmentItem[] }> => {
  const extensions = getExtensionsByArea(areaId).filter((e) => e.id !== excludeConcessionId);
  const items = await Promise.all(
    extensions.map(async (e) => {
      const concession = await getConcession(e.id).catch(() => null);
      return concession
        ? { concessionId: e.id, parcelAreaHectares: e.parcelAreaHectares, parcelBoundary: e.parcelBoundary, status: concession.status, code: concession.code }
        : null;
    }),
  );
  const live = items.filter((i): i is AreaCommitmentItem => i !== null && i.status !== "Rejected" && i.status !== "Cancelled");
  return { committedHectares: live.reduce((sum, i) => sum + i.parcelAreaHectares, 0), items: live };
};
