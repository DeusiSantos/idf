import type { CoordinateDto, ReadOnlyDto } from "@/modules/idf/types";

/**
 * Tipos do Registo de Área (secções 4, 5 e 9 da SIGAFLO/DRF-02). Módulo genuinely novo, sem
 * endpoint no backend — ver `modules/idf/api/areas.ts` (mock local, mesma forma de uma API real).
 */

export const OVERLAP_LAYERS = [
  "ProtectedAreas",
  "MiningCadastre",
  "AgriculturalCadastre",
  "GrantedAreas",
  "CommunityRights",
] as const;
export type OverlapLayerKey = (typeof OVERLAP_LAYERS)[number];

export const OVERLAP_LAYER_LABELS: Record<OverlapLayerKey, string> = {
  ProtectedAreas: "Áreas protegidas (INBAC)",
  MiningCadastre: "Cadastro mineiro",
  AgriculturalCadastre: "Cadastro agrícola",
  GrantedAreas: "Áreas já concedidas ou licenciadas",
  CommunityRights: "Áreas comunitárias e direitos costumeiros",
};

export type OverlapVerdict = "Conforme" | "ConformeComReserva" | "NaoConforme";

export interface OverlapLayerResult {
  layer: OverlapLayerKey;
  verdict: OverlapVerdict;
  note: string;
  overlappedHectares: number;
}

export type LandRegime = "Agricultural" | "Forest";

export const LAND_REGIME_MIN_VEGETATION: Record<LandRegime, number> = {
  Agricultural: 20,
  Forest: 80,
};

export interface ForestAreaLocationDto {
  province: string;
  municipality: string;
  commune: string;
}

export interface ForestAreaDto extends ReadOnlyDto {
  code: string;
  designation: string;
  boundary: CoordinateDto[];
  declaredAreaHectares: number;
  calculatedAreaHectares: number;
  location: ForestAreaLocationDto;
  igcaSketchFileReference: string;
  descriptiveMemoryFileReference: string | null;
  descriptiveMemoryText: string | null;
  legalSituation: string;
  priorInventoryFileReference: string | null;
  inventoryAuthorEntityId: string | null;
  landRegime: LandRegime;
  naturalVegetationPercent: number;
  overlapResults: OverlapLayerResult[];
  overlapVerdict: OverlapVerdict;
}

export interface CreateForestAreaRequest {
  designation: string;
  boundary: CoordinateDto[];
  declaredAreaHectares: number;
  location: ForestAreaLocationDto;
  igcaSketchFileReference: string | null;
  descriptiveMemoryFileReference: string | null;
  descriptiveMemoryText: string | null;
  legalSituation: string;
  priorInventoryFileReference: string | null;
  inventoryAuthorEntityId: string | null;
  landRegime: LandRegime;
}
