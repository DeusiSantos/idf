/** Tipos partilhados do módulo IDF, alinhados aos DTOs reais da API (`/api/idf/*`). */
import type {
  OperatorType,
  OperatorStatus,
  ConcessionType,
  ConcessionStatus,
  ForestInventoryStatus,
  TreeStatus,
  ManagementPlanStatus,
  QuotaStatus,
  ForestLicenseStatus,
  ExploitationStatus,
  LogStatus,
  ForestLotStatus,
  TransitGuideStatus,
  WarehouseStatus,
  WarehouseMovementType,
  WarehouseStockStatus,
  CertificateType,
  CertificateStatus,
  ExportStatus,
  InspectionStatus,
  FindingSeverity,
  TargetEntityType,
  EnforcementCaseStatus,
  ViolationSeverity,
  RevenueStatus,
  RevenueActType,
  TraceabilityEntityType,
} from "./enums";

export * from "./enums";

export interface AddressDto {
  street: string;
  municipality: string;
  province: string;
}

export interface CoordinateDto {
  latitude: number;
  longitude: number;
}

export interface ValidityPeriodDto {
  startDate: string;
  endDate: string;
}

export interface VolumeDto {
  value: number;
  unit: string;
}

/** Campos de auditoria devolvidos em todas as entidades da API (secção 3.4). */
export interface ReadOnlyDto {
  id: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalActive: number | null;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PagedQuery {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

/** Erro no formato ProblemDetails (secção 6). */
export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  problem: ProblemDetails;
  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title ?? "Erro inesperado");
    this.problem = problem;
  }
}

/* ---------------------------------------------------------------- Operadores */

export interface OperatorContactDto {
  name: string;
  email: string;
  phoneNumber: string | null;
  isPrimary: boolean;
}

export interface OperatorDocumentDto {
  documentType: string;
  documentNumber: string;
  fileReference: string | null;
}

export interface ForestOperatorDto extends ReadOnlyDto {
  legalName: string;
  taxIdentificationNumber: string;
  operatorNumber: string | null;
  type: OperatorType;
  status: OperatorStatus;
  address: AddressDto;
  contacts: OperatorContactDto[];
  documents: OperatorDocumentDto[];
}

export interface RegisterOperatorRequest {
  legalName: string;
  taxIdentificationNumber: string;
  type: OperatorType;
  address: AddressDto;
  contacts: OperatorContactDto[];
  documents: OperatorDocumentDto[];
}

/* --------------------------------------------------------------- Concessões */

/** Polígono de 4 vértices que delimita a concessão (substituiu o antigo ponto único `center`). */
export interface PolygonDto {
  point1: CoordinateDto;
  point2: CoordinateDto;
  point3: CoordinateDto;
  point4: CoordinateDto;
}

export interface ConcessionLocationDto {
  province: string;
  municipality: string;
  commune: string;
}

export interface ConcessionDto extends ReadOnlyDto {
  forestOperatorId: string;
  code: string;
  type: ConcessionType;
  status: ConcessionStatus;
  validityPeriod: ValidityPeriodDto;
  areaHectares: number;
  boundary: PolygonDto | null;
  location: ConcessionLocationDto | null;
}

export interface CreateConcessionRequest {
  forestOperatorId: string;
  type: ConcessionType;
  validityPeriod: ValidityPeriodDto;
  areaHectares: number;
  boundary: PolygonDto;
  location: ConcessionLocationDto;
}

/* ------------------------------------------------------------- Inventários */

export interface InventoryTreeDto extends ReadOnlyDto {
  code: string;
  speciesCode: string;
  coordinate: CoordinateDto;
  diameter: number;
  height: number;
  volume: VolumeDto;
  status: TreeStatus;
}

export interface ForestInventoryDto extends ReadOnlyDto {
  concessionId: string;
  status: ForestInventoryStatus;
  validityPeriod: ValidityPeriodDto;
  trees: InventoryTreeDto[];
}

