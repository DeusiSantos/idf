import { ApiError, type CoordinateDto } from "@/modules/idf/types";
import { newMockId } from "@/modules/idf/mock/store";
import { patchExtension, TECHNICAL_INSTRUMENT_KEYS, type ConcessionExtension } from "@/modules/idf/mock/concessionProcess";

/**
 * Tramitação de activação da Concessão — as 8 fases legais (A–H) que hoje estavam "achatadas" no
 * estado `UnderReview`. Guardadas em `ConcessionExtension.phases` (mock local, sem endpoint no
 * backend). `patchExtension` e o tipo `ConcessionExtension` vêm de `concessionProcess.ts` — este
 * ficheiro não é importado de lá (só via `import type`), para não criar dependência circular real.
 */

export const PHASE_CODES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export type PhaseCode = (typeof PHASE_CODES)[number];

export type PhaseStatus = "pendente" | "em_curso" | "concluida" | "bloqueada";

/** `null` quando a fonte não fixa prazo legal (D, H) — nunca inventar um (LAC-05). */
export type DeadlineUnit = "calendar" | "business" | null;

export interface PhaseDefinition {
  code: PhaseCode;
  name: string;
  legalDeadlineDays: number | null;
  deadlineUnit: DeadlineUnit;
}

/** Só B e E dizem "dias úteis" na fonte; F e G são dias corridos, como escrito. */
export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  { code: "A", name: "Submissão do requerimento", legalDeadlineDays: null, deadlineUnit: null },
  { code: "B", name: "Apreciação preliminar", legalDeadlineDays: 5, deadlineUnit: "business" },
  { code: "C", name: "Emolumentos e vistoria técnica", legalDeadlineDays: null, deadlineUnit: null },
  { code: "D", name: "Parecer provincial", legalDeadlineDays: null, deadlineUnit: null },
  { code: "E", name: "Análise conjunta IDF/DNF", legalDeadlineDays: 10, deadlineUnit: "business" },
  { code: "F", name: "Decisão ministerial", legalDeadlineDays: 10, deadlineUnit: "calendar" },
  { code: "G", name: "Negociação e instrumentos técnicos", legalDeadlineDays: 180, deadlineUnit: "calendar" },
  { code: "H", name: "Celebração, publicação, alvará e activação", legalDeadlineDays: null, deadlineUnit: null },
];

export interface PhaseState {
  code: PhaseCode;
  status: PhaseStatus;
  startedAt: string | null;
  endedAt: string | null;
  /** Forma solta de propósito — cada fase lê/escreve com a sua própria interface (`PhaseBData`, …). */
  data: Record<string, unknown>;
}

/* -------------------------------------------------------- Fase A · anexos (F-08) */

export const ATTACHMENT_KEYS = [
  "SocialPact",
  "TaxRegistrationProof",
  "LawSubjectionDeclaration",
  "BankCapacityDeclaration",
  "TaxComplianceCertificate",
  "Sketch",
  "DescriptiveMemory",
  "SpeciesProductsReport",
  "FeasibilityStudy",
] as const;
export type AttachmentKey = (typeof ATTACHMENT_KEYS)[number];

export const ATTACHMENT_LABELS: Record<AttachmentKey, string> = {
  SocialPact: "Pacto social",
  TaxRegistrationProof: "Comprovativo de registo fiscal",
  LawSubjectionDeclaration: "Declaração de sujeição às leis",
  BankCapacityDeclaration: "Declaração bancária de capacidade financeira",
  TaxComplianceCertificate: "Certidão de conformidade tributária",
  Sketch: "Croquis",
  DescriptiveMemory: "Memória descritiva",
  SpeciesProductsReport: "Relatório de espécies e produtos",
  FeasibilityStudy: "Estudo de viabilidade técnico-económica e financeira",
};

export const emptyAttachments = (): Record<AttachmentKey, string | null> =>
  Object.fromEntries(ATTACHMENT_KEYS.map((k) => [k, null])) as Record<AttachmentKey, string | null>;

/** Preenchidos na própria tela de tramitação (Fase A), nunca no formulário de "Nova concessão". */
export interface PhaseAData {
  attachments: Record<AttachmentKey, string | null>;
}
export const emptyPhaseAData = (): PhaseAData => ({ attachments: emptyAttachments() });

