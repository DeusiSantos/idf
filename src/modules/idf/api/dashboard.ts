import { call, http } from "@/modules/idf/api/http";
import type { CoordinateDto, IdfSummaryReportDto, PolygonDto } from "@/modules/idf/types";
import { listConcessions } from "@/modules/idf/api/concessions";
import { listQuotas } from "@/modules/idf/api/quotas";
import { listLicenses } from "@/modules/idf/api/licenses";
import { listExploitationOperations } from "@/modules/idf/api/exploitation";
import { listEnforcementCases } from "@/modules/idf/api/enforcement";
import { listRevenueTransactions } from "@/modules/idf/api/revenue";
import { listInventories } from "@/modules/idf/api/inventories";
import { listInspections } from "@/modules/idf/api/inspections";
import { listWarehouses } from "@/modules/idf/api/warehouses";

/** Grande o suficiente para aproximar "todos os registos" nas listagens usadas nos agregados do dashboard. */
const ALL = { pageSize: 500 };

export interface DashboardKpis {
  operatorsCount: number;
  concessionsCount: number;
  licensesCount: number;
  activeOperationsCount: number;
  lotsCount: number;
  exportsCount: number;
  inspectionsCount: number;
  enforcementOpenCount: number;
  revenueTotal: number;
  revenuePending: number;
  authorizedVolume: number;
  consumedVolume: number;
  harvestedTreesCount: number;
  areaHectares: number;
}

export interface NameValue {
  name: string;
  value: number;
}

export interface QuotaUsageRow {
  code: string;
  authorized: number;
  consumed: number;
}

export interface ActivityRow {
  date: string;
  label: string;
  type: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  quotaUsage: QuotaUsageRow[];
  speciesVolume: NameValue[];
  licenseStatus: NameValue[];
  revenueBySource: NameValue[];
  /** Receita mensal liquidada (m³ abatido por mês deixou de estar disponível — API não guarda data de abate por árvore). */
  monthlyRevenue: NameValue[];
  recentActivity: ActivityRow[];
}

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const bump = (map: Map<string, number>, key: string, amount = 1) => map.set(key, (map.get(key) ?? 0) + amount);