export interface CreateInventoryRequest {
  concessionId: string;
  validityPeriod: ValidityPeriodDto;
}

export interface RegisterTreeRequest {
  /** Código da espécie configurada em Administração (`ForestSpeciesDto.code`, ex. "ESP-0001") — nunca o id/GUID. */
  speciesCode: string;
  coordinate: CoordinateDto;
  diameter: number;
  height: number;
  volume: VolumeDto;
}

/* -------------------------------------------------------- Planos de Maneio */

export interface CuttingSelectionTreeDto {
  inventoryTreeId: string;
}

/** Agrupa um conjunto de árvores concretas do inventário sob um nome (ex. "Bloco Norte"). */
export interface CuttingSelectionDto {
  name: string;
  trees: CuttingSelectionTreeDto[];
}

export interface AddCuttingSelectionRequest {
  name: string;
  /** Omitido/ignorado quando `selectAllInventoried` é `true`. */
  treeIds?: string[];
  selectAllInventoried: boolean;
}

export interface ManagementPlanDto extends ReadOnlyDto {
  concessionId: string;
  forestInventoryId: string;
  status: ManagementPlanStatus;
  validityPeriod: ValidityPeriodDto;
  cuttingSelections: CuttingSelectionDto[];
}

export interface CreateManagementPlanRequest {
  concessionId: string;
  forestInventoryId: string;
  validityPeriod: ValidityPeriodDto;
}

/* -------------------------------------------------------------------- Quotas */

export interface ForestQuotaDto extends ReadOnlyDto {
  concessionId: string;
  forestInventoryId: string;
  managementPlanId: string;
  authorizedVolume: number;
  consumedVolume: number;
  remainingVolume: number;
  status: QuotaStatus;
}

export interface RequestQuotaRequest {
  concessionId: string;
  forestInventoryId: string;
  managementPlanId: string;
  authorizedVolume: number;
}

/* ------------------------------------------------------------------ Licenças */

export interface ForestLicenseDto extends ReadOnlyDto {
  concessionId: string;
  quotaId: string;
  operatorId: string;
  licenseNumber: string | null;
  status: ForestLicenseStatus;
  authorizedVolume: VolumeDto;
  validityPeriod: ValidityPeriodDto;
  revenueTransactionId: string | null;
}

export interface RequestLicenseRequest {
  concessionId: string;
  quotaId: string;
  operatorId: string;
  authorizedVolume: number;
  authorizedVolumeUnit: string;
  validityStartDate: string;
  validityEndDate: string;
}

export interface MarkLicensePendingPaymentRequest {
  feeAmount: number;
  currency: string;
}

/* --------------------------------------------------------------- Exploração */

export interface HarvestedTreeDto {
  inventoryTreeId: string;
  treeCode: string;
}

export interface ExploitationOperationDto extends ReadOnlyDto {
  forestLicenseId: string;
  status: ExploitationStatus;
  startedAt: string;
  completedAt: string | null;
  harvestedTrees: HarvestedTreeDto[];
}

export interface StartExploitationRequest {
  forestLicenseId: string;
}

export interface HarvestTreeRequest {
  operationId: string;
  inventoryTreeId: string;
  treeCode: string;
}

/* ----------------------------------------------------------------- Produção */

export interface LogDto extends ReadOnlyDto {
  originTreeId: string;
  exploitationOperationId: string;
  logCode: string;
  speciesCode: string;
  length: number;
  diameter: number;
  volume: VolumeDto;
  status: LogStatus;
}

/** `logCode` é gerado pela API; a medição é sempre um passo à parte (`MeasureLogRequest`). */
export interface CreateLogRequest {
  originTreeId: string;
  exploitationOperationId: string;
  /** Código da espécie configurada em Administração (`ForestSpeciesDto.code`) — nunca o id/GUID. */
  speciesCode: string;
}

