import type { CoordinateDto } from "@/modules/idf/types";

/**
 * Utilitários para polígonos de N vértices (Registo de Área — desenho livre no mapa). Diferente de
 * `src/lib/polygon.ts`, que é fixo a 4 vértices e específico do polígono da Concessão.
 *
 * `polygonAreaHectares` usa uma projecção equirectangular simples (graus → metros, escalados por
 * cos(latitude média)) em vez de turf.js — suficiente à escala de uma área florestal e evita
 * acrescentar uma dependência só para isto. A distorção cresce para polígonos muito grandes
 * (dezenas de km); documentado aqui caso seja preciso trocar por turf.js no futuro.
 */

const EARTH_RADIUS_M = 6_371_000;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Converte os vértices para metros, num plano local centrado na latitude média do polígono. */
function toLocalMeters(points: CoordinateDto[]): [number, number][] {
  const meanLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
  const cosLat = Math.cos(toRad(meanLat));
  return points.map((p) => [toRad(p.longitude) * EARTH_RADIUS_M * cosLat, toRad(p.latitude) * EARTH_RADIUS_M]);
}

/** Área do polígono (fórmula do shoelace), em hectares. Requer pelo menos 3 vértices. */
export function polygonAreaHectares(points: CoordinateDto[]): number {
  if (points.length < 3) return 0;
  const local = toLocalMeters(points);
  let sum = 0;
  for (let i = 0; i < local.length; i++) {
    const [x1, y1] = local[i];
    const [x2, y2] = local[(i + 1) % local.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2 / 10_000;
}

const cross = (o: CoordinateDto, p: CoordinateDto, q: CoordinateDto) =>
  (p.longitude - o.longitude) * (q.latitude - o.latitude) - (p.latitude - o.latitude) * (q.longitude - o.longitude);

const segmentsIntersect = (a1: CoordinateDto, a2: CoordinateDto, b1: CoordinateDto, b2: CoordinateDto): boolean => {
  const d1 = cross(b1, b2, a1);
  const d2 = cross(b1, b2, a2);
  const d3 = cross(a1, a2, b1);
  const d4 = cross(a1, a2, b2);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
};

/** Detecta auto-intersecção entre arestas não adjacentes do polígono fechado. */
export function hasSelfIntersection(points: CoordinateDto[]): boolean {
  const n = points.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const a1 = points[i];
    const a2 = points[(i + 1) % n];
    for (let j = i + 1; j < n; j++) {
      if (j === i || j === (i + 1) % n || (j + 1) % n === i) continue; // arestas adjacentes partilham vértice
      if (segmentsIntersect(a1, a2, points[j], points[(j + 1) % n])) return true;
    }
  }
  return false;
}

export function polygonCentroidFree(points: CoordinateDto[]): [number, number] {
  return [
    points.reduce((sum, p) => sum + p.longitude, 0) / points.length,
    points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
  ];
}

export function polygonBoundsFree(points: CoordinateDto[]): [[number, number], [number, number]] {
  const lngs = points.map((p) => p.longitude);
  const lats = points.map((p) => p.latitude);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

/** Anel GeoJSON fechado (1º ponto repetido no fim). */
export function polygonRingFree(points: CoordinateDto[]): [number, number][] {
  if (points.length === 0) return [];
  return [...points.map((p) => [p.longitude, p.latitude] as [number, number]), [points[0].longitude, points[0].latitude]];
}

/**
 * Ray-casting: `point` dentro do anel `polygon` (fechado ou não — funciona nos dois casos). Usado
 * para validar que a parcela de uma Concessão fica dentro do polígono da Área-mãe.
 */
export function isPointInPolygon(point: CoordinateDto, polygon: CoordinateDto[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;
    const intersects = yi > point.latitude !== yj > point.latitude && point.longitude < ((xj - xi) * (point.latitude - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * Todos os vértices de `child` caem dentro de `parent`. Não deteca arestas de `child` que saiam e
 * voltem a entrar em `parent` sem nenhum vértice ficar fora (polígonos não convexos complexos) —
 * decisão de protótipo documentada; suficiente para validar parcelas de concessão na prática.
 */
export const isPolygonWithinPolygon = (child: CoordinateDto[], parent: CoordinateDto[]): boolean =>
  child.length > 0 && child.every((point) => isPointInPolygon(point, parent));

/**
 * Hash simples e determinístico do polígono — usado pelos mocks (sobreposição, vegetação natural)
 * para devolver sempre o mesmo resultado para o mesmo desenho, em vez de aleatório a cada chamada.
 */
export function hashPolygon(points: CoordinateDto[]): number {
  let hash = 0;
  for (const p of points) {
    const s = `${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
