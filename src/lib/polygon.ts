import type { PolygonDto } from "@/modules/idf/types";

/** Utilitários geométricos partilhados por `BoundaryPicker` (edição) e `CoordinatePicker` (referência). */

export const POLYGON_VERTEX_KEYS = ["point1", "point2", "point3", "point4"] as const;
export const POLYGON_VERTEX_LABELS = ["P1", "P2", "P3", "P4"] as const;
export const POLYGON_VERTEX_COLORS = ["#16a34a", "#2563eb", "#d97706", "#7c3aed"] as const;

export const hasPolygonArea = (polygon: PolygonDto) =>
  POLYGON_VERTEX_KEYS.some((k) => polygon[k].latitude !== 0 || polygon[k].longitude !== 0);

/** Anel GeoJSON fechado (5 pontos, o 1º repetido no fim) na ordem dos vértices. */
export const polygonRing = (polygon: PolygonDto): [number, number][] => [
  ...POLYGON_VERTEX_KEYS.map((k) => [polygon[k].longitude, polygon[k].latitude] as [number, number]),
  [polygon.point1.longitude, polygon.point1.latitude],
];

export const polygonCentroid = (polygon: PolygonDto): [number, number] => [
  POLYGON_VERTEX_KEYS.reduce((sum, k) => sum + polygon[k].longitude, 0) / 4,
  POLYGON_VERTEX_KEYS.reduce((sum, k) => sum + polygon[k].latitude, 0) / 4,
];

export const polygonBounds = (polygon: PolygonDto): [[number, number], [number, number]] => {
  const lngs = POLYGON_VERTEX_KEYS.map((k) => polygon[k].longitude);
  const lats = POLYGON_VERTEX_KEYS.map((k) => polygon[k].latitude);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
};