export interface MeasureLogRequest {
  length: number;
  diameter: number;
  volume: number;
  volumeUnit: string;
}

export interface LotItemDto {
  logId: string;
}

export interface ForestLotDto extends ReadOnlyDto {
  lotCode: string;
  status: ForestLotStatus;
  items: LotItemDto[];
}

/** Sem corpo — o `lotCode` é gerado pela API. */
export type CreateLotRequest = Record<string, never>;

/* --------------------------------------------------------- Guias de Trânsito */

export interface TransitGuideDto extends ReadOnlyDto {
  forestLotId: string;
  forestLicenseId: string;
  guideNumber: string | null;
  status: TransitGuideStatus;
  origin: string;
  destination: string;
  vehicleRegistration: string;
  driverName: string;
  driverLicenseNumber: string;
  revenueTransactionId: string | null;
}

export interface RequestTransitGuideRequest {
  forestLotId: string;
  forestLicenseId: string;
  origin: string;
  destination: string;
  vehicleRegistration: string;
  driverName: string;
  driverLicenseNumber: string;
}

export interface TransitGuidePaymentRequest {
  amount: number;
  currency: string;
}

/* -------------------------------------------------------------- Entrepostos */

export interface WarehouseMovementDto extends ReadOnlyDto {
  forestLotId: string | null;
  movementType: WarehouseMovementType;
  volume: number;
  movementDate: string;
}

export interface WarehouseStockDto extends ReadOnlyDto {
  forestLotId: string;
  volume: number;
  stockStatus: WarehouseStockStatus;
}

export interface WarehouseDto extends ReadOnlyDto {
  code: string;
  name: string;
  location: CoordinateDto;
  status: WarehouseStatus;
  movements: WarehouseMovementDto[];
  stocks: WarehouseStockDto[];
}

export interface RegisterWarehouseRequest {
  code: string;
  name: string;
  location: CoordinateDto;
}

export interface WarehouseMovementRequest {
  forestLotId: string;
  volume: number;
  movementDate: string;
}

/* -------------------------------------------------------------- Certificados */

export interface ForestCertificateDto extends ReadOnlyDto {
  certificateType: CertificateType;
  status: CertificateStatus;
  forestLotId: string | null;
  exportProcessId: string | null;
  certificateNumber: string | null;
  revenueTransactionId: string | null;
}

export interface RequestCertificateRequest {
  certificateType: CertificateType;
  forestLotId: string | null;
  exportProcessId: string | null;
}

export interface CertificatePaymentRequest {
  amount: number;
  currency: string;
}

/* -------------------------------------------------------------- Exportação */

export interface ExportProcessDto extends ReadOnlyDto {
  forestLotId: string;
  status: ExportStatus;
  destinationCountry: string;
  destinationPort: string;
  revenueTransactionId: string | null;
}

export interface CreateExportProcessRequest {
  forestLotId: string;
  destinationCountry: string;
  destinationPort: string;
}

export interface ExportPaymentRequest {
  amount: number;
  currency: string;
}

/* --------------------------------------------------------------- Inspecções */

export interface InspectionFindingDto extends ReadOnlyDto {
  description: string;
  severity: FindingSeverity;
}

export interface InspectionDto extends ReadOnlyDto {
  inspectionNumber: string | null;
  status: InspectionStatus;
  scheduledDate: string;
  location: CoordinateDto;
  targetEntityId: string;
  targetEntityType: TargetEntityType;
  revenueTransactionId: string | null;
  billableAmount: number | null;
  billableCurrency: string | null;
  findings: InspectionFindingDto[];
}

export interface ScheduleInspectionRequest {
  scheduledDate: string;
  targetEntityId: string;
  targetEntityType: TargetEntityType;
  location: CoordinateDto;
  billableAmount: number | null;
  billableCurrency: string | null;
}

export interface AddInspectionFindingRequest {
  description: string;
  severity: FindingSeverity;
}

/* ------------------------------------------------------------ Fiscalização */