/* ------------------------------------------------------------- Fase B · apreciação preliminar */

export interface PhaseBData {
  landCadastreConsultationResult: boolean | null;
  landCadastreConsultationDetail: string;
  overlapDetected: boolean;
  overlapJustification: string;
  forestPotentialConfirmed: boolean | null;
  forestPotentialJustification: string;
  suitabilityAssessment: "Confirmed" | "NotConfirmed" | null;
}
export const emptyPhaseBData = (): PhaseBData => ({
  landCadastreConsultationResult: null,
  landCadastreConsultationDetail: "",
  overlapDetected: false,
  overlapJustification: "",
  forestPotentialConfirmed: null,
  forestPotentialJustification: "",
  suitabilityAssessment: null,
});

/* ------------------------------------------------------ Fase C · emolumentos e vistoria técnica */

export interface PhaseCData {
  travelSubsidyReceiptFileReference: string | null;
  surveyFeeReceiptFileReference: string | null;
  idfTechnician: string;
  igcaTechnician: string;
  overlapConclusion: string;
  volumetricCapacity: number;
  fieldCoordinates: CoordinateDto[];
}
export const emptyPhaseCData = (): PhaseCData => ({
  travelSubsidyReceiptFileReference: null,
  surveyFeeReceiptFileReference: null,
  idfTechnician: "",
  igcaTechnician: "",
  overlapConclusion: "",
  volumetricCapacity: 0,
  fieldCoordinates: [],
});

/* ------------------------------------------------------------------- Fase D · parecer provincial */

export interface PhaseDData {
  opinion: "Favorable" | "Unfavorable" | null;
  justification: string;
  signedBy: string;
  signedAt: string;
}
export const emptyPhaseDData = (): PhaseDData => ({ opinion: null, justification: "", signedBy: "", signedAt: "" });

/* ------------------------------------------------------------- Fase E · análise conjunta IDF/DNF */

export interface PhaseESpecialConditions {
  area: string;
  species: string;
  products: string;
  industrializationLevel: string;
}
export interface PhaseEData {
  decisionSense: "Approval" | "Rejection" | null;
  rejectionReasons: string;
  specialConditions: PhaseESpecialConditions;
  localRegionalImpact: "Positive" | "Negative" | null;
  impactDetail: string;
  idfSignedBy: string;
  dnfSignedBy: string;
}
export const emptyPhaseEData = (): PhaseEData => ({
  decisionSense: null,
  rejectionReasons: "",
  specialConditions: { area: "", species: "", products: "", industrializationLevel: "" },
  localRegionalImpact: null,
  impactDetail: "",
  idfSignedBy: "",
  dnfSignedBy: "",
});

/* ---------------------------------------------------------------------- Fase F · decisão ministerial */

export interface PhaseFAppeal {
  justification: string;
  fileReference: string | null;
  submittedAt: string;
}
export interface PhaseFData {
  decision: "Approved" | "Rejected" | null;
  communicatedAt: string;
  appeal: PhaseFAppeal | null;
}
export const emptyPhaseFData = (): PhaseFData => ({ decision: null, communicatedAt: "", appeal: null });

/* --------------------------------------------------- Fase G · negociação e instrumentos técnicos */

export const ARTICLE_167_CHARGE_KEYS = ["ExploitationFee", "Rent", "Deposit", "Bonus"] as const;
export type Article167ChargeKey = (typeof ARTICLE_167_CHARGE_KEYS)[number];
export const ARTICLE_167_CHARGE_LABELS: Record<Article167ChargeKey, string> = {
  ExploitationFee: "Taxa de exploração",
  Rent: "Renda",
  Deposit: "Caução",
  Bonus: "Bónus",
};
export interface Article167Charge {
  amount: number;
  paymentReceiptFileReference: string | null;
}
export const emptyCharges = (): Record<Article167ChargeKey, Article167Charge> =>
  Object.fromEntries(ARTICLE_167_CHARGE_KEYS.map((k) => [k, { amount: 0, paymentReceiptFileReference: null }])) as Record<
    Article167ChargeKey,
    Article167Charge
  >;

/* ------------------------------------------------- Fase H · celebração, publicação, alvará, activação */

