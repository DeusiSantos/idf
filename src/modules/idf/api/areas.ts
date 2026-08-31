import { createMockStore, newMockId } from "@/modules/idf/mock/store";
import { hasSelfIntersection, hashPolygon, polygonAreaHectares, polygonCentroidFree } from "@/lib/geoPolygon";
import { PROVINCES } from "@/modules/idf/config/modules";
import { ApiError } from "@/modules/idf/types";
import {
  LAND_REGIME_MIN_VEGETATION,
  OVERLAP_LAYERS,
  OVERLAP_LAYER_LABELS,
  type CreateForestAreaRequest,
  type ForestAreaDto,
  type OverlapLayerKey,
  type OverlapLayerResult,
  type OverlapVerdict,
} from "@/modules/idf/types/areas";
import type { PagedResult } from "@/modules/idf/types";

/**
 * Registo de Área — mock local (sem endpoint no backend), mesma forma de um `api/*.ts` real:
 * `list*`/`get*`/`create*` devolvem `Promise`, erros de validação são `ApiError` com `errors` por
 * campo (o mesmo formato `ProblemDetails` que `toProblem`/`fieldError` já sabem interpretar).
 */

const store = createMockStore<ForestAreaDto>("idf.mock.areas");

const VERDICT_RANK: Record<OverlapVerdict, number> = { Conforme: 0, ConformeComReserva: 1, NaoConforme: 2 };
const worstVerdict = (results: OverlapLayerResult[]): OverlapVerdict =>
  results.reduce<OverlapVerdict>((worst, r) => (VERDICT_RANK[r.verdict] > VERDICT_RANK[worst] ? r.verdict : worst), "Conforme");

/**
 * Verificação de sobreposição contra as 5 camadas obrigatórias (secção 4) — determinística a
 * partir do hash do polígono, para o mesmo desenho dar sempre o mesmo resultado (não é aleatório a
 * cada chamada). Sem SIG real ligado, é um mock; "Áreas comunitárias e direitos costumeiros" pesa
 * exactamente como as outras 4, nunca é tratada como meramente informativa.
 */
function runOverlapCheck(boundary: { latitude: number; longitude: number }[]): OverlapLayerResult[] {
  const baseHash = hashPolygon(boundary);
  return OVERLAP_LAYERS.map((layer, index) => {
    const roll = (baseHash + index * 97) % 100;
    const label = OVERLAP_LAYER_LABELS[layer];
    if (roll < 60) {
      return { layer, verdict: "Conforme" as const, note: `Sem sobreposição com ${label.toLowerCase()}.`, overlappedHectares: 0 };
    }
    if (roll < 85) {
      const overlappedHectares = Number((((baseHash + index) % 50) / 10 + 0.5).toFixed(1));
      return {
        layer,
        verdict: "ConformeComReserva" as const,
        note: `Sobreposição parcial com ${label.toLowerCase()} — sujeita a reserva.`,
        overlappedHectares,
      };
    }
    const overlappedHectares = Number((((baseHash + index) % 200) / 10 + 5).toFixed(1));
    return {
      layer,
      verdict: "NaoConforme" as const,
      note: `Sobreposição significativa com ${label.toLowerCase()} — bloqueante.`,
      overlappedHectares,
    };
  });
}

/**
 * Percentagem de vegetação natural — mock determinístico (sem SIG real ligado). Exportada para o
 * formulário mostrar uma pré-visualização ao vivo enquanto o polígono é desenhado.
 */
export const mockNaturalVegetationPercent = (boundary: { latitude: number; longitude: number }[]): number =>
  hashPolygon(boundary) % 101;

/**
 * Deriva a província a partir do polígono. Decisão documentada: sem serviço de geocodificação
 * reversa real disponível, escolhe-se de forma determinística (hash do centróide) dentro da lista
 * `PROVINCES` já existente — placeholder até o backend/uma API de geocodificação estar disponível.
 * Exportada para o formulário (`ForestAreasPage`) usar o mesmo cálculo ao pré-preencher
 * `LocationFields` assim que o polígono ganha área — fonte única, sem duplicar a lógica.
 */