const toList = (map: Map<string, number>): NameValue[] =>
  [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

const shortId = (id: string) => `#${id.slice(0, 8)}`;

export const getDashboardData = async (): Promise<DashboardData> => {
  const [summary, concessions, quotas, licenses, operations, cases, revenue, inventories] = await Promise.all([
    call<IdfSummaryReportDto>(http.get("idf/reports/summary")),
    listConcessions(ALL),
    listQuotas(ALL),
    listLicenses(ALL),
    listExploitationOperations(ALL),
    listEnforcementCases(ALL),
    listRevenueTransactions(ALL),
    listInventories(ALL),
  ]);

  const harvestedTreesCount = operations.items.reduce((sum, o) => sum + o.harvestedTrees.length, 0);

  const licenseStatus = new Map<string, number>();
  licenses.items.forEach((l) => bump(licenseStatus, l.status));

  const revenueBySource = new Map<string, number>();
  const monthMap = new Map<string, number>();
  revenue.items
    .filter((r) => r.status === "Paid")
    .forEach((r) => {
      bump(revenueBySource, r.actType, r.amount);
      const month = MONTHS[new Date(r.createdAt).getMonth()] ?? "—";
      bump(monthMap, month, r.amount);
    });

  const speciesMap = new Map<string, number>();
  inventories.items.forEach((inv) =>
    inv.trees.filter((t) => t.status === "Harvested").forEach((t) => bump(speciesMap, t.speciesCode, t.volume.value)),
  );

  const recentActivity: ActivityRow[] = [
    ...licenses.items.map((l) => ({
      date: l.createdAt,
      label: `Licença ${l.licenseNumber ?? shortId(l.id)}`,
      type: "Licenças",
    })),
    ...operations.items.map((o) => ({ date: o.createdAt, label: `Operação ${shortId(o.id)}`, type: "Exploração" })),
    ...cases.items.map((c) => ({
      date: c.createdAt,
      label: `Processo ${c.caseNumber ?? shortId(c.id)}`,
      type: "Fiscalização",
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  return {
    kpis: {
      operatorsCount: summary.operatorsCount,
      concessionsCount: summary.concessionsCount,
      licensesCount: summary.licensesCount,
      activeOperationsCount: operations.items.filter((o) => o.status === "Started" || o.status === "InProgress")
        .length,
      lotsCount: summary.lotsCount,
      exportsCount: summary.exportsCount,
      inspectionsCount: summary.inspectionsCount,
      enforcementOpenCount: cases.items.filter((c) => c.status !== "Closed" && c.status !== "Cancelled").length,
      revenueTotal: summary.revenueTotal,
      revenuePending: revenue.items.filter((r) => r.status !== "Paid" && r.status !== "Cancelled").reduce(
        (sum, r) => sum + r.amount,
        0,
      ),
      authorizedVolume: quotas.items.reduce((s, q) => s + q.authorizedVolume, 0),
      consumedVolume: quotas.items.reduce((s, q) => s + q.consumedVolume, 0),
      harvestedTreesCount,
      areaHectares: concessions.items.reduce((s, c) => s + c.areaHectares, 0),
    },
    quotaUsage: quotas.items.map((q) => ({
      code: shortId(q.id),
      authorized: q.authorizedVolume,
      consumed: q.consumedVolume,
    })),
    speciesVolume: toList(speciesMap),
    licenseStatus: toList(licenseStatus),
    revenueBySource: toList(revenueBySource),
    monthlyRevenue: MONTHS.filter((m) => monthMap.has(m)).map((m) => ({ name: m, value: monthMap.get(m)! })),
    recentActivity,
  };
};

/** Centro aproximado do polígono da concessão para plotar um único marcador. `null` quando degenerado (ex.: registos antigos migrados sem os 4 vértices ainda definidos). */
const polygonCentroid = (boundary: PolygonDto): CoordinateDto | null => {
  const points = [boundary.point1, boundary.point2, boundary.point3, boundary.point4];
  if (points.every((p) => p.latitude === 0 && p.longitude === 0)) return null;
  return {
    latitude: points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
    longitude: points.reduce((sum, p) => sum + p.longitude, 0) / points.length,
  };
};

export type MapPointKind = "concession" | "warehouse" | "inventory" | "inspection";

export interface MapPoint {
  id: string;
  kind: MapPointKind;
  title: string;
  subtitle: string;
  status: string;
  coordinate: CoordinateDto;
  link?: string;
  /** Só em pontos "concession" — desenhado como polígono no mapa além do marcador do centróide. */
  boundary?: PolygonDto;
}

export const getMapPoints = async (): Promise<MapPoint[]> => {
  const [concessions, warehouses, inventories, inspections] = await Promise.all([
    listConcessions(ALL),
    listWarehouses(ALL),
    listInventories(ALL),
    listInspections(ALL),
  ]);

  const points: MapPoint[] = [];

  concessions.items
    .map((c) => ({ concession: c, centroid: c.boundary && polygonCentroid(c.boundary) }))
    .filter((x): x is { concession: (typeof concessions.items)[number]; centroid: CoordinateDto } => Boolean(x.centroid))
    .forEach(({ concession: c, centroid }) =>
      points.push({
        id: c.id,
        kind: "concession",
        title: `Concessão ${c.code}`,
        subtitle: `${c.areaHectares.toLocaleString("pt-AO")} ha · ${c.type}`,
        status: c.status,
        coordinate: centroid,
        link: "/idf/concessions",
        boundary: c.boundary ?? undefined,
      }),
    );

  warehouses.items.forEach((w) =>
    points.push({
      id: w.id,
      kind: "warehouse",
      title: `Entreposto ${w.code}`,
      subtitle: w.name,
      status: w.status,
      coordinate: w.location,
      link: "/idf/warehouses",
    }),
  );

  inventories.items.forEach((inv) =>
    inv.trees.forEach((t) =>
      points.push({
        id: `${inv.id}-${t.id}`,
        kind: "inventory",
        title: `Árvore ${t.code}`,
        subtitle: `Inventário ${shortId(inv.id)} · ${t.volume.value} ${t.volume.unit}`,
        status: t.status,
        coordinate: t.coordinate,
        link: "/idf/inventories",
      }),
    ),
  );

  inspections.items
    .filter((i) => i.location)
    .forEach((i) =>
      points.push({
        id: i.id,
        kind: "inspection",
        title: `Inspecção ${i.inspectionNumber ?? shortId(i.id)}`,
        subtitle: i.targetEntityType,
        status: i.status,
        coordinate: i.location,
        link: "/idf/inspections",
      }),
    );

  return points;
};
