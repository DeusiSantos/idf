import type { CoordinateDto } from "@/modules/idf/types";

/**
 * Licenciamento standalone (secção 3 do prompt) — módulo genuinely novo, mock local, sem
 * concessão prévia. Diferente do módulo "Licenças" real (`api/licenses.ts`), que é a Licença Anual
 * de Corte ligada a concessão+quota.
 */

/**
 * Sequência proposta para implementação — a especificação SIGAFLO/DRF-02 não define máquina de
 * estados granular para o Licenciamento, ao contrário da Concessão (EST-01). Confirmar com o IDF
 * antes de considerar definitiva.
 */
export const LICENSING_STATUSES = [
  "Draft",
  "Submitted",
  "PrecheckVerification",
  "PendingPayment",
  "Issued",
  "Active",
  "Expired",
] as const;
export type LicensingStatus = (typeof LICENSING_STATUSES)[number];

export interface LicensingCampaignSettings {
  extensionEnabled: boolean;
  extensionDays: number;
}

/** Campos comuns às 4 abas — máquina de estados + pagamento + código de verificação. */
export interface LicensingBaseFields {
  id: string;
  createdAt: string;
  status: LicensingStatus;
  feeAmount: number | null;
  paymentConfirmed: boolean;
  verificationCode: string | null;
}

/* --------------------------------------------------------- Aba 1 · Exploração Florestal (PR-10) */

export interface ExploitationSpeciesLine {
  speciesCode: string;
  volume: number;
  treeCount: number;
  cuttingLimit: number;
}

export type ExploitationDestination = "DomesticMarket" | "OwnProcessing" | "ThirdPartyProcessing";

export interface ExploitationLicenseDto extends LicensingBaseFields {
  operatorId: string;
  campaignYear: number;
  province: string;
  areaId: string;
  lines: ExploitationSpeciesLine[];
  destination: ExploitationDestination;
  processingUnitId: string | null;
}

export type CreateExploitationLicenseRequest = Omit<ExploitationLicenseDto, keyof LicensingBaseFields>;

/* ---------------------------------------------------- Aba 2 · Lenha, Carvão e PFNL (PR-11) */

export type FirewoodProduct = "Firewood" | "Charcoal" | "WildHoney" | "Resin" | "Fiber" | "MedicinalPlant" | "Fruit" | "Other";
export type FirewoodUnit = "m3" | "ton" | "standardSack" | "kg" | "unit";
export type FirewoodLocationMode = "Coordinates" | "Commune";

export interface FirewoodLicenseDto extends LicensingBaseFields {
  applicantMode: "Simplified" | "Registered";
  applicantName: string;
  applicantContact: string | null;
  operatorId: string | null;
  product: FirewoodProduct;
  quantity: number;
  unit: FirewoodUnit;
  locationMode: FirewoodLocationMode;
  coordinates: CoordinateDto | null;
  commune: string | null;
  carbonizationUnitId: string | null;
  sourceFirewoodLotId: string | null;
}

export type CreateFirewoodLicenseRequest = Omit<FirewoodLicenseDto, keyof LicensingBaseFields>;

/* ----------------------------------------------------------- Aba 3 · Recursos Faunísticos (PR-12) */

export type FaunaUnit = "Specimen" | "Kg";
export type FaunaDestination = "InternalConsumption" | "DomesticTrade" | "Export";
export type SupervenientRevocationStatus = "None" | "Suspended" | "Reduced" | "ExportProhibited";

export interface FaunaLicenseDto extends LicensingBaseFields {
  applicantId: string;
  speciesCode: string;
  quantity: number;
  unit: FaunaUnit;
  captureMethod: string;
  boundary: CoordinateDto[];
  periodStart: string;
  periodEnd: string;
  destination: FaunaDestination;
  faunaStudyFileReference: string | null;
  faunaStudyAuthorEntityId: string | null;
  subjectToInternationalConvention: boolean;
  internationalConventionDetail: string | null;
  supervenientRevocationStatus: SupervenientRevocationStatus;
}

export type CreateFaunaLicenseRequest = Omit<
  FaunaLicenseDto,
  keyof LicensingBaseFields | "supervenientRevocationStatus"
>;

/* --------------------------------------------------------------------- Aba 4 · Apicultura (PR-13) */

export type BeekeepingHolderType = "Individual" | "Cooperative" | "Company";
export type HiveType = "Traditional" | "Langstroth" | "Kenyan" | "Other";
export type BeekeepingLandRegime = "PublicForestDomain" | "GrantedArea" | "OwnLand" | "CommunityArea";
export type BeekeepingProduct = "Honey" | "Wax" | "Propolis" | "Pollen";

export interface BeekeepingProductionLine {
  product: BeekeepingProduct;
  quantityKg: number;
  year: number;
}

export interface BeekeepingLicenseDto extends LicensingBaseFields {
  holderType: BeekeepingHolderType;
  holderName: string;
  holderTaxId: string | null;
  coordinates: CoordinateDto;
  hiveCount: number;
  hiveType: HiveType;
  supportSpeciesCodes: string[];
  landRegime: BeekeepingLandRegime;
  concessionAuthorizationFileReference: string | null;
  productionLines: BeekeepingProductionLine[];
  apiaryRegistrationNumber: string | null;
}

export type CreateBeekeepingLicenseRequest = Omit<BeekeepingLicenseDto, keyof LicensingBaseFields | "apiaryRegistrationNumber">;