export interface ViolationDto extends ReadOnlyDto {
  description: string;
  severity: ViolationSeverity;
}

export interface FineDto extends ReadOnlyDto {
  amount: number;
  currency: string;
  revenueTransactionId: string | null;
}

export interface EnforcementCaseDto extends ReadOnlyDto {
  inspectionId: string | null;
  caseNumber: string | null;
  status: EnforcementCaseStatus;
  violations: ViolationDto[];
  fines: FineDto[];
}

export interface OpenEnforcementCaseRequest {
  inspectionId: string | null;
}

export interface IssueFineRequest {
  amount: number;
  currency: string;
}

export interface RegisterViolationRequest {
  description: string;
  severity: ViolationSeverity;
}

/* ----------------------------------------------------------------- Receitas */

export interface RevenueTransactionDto extends ReadOnlyDto {
  actType: RevenueActType;
  sourceEntityId: string;
  amount: number;
  currency: string;
  description: string;
  status: RevenueStatus;
}

export interface CreateRevenueTransactionRequest {
  actType: RevenueActType;
  sourceEntityId: string;
  amount: number;
  currency: string;
  description: string;
}

/* ------------------------------------------------------------ Rastreabilidade */

export interface TraceabilityNode {
  id: string;
  reference: string;
  description: string | null;
  status: string | null;
}

export interface TraceabilityChainDto {
  entryPoint: TraceabilityEntityType;
  entryId: string;
  operator?: TraceabilityNode | null;
  concession?: TraceabilityNode | null;
  tree?: TraceabilityNode | null;
  log?: TraceabilityNode | null;
  lot?: TraceabilityNode | null;
  transit?: TraceabilityNode | null;
  warehouse?: TraceabilityNode | null;
  export?: TraceabilityNode | null;
}

/* ------------------------------------------------------------ Administração */

export interface DocumentTypeDto extends ReadOnlyDto {
  code: string;
  name: string;
  module: string;
  isRequired: boolean;
}

export interface CreateDocumentTypeRequest {
  code: string;
  name: string;
  module: string;
  isRequired: boolean;
}

export interface UpdateDocumentTypeRequest {
  name: string;
  module: string;
  isRequired: boolean;
  isActive: boolean;
}

export interface ForestSpeciesDto extends ReadOnlyDto {
  code: string;
  scientificName: string;
  commonName: string;
}

export interface CreateForestSpeciesRequest {
  code: string;
  scientificName: string;
  commonName: string;
}

export interface UpdateForestSpeciesRequest {
  scientificName: string;
  commonName: string;
  isActive: boolean;
}

export interface IdfSummaryReportDto {
  operatorsCount: number;
  concessionsCount: number;
  licensesCount: number;
  lotsCount: number;
  exportsCount: number;
  inspectionsCount: number;
  revenueTotal: number;
}

/* -------------------------------------------------------------- Perfis (roles) */

export interface RoleDto extends ReadOnlyDto {
  name: string | null;
  description: string | null;
  code: string | null;
}

/* ---------------------------------------------------------------- Utilizadores */

export type GenderType = "Masculino" | "Feminino";

export interface IdentificationDto {
  type: string | null;
  number: string | null;
}

export interface ContactDto {
  email: string | null;
  phoneNumber: string | null;
}

export interface UserProfileDto extends ReadOnlyDto {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  gender: string | null;
  identification: IdentificationDto | null;
  contact: ContactDto | null;
  address: AddressDto | null;
  roleId: string;
  role: RoleDto;
}

/** Cria a conta (login) e o perfil num só passo — só a Administração pode fazer isto. */
export interface CreateUserProfileRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: string;
}

export interface UpdateUserProfileRequest {
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  gender: GenderType | null;
  contact: ContactDto;
  identification: IdentificationDto;
  address: AddressDto;
  roleId: string | null;
}

export interface UsersByRoleDto {
  roles: { name: string | null; totalUsers: number }[];
}