export interface PhaseHData {
  contractSignedAt: string;
  publishedAt: string;
  contractFileReference1: string | null;
  contractFileReference2: string | null;
  landPlanFileReference: string | null;
  permitNumber: string | null;
  residentOfficerId: string | null;
  privateSwornStaff: string[];
}
export const emptyPhaseHData = (): PhaseHData => ({
  contractSignedAt: "",
  publishedAt: "",
  contractFileReference1: null,
  contractFileReference2: null,
  landPlanFileReference: null,
  permitNumber: null,
  residentOfficerId: null,
  privateSwornStaff: [],
});

/** ≤10.000 ha (área da PARCELA, nunca da Área-mãe) → Titular do Departamento Ministerial; acima → Titular do Poder Executivo. */
export const decisionCompetenceFor = (parcelAreaHectares: number): string =>
  parcelAreaHectares <= 10_000 ? "Titular do Departamento Ministerial" : "Titular do Poder Executivo";

const generatePermitNumber = () => `ALV-${new Date().getFullYear()}-${newMockId().slice(0, 6).toUpperCase()}`;

/* --------------------------------------------------------------------------------- Motor de fases */

/**
 * Fase A arranca `em_curso` logo que a concessão é criada — os 9 anexos (F-08) preenchem-se na
 * própria tela de tramitação, nunca no formulário de "Nova concessão". As restantes ficam
 * `pendente` até a Fase A ser concluída.
 */
export function buildInitialPhases(): PhaseState[] {
  const now = new Date().toISOString();
  return PHASE_DEFINITIONS.map((def) => {
    if (def.code === "A") return { code: def.code, status: "em_curso" as const, startedAt: now, endedAt: null, data: emptyPhaseAData() as unknown as Record<string, unknown> };
    return { code: def.code, status: "pendente" as const, startedAt: null, endedAt: null, data: {} };
  });
}

const fieldErrors = (errors: Record<string, string[]>) => new ApiError({ status: 422, title: "Dados inválidos", errors });

/**
 * Valida e conclui a fase `code`, avança a fase seguinte para `em_curso`. Excepção: Fase F com
 * `decision: "Rejected"` não avança — fica `bloqueada` a aguardar reclamação (`saveFAppeal`).
 */
