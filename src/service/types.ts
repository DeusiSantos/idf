/** Campos de auditoria presentes em quase todas as entidades da API (ver Swagger). */
export interface AuditFields {
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}

/** Resultado paginado devolvido pelos endpoints de listagem da API. */
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
