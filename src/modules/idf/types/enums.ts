/**
 * Espelho dos enums do backend (`Modules.IdfModule.*`).
 *
 * A API serializa estes enums como NÚMEROS INTEIROS (o ordinal da declaração C#), não como
 * strings — o Swagger não traz os nomes. As listas abaixo replicam a ordem exacta das
 * declarações C# tal como confirmado pelo backend (2026-08-15). A UI trabalha sempre com o
 * nome (string) — a conversão para/de ordinal acontece só na fronteira com a API (`api/*.ts`).
 *
 * ⚠️ `WAREHOUSE_STOCK_STATUS` é a única excepção: o backend não partilhou esse enum, por isso
 * está marcada como NÃO VERIFICADA — confirmar antes de confiar no rótulo em produção.
 */

export function toEnumName<T extends readonly string[]>(values: T, ordinal: number | null | undefined): T[number] {
  if (ordinal == null || !values[ordinal]) {
    return (values[0] ?? "Desconhecido") as T[number];
  }
  return values[ordinal] as T[number];
}

export function toEnumOrdinal<T extends readonly string[]>(values: T, name: T[number]): number {
  const idx = values.indexOf(name);
  return idx === -1 ? 0 : idx;
}

/* -------------------------------------------------------------- Operadores */
export const OPERATOR_TYPE = ["Individual", "Company", "Cooperative", "PublicEntity"] as const;
export type OperatorType = (typeof OPERATOR_TYPE)[number];

export const OPERATOR_STATUS = [
  "Draft",
  "Submitted",
  "TechnicalValidation",
  "LegalValidation",
  "Approved",
  "Rejected",
  "Active",
  "Suspended",
  "Cancelled",
] as const;
export type OperatorStatus = (typeof OPERATOR_STATUS)[number];

/* -------------------------------------------------------------- Concessões */
export const CONCESSION_TYPE = ["ForestConcession", "CommunityForest", "Other"] as const;
export type ConcessionType = (typeof CONCESSION_TYPE)[number];

export const CONCESSION_STATUS = [
  "Draft",
  "Submitted",
  "UnderReview",
  "Approved",
  "Active",
  "Suspended",
  "Expired",
  "Cancelled",
] as const;
export type ConcessionStatus = (typeof CONCESSION_STATUS)[number];

/* ------------------------------------------------------------ Inventários */
/**
 * ⚠️ Fluxo linear (LinearStateGuard) — ordem inferida da sequência de transições descrita pelo
 * backend (Draft→InProgress→Submitted→UnderTechnicalReview→Validated, com Rejected como saída),
 * não confirmada no swagger (ainda não reflecte esta versão). Verificar assim que o backend
 * publicar o enum C# real; se a ordem diferir, os estados vão trocar de nome na UI.
 */
export const FOREST_INVENTORY_STATUS = [
  "Draft",
  "InProgress",
  "Submitted",
  "UnderTechnicalReview",
  "Validated",
  "Rejected",
] as const;
export type ForestInventoryStatus = (typeof FOREST_INVENTORY_STATUS)[number];

export const TREE_STATUS = ["Inventoried", "AuthorizedForExploitation", "Harvested", "Cancelled"] as const;
export type TreeStatus = (typeof TREE_STATUS)[number];

/* ------------------------------------------------------- Planos de Maneio */
export const MANAGEMENT_PLAN_STATUS = [
  "Draft",
  "Submitted",
  "UnderTechnicalReview",
  "Approved",
  "Rejected",
  "Suspended",
  "Expired",
] as const;
export type ManagementPlanStatus = (typeof MANAGEMENT_PLAN_STATUS)[number];

/* ------------------------------------------------------------------ Quotas */
export const QUOTA_STATUS = [
  "Requested",
  "UnderAnalysis",
  "Approved",
  "PartiallyUsed",
  "Consumed",
  "Expired",
  "Cancelled",
] as const;
export type QuotaStatus = (typeof QUOTA_STATUS)[number];

/* ----------------------------------------------------------------- Licenças */
export const FOREST_LICENSE_STATUS = [
  "Draft",
  "Submitted",
  "PendingPayment",
  "Issued",
  "Active",
  "Suspended",
  "Expired",
  "Cancelled",
] as const;
export type ForestLicenseStatus = (typeof FOREST_LICENSE_STATUS)[number];

/* --------------------------------------------------------------- Exploração */
export const EXPLOITATION_STATUS = [
  "Planned",
  "Started",
  "InProgress",
  "Completed",
  "Suspended",
  "Cancelled",
] as const;
export type ExploitationStatus = (typeof EXPLOITATION_STATUS)[number];

/* ----------------------------------------------------------------- Produção */
export const LOG_STATUS = [
  "Created",
  "Measured",
  "Available",
  "AllocatedToLot",
  "InTransit",
  "Stored",
  "Exported",
] as const;
export type LogStatus = (typeof LOG_STATUS)[number];

