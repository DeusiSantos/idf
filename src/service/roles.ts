import api from "@/service/api";
import { AuditFields, PagedResult } from "@/service/types";

export interface Role extends AuditFields {
  id: string;
  name: string | null;
  description: string | null;
  code: string | null;
}

export interface RoleFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export async function getRoles(filters: RoleFilters = {}): Promise<PagedResult<Role>> {
  const { data } = await api.get<PagedResult<Role>>("roles", {
    params: {
      Page: filters.page,
      PageSize: filters.pageSize,
      Name: filters.name,
      Description: filters.description,
      IsActive: filters.isActive,
      IsDeleted: filters.isDeleted,
    },
  });
  return data;
}

export async function getRoleById(id: string): Promise<Role> {
  const { data } = await api.get<Role>(`roles/${id}`);
  return data;
}
