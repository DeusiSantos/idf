import {
  Users,
  Map,
  Trees,
  ClipboardList,
  Gauge,
  FileCheck,
  Axe,
  Boxes,
  Route,
  Truck,
  Warehouse,
  Award,
  Search,
  Ship,
  ShieldAlert,
  Coins,
  LayoutDashboard,
  Settings,
  LandPlot,
  Stamp,
  type LucideIcon,
} from "lucide-react";

/** ServiceCodes do backend (secção 3). */
export const SERVICE = {
  OPERATORS: "IDF_30",
  CONCESSIONS: "IDF_31",
  INVENTORIES: "IDF_32",
  MANAGEMENT_PLANS: "IDF_33",
  QUOTAS: "IDF_34",
  LICENSES: "IDF_35",
  EXPLOITATION: "IDF_36",
  PRODUCTION: "IDF_37",
  TRACEABILITY: "IDF_38",
  TRANSIT_GUIDES: "IDF_39",
  WAREHOUSES: "IDF_40",
  CERTIFICATES: "IDF_41",
  INSPECTIONS: "IDF_42",
  EXPORTS: "IDF_43",
  ENFORCEMENT: "IDF_44",
  REVENUE: "IDF_45",
  REPORTS: "IDF_47",
  ADMIN: "IDF_48",
  /**
   * ⚠️ Pseudo-códigos de protótipo — Registo de Área e Licenciamento standalone ainda não têm
   * ServiceCode real no backend (secção 3), por isso nunca usam o formato "IDF_NN" (evita colidir
   * com um código futuro). Servem só para o gating de UI via `usePermission`, que hoje ignora o
   * código específico e olha apenas para `user.isActive`.
   */
  AREAS: "MOCK_AREAS",
  LICENSING: "MOCK_LICENSING",
} as const;

export type ServiceCode = (typeof SERVICE)[keyof typeof SERVICE];

/** PermissionCodes (secção 2). */
export const PERMISSION = {
  CREATE: "CRT_1",
  VIEW: "VRW_2",
  UPDATE: "UPD_3",
  DELETE: "DEL_4",
  LIST: "LST_5",
  ENABLE: "ENB_7",
  DISABLE: "DSB_8",
  APPROVE: "APV_9",
  STATS: "STC_11",
} as const;

export type PermissionCode = (typeof PERMISSION)[keyof typeof PERMISSION];

export interface IdfModule {
  service: ServiceCode;
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface IdfNavGroup {
  label: string;
  modules: IdfModule[];
}

export const NAV_GROUPS: IdfNavGroup[] = [
  {
    label: "Dashboard",
    modules: [
      { service: SERVICE.REPORTS, label: "Visão Geral", path: "/idf/dashboard", icon: LayoutDashboard },
      { service: SERVICE.REPORTS, label: "Mapa", path: "/idf/map", icon: Map },
    ],
  },
  {
    label: "Cadastro",
    modules: [
      { service: SERVICE.OPERATORS, label: "Operadores", path: "/idf/operators", icon: Users },
      { service: SERVICE.AREAS, label: "Registo de Área", path: "/idf/areas", icon: LandPlot },
      { service: SERVICE.CONCESSIONS, label: "Concessões", path: "/idf/concessions", icon: Map },
    ],
  },
  {
    label: "Planeamento",
    modules: [
      { service: SERVICE.INVENTORIES, label: "Inventários", path: "/idf/inventories", icon: Trees },
      { service: SERVICE.MANAGEMENT_PLANS, label: "Planos de Maneio", path: "/idf/management-plans", icon: ClipboardList },
      { service: SERVICE.QUOTAS, label: "Quotas", path: "/idf/quotas", icon: Gauge },
    ],
  },
  {
    label: "Exploração",
    modules: [
      { service: SERVICE.LICENSES, label: "Licenças", path: "/idf/licenses", icon: FileCheck },
      { service: SERVICE.LICENSING, label: "Licenciamento", path: "/idf/licensing", icon: Stamp },
      { service: SERVICE.EXPLOITATION, label: "Exploração", path: "/idf/exploitation", icon: Axe },
      { service: SERVICE.PRODUCTION, label: "Produção", path: "/idf/production", icon: Boxes },
    ],
  },
  {
    label: "Cadeia de Custódia",
    modules: [
      { service: SERVICE.TRANSIT_GUIDES, label: "Guias de Trânsito", path: "/idf/transit-guides", icon: Truck },
      { service: SERVICE.WAREHOUSES, label: "Entrepostos", path: "/idf/warehouses", icon: Warehouse },
      { service: SERVICE.TRACEABILITY, label: "Rastreabilidade", path: "/idf/traceability", icon: Route },
    ],
  },
  {
    label: "Controlo",
    modules: [
      { service: SERVICE.INSPECTIONS, label: "Inspecções", path: "/idf/inspections", icon: Search },
      { service: SERVICE.ENFORCEMENT, label: "Fiscalização", path: "/idf/enforcement", icon: ShieldAlert },
      { service: SERVICE.CERTIFICATES, label: "Certificados", path: "/idf/certificates", icon: Award },
    ],
  },
  {
    label: "Comercialização",
    modules: [{ service: SERVICE.EXPORTS, label: "Exportação", path: "/idf/exports", icon: Ship }],
  },
  {
    label: "Financeiro",
    modules: [{ service: SERVICE.REVENUE, label: "Receitas", path: "/idf/revenue", icon: Coins }],
  },
  {
    label: "Transversal",
    modules: [
      { service: SERVICE.ADMIN, label: "Administração", path: "/idf/admin", icon: Settings },
    ],
  },
];

export const PROVINCES = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando",
  "Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Icolo e Bengo",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Moxico Leste",
  "Namibe",
  "Uíge",
  "Zaire",
];