export const FOREST_LOT_STATUS = [
  "Open",
  "Closed",
  "InTransit",
  "Stored",
  "PartiallyDispatched",
  "Dispatched",
  "Exported",
  "Cancelled",
] as const;
export type ForestLotStatus = (typeof FOREST_LOT_STATUS)[number];

/* -------------------------------------------------------- Guias de Trânsito */
export const TRANSIT_GUIDE_STATUS = [
  "Draft",
  "Submitted",
  "Validating",
  "PendingPayment",
  "Paid",
  "Issued",
  "InTransit",
  "Completed",
  "Cancelled",
  "Expired",
] as const;
export type TransitGuideStatus = (typeof TRANSIT_GUIDE_STATUS)[number];

/* -------------------------------------------------------------- Entrepostos */
export const WAREHOUSE_STATUS = ["Active", "Inactive", "Suspended"] as const;
export type WarehouseStatus = (typeof WAREHOUSE_STATUS)[number];

export const WAREHOUSE_MOVEMENT_TYPE = ["Entry", "InternalTransfer", "Exit", "Adjustment"] as const;
export type WarehouseMovementType = (typeof WAREHOUSE_MOVEMENT_TYPE)[number];

/**
 * ⚠️ NÃO VERIFICADO — o backend não enviou a declaração deste enum (só confirmou os outros 24).
 * Ordem assumida por analogia com fluxos de stock semelhantes; confirmar com o backend antes
 * de confiar neste rótulo em produção.
 */
export const WAREHOUSE_STOCK_STATUS = ["Available", "Reserved", "Dispatched", "Blocked"] as const;
export type WarehouseStockStatus = (typeof WAREHOUSE_STOCK_STATUS)[number];

/* -------------------------------------------------------------- Certificados */
export const CERTIFICATE_TYPE = ["Origin", "Export", "Phytosanitary"] as const;
export type CertificateType = (typeof CERTIFICATE_TYPE)[number];

export const CERTIFICATE_STATUS = [
  "Requested",
  "UnderValidation",
  "PendingPayment",
  "Paid",
  "Issued",
  "Expired",
  "Cancelled",
] as const;
export type CertificateStatus = (typeof CERTIFICATE_STATUS)[number];

/* -------------------------------------------------------------- Exportação */
export const EXPORT_STATUS = [
  "Draft",
  "Submitted",
  "DocumentValidation",
  "PendingPayment",
  "Paid",
  "Authorized",
  "Dispatched",
  "Completed",
  "Rejected",
  "Cancelled",
] as const;
export type ExportStatus = (typeof EXPORT_STATUS)[number];

/* --------------------------------------------------------------- Inspecções */
export const INSPECTION_STATUS = ["Scheduled", "InProgress", "Completed", "Cancelled"] as const;
export type InspectionStatus = (typeof INSPECTION_STATUS)[number];

export const FINDING_SEVERITY = ["Low", "Medium", "High", "Critical"] as const;
export type FindingSeverity = (typeof FINDING_SEVERITY)[number];

export const TARGET_ENTITY_TYPE = [
  "ForestOperator",
  "ForestLot",
  "Warehouse",
  "TransitGuide",
  "ExportProcess",
  "ForestLicense",
] as const;
export type TargetEntityType = (typeof TARGET_ENTITY_TYPE)[number];

/* ------------------------------------------------------------ Fiscalização */
export const ENFORCEMENT_CASE_STATUS = [
  "Open",
  "UnderInvestigation",
  "DecisionPending",
  "Fined",
  "Appealed",
  "Closed",
  "Cancelled",
] as const;
export type EnforcementCaseStatus = (typeof ENFORCEMENT_CASE_STATUS)[number];

export const VIOLATION_SEVERITY = ["Low", "Medium", "High", "Critical"] as const;
export type ViolationSeverity = (typeof VIOLATION_SEVERITY)[number];

/* ----------------------------------------------------------------- Receitas */
export const REVENUE_STATUS = [
  "Pending",
  "Calculated",
  "Liquidated",
  "PartiallyPaid",
  "Paid",
  "Cancelled",
  "Refunded",
] as const;
export type RevenueStatus = (typeof REVENUE_STATUS)[number];

export const REVENUE_ACT_TYPE = [
  "License",
  "TransitGuide",
  "Certificate",
  "Authorization",
  "Inspection",
  "InspectionVisit",
  "Warehouse",
  "Fine",
  "Indemnification",
  "Other",
] as const;
export type RevenueActType = (typeof REVENUE_ACT_TYPE)[number];

/* ------------------------------------------------------------ Rastreabilidade */
export const TRACEABILITY_ENTITY_TYPE = ["Log", "ForestLot", "ExportProcess"] as const;
export type TraceabilityEntityType = (typeof TRACEABILITY_ENTITY_TYPE)[number];