export function computeNextPhases(extension: ConcessionExtension, code: PhaseCode, data: Record<string, unknown>): PhaseState[] {
  const index = extension.phases.findIndex((p) => p.code === code);
  if (index === -1) throw fieldErrors({ phase: ["Fase não encontrada."] });
  const current = extension.phases[index];
  const errors: Record<string, string[]> = {};

  switch (code) {
    case "A": {
      const d = data as unknown as PhaseAData;
      ATTACHMENT_KEYS.forEach((key) => {
        if (!d.attachments[key]) errors[`attachments.${key}`] = ["Obrigatório (F-08)."];
      });
      break;
    }
    case "B": {
      const d = data as unknown as PhaseBData;
      if (d.landCadastreConsultationResult === null) errors.landCadastreConsultationResult = ["Obrigatório."];
      if (d.overlapDetected && !d.overlapJustification.trim()) errors.overlapJustification = ["Obrigatória quando há sobreposição."];
      if (d.forestPotentialConfirmed === null) errors.forestPotentialConfirmed = ["Obrigatório."];
      if (!d.suitabilityAssessment) errors.suitabilityAssessment = ["Obrigatório."];
      break;
    }
    case "C": {
      const d = data as unknown as PhaseCData;
      if (!d.travelSubsidyReceiptFileReference) errors.travelSubsidyReceiptFileReference = ["Obrigatório."];
      if (!d.surveyFeeReceiptFileReference) errors.surveyFeeReceiptFileReference = ["Obrigatório."];
      if (!d.idfTechnician.trim()) errors.idfTechnician = ["Indique o técnico do IDF."];
      if (!d.igcaTechnician.trim()) errors.igcaTechnician = ["Indique o técnico do IGCA."];
      break;
    }
    case "D": {
      const d = data as unknown as PhaseDData;
      if (!d.opinion) errors.opinion = ["Obrigatório."];
      if (!d.justification.trim()) errors.justification = ["Obrigatória."];
      if (!d.signedBy.trim()) errors.signedBy = ["Obrigatório."];
      break;
    }
    case "E": {
      const d = data as unknown as PhaseEData;
      if (!d.decisionSense) errors.decisionSense = ["Obrigatório."];
      if (d.decisionSense === "Rejection" && !d.rejectionReasons.trim()) errors.rejectionReasons = ["Obrigatórias quando há indeferimento."];
      if (!d.localRegionalImpact) errors.localRegionalImpact = ["Obrigatório."];
      if (!d.idfSignedBy.trim()) errors.idfSignedBy = ["Assinatura do IDF obrigatória."];
      if (!d.dnfSignedBy.trim()) errors.dnfSignedBy = ["Assinatura da DNF obrigatória."];
      break;
    }
    case "F": {
      const d = data as unknown as PhaseFData;
      if (!d.decision) errors.decision = ["Obrigatório."];
      if (!d.communicatedAt) errors.communicatedAt = ["Obrigatória."];
      break;
    }
    case "G": {
      const instrumentsReady = TECHNICAL_INSTRUMENT_KEYS.every((k) => extension.instruments[k].status === "Approved");
      const chargesReady = ARTICLE_167_CHARGE_KEYS.every((k) => extension.charges[k].amount > 0 && extension.charges[k].paymentReceiptFileReference);
      if (!instrumentsReady) errors.instruments = ["Os 8 instrumentos técnicos têm de estar Aprovados."];
      if (!chargesReady) errors.charges = ["Os 4 encargos do Art. 167.º têm de estar liquidados (valor + comprovativo)."];
      break;
    }
    case "H": {
      const d = data as unknown as PhaseHData;
      if (!d.contractSignedAt) errors.contractSignedAt = ["Obrigatória."];
      if (!d.publishedAt) errors.publishedAt = ["Obrigatória."];
      if (!d.contractFileReference1) errors.contractFileReference1 = ["Obrigatório (1ª via)."];
      if (!d.contractFileReference2) errors.contractFileReference2 = ["Obrigatório (2ª via)."];
      if (!d.landPlanFileReference) errors.landPlanFileReference = ["Obrigatório."];
      if (!d.residentOfficerId) errors.residentOfficerId = ["Obrigatório."];
      break;
    }
  }
  if (Object.keys(errors).length > 0) throw fieldErrors(errors);

  const now = new Date().toISOString();
  const nextPhases = [...extension.phases];

  if (code === "F" && (data as unknown as PhaseFData).decision === "Rejected") {
    nextPhases[index] = { ...current, status: "bloqueada", data };
    return nextPhases;
  }

  const finalData = code === "H" ? { ...(data as unknown as PhaseHData), permitNumber: generatePermitNumber() } : data;
  nextPhases[index] = { ...current, status: "concluida", endedAt: now, data: finalData };

  const nextIndex = index + 1;
  if (nextIndex < nextPhases.length) nextPhases[nextIndex] = { ...nextPhases[nextIndex], status: "em_curso", startedAt: now };

  return nextPhases;
}

/** Reclamação sobre indeferimento da Fase F — reabre a fase (`em_curso`) para nova decisão. */
export function computePhasesAfterAppeal(extension: ConcessionExtension, appeal: PhaseFAppeal): PhaseState[] {
  const index = extension.phases.findIndex((p) => p.code === "F");
  const current = extension.phases[index];
  const nextPhases = [...extension.phases];
  nextPhases[index] = { ...current, status: "em_curso", data: { ...(current.data as unknown as PhaseFData), appeal } };
  return nextPhases;
}

export const saveCompletePhase = async (extension: ConcessionExtension, code: PhaseCode, data: Record<string, unknown>): Promise<ConcessionExtension> => {
  const phases = computeNextPhases(extension, code, data);
  const patch: Partial<ConcessionExtension> = { phases };
  // Fase H é quem designa formalmente o fiscal residente — passa a controlar o guard de "Activar".
  if (code === "H") patch.residentOfficerId = (data as unknown as PhaseHData).residentOfficerId;
  return patchExtension(extension.id, patch);
};

export const saveFAppeal = async (extension: ConcessionExtension, appeal: PhaseFAppeal): Promise<ConcessionExtension> =>
  patchExtension(extension.id, { phases: computePhasesAfterAppeal(extension, appeal) });