export function deriveProvinceFromBoundary(boundary: { latitude: number; longitude: number }[]): string {
  const [lng, lat] = polygonCentroidFree(boundary);
  const seed = Math.abs(Math.round(lat * 1000 + lng * 1000));
  return PROVINCES[seed % PROVINCES.length];
}

const fieldErrors = (errors: Record<string, string[]>) =>
  new ApiError({ status: 422, title: "Dados inválidos", errors });

export interface AreaListQuery {
  page?: number;
  pageSize?: number;
  code?: string;
  status?: OverlapVerdict | "all";
}

export const listForestAreas = (query: AreaListQuery = {}): Promise<PagedResult<ForestAreaDto>> =>
  store.list({
    page: query.page,
    pageSize: query.pageSize,
    filter: (item) =>
      (!query.code || item.code.toLowerCase().includes(query.code.toLowerCase())) &&
      (!query.status || query.status === "all" || item.overlapVerdict === query.status),
  });

export const getForestArea = (id: string): Promise<ForestAreaDto> => store.get(id);

export const createForestArea = async (request: CreateForestAreaRequest): Promise<ForestAreaDto> => {
  const errors: Record<string, string[]> = {};

  if (!request.designation.trim()) errors.designation = ["A designação é obrigatória."];
  if (request.boundary.length < 3) errors.boundary = ["O polígono precisa de pelo menos 3 vértices."];
  else if (hasSelfIntersection(request.boundary)) errors.boundary = ["O polígono tem auto-intersecção — ajuste os vértices."];
  if (!request.declaredAreaHectares || request.declaredAreaHectares <= 0)
    errors.declaredAreaHectares = ["Indique a área declarada."];
  if (!request.igcaSketchFileReference) errors.igcaSketchFileReference = ["O croquis IGCA é obrigatório."];
  if (!request.legalSituation.trim()) errors.legalSituation = ["Descreva a situação jurídica do terreno."];
  // Memória descritiva só é obrigatória se não houver inventário florestal anterior anexado.
  if (!request.priorInventoryFileReference && !request.descriptiveMemoryFileReference && !request.descriptiveMemoryText?.trim()) {
    errors.descriptiveMemoryText = ["Obrigatória quando não há inventário florestal anterior anexado."];
  }
  if (request.priorInventoryFileReference && !request.inventoryAuthorEntityId) {
    errors.inventoryAuthorEntityId = ["Indique o autor do inventário anexado."];
  }

  if (!request.location.province) errors["location.province"] = ["A província é derivada do polígono — desenhe a área primeiro."];
  if (Object.keys(errors).length > 0) throw fieldErrors(errors);

  const calculatedAreaHectares = Number(polygonAreaHectares(request.boundary).toFixed(2));
  const overlapResults = runOverlapCheck(request.boundary);
  const naturalVegetationPercent = mockNaturalVegetationPercent(request.boundary);

  const year = new Date().getFullYear();
  const sequence = store.all().filter((a) => a.code.startsWith(`ARE-${year}-`)).length + 1;
  const code = `ARE-${year}-${String(sequence).padStart(3, "0")}`;

  const now = new Date().toISOString();
  const area: ForestAreaDto = {
    id: newMockId(),
    code,
    designation: request.designation,
    boundary: request.boundary,
    declaredAreaHectares: request.declaredAreaHectares,
    calculatedAreaHectares,
    location: request.location,
    igcaSketchFileReference: request.igcaSketchFileReference as string,
    descriptiveMemoryFileReference: request.descriptiveMemoryFileReference,
    descriptiveMemoryText: request.descriptiveMemoryText,
    legalSituation: request.legalSituation,
    priorInventoryFileReference: request.priorInventoryFileReference,
    inventoryAuthorEntityId: request.inventoryAuthorEntityId,
    landRegime: request.landRegime,
    naturalVegetationPercent,
    overlapResults,
    overlapVerdict: worstVerdict(overlapResults),
    createdAt: now,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
    isDeleted: false,
    isActive: true,
    deletedAt: null,
    deletedBy: null,
  };

  return store.create(area);
};

export { OVERLAP_LAYER_LABELS, LAND_REGIME_MIN_VEGETATION };
export type { OverlapLayerKey };
