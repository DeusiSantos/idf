import api from "@/service/api";
import { AuditFields, PagedResult } from "@/service/types";
import { Role } from "@/service/roles";

export type GenderType = "Masculino" | "Feminino";

export interface IdentificationDto {
  type: string | null;
  number: string | null;
}

export interface ContactDto {
  email: string | null;
  phoneNumber: string | null;
}

export interface AddressDto {
  street: string | null;
  municipality: string | null;
  province: string | null;
}

export interface UserProfile extends AuditFields {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  gender: string | null;
  identification: IdentificationDto;
  contact: ContactDto;
  address: AddressDto;
  roleId: string;
  role: Role;
}

export interface UserProfileFilters {
  page?: number;
  pageSize?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  identificationNumber?: string;
  roleId?: string;
  gender?: GenderType;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  createdBy?: string;
}

export interface UpdateMyProfileInput {
  firstName: string | null;
  lastName: string | null;
  birthdate: string | null;
  gender: GenderType | null;
  identification: IdentificationDto;
  contact: ContactDto;
  address: AddressDto;
  roleId: string | null;
}

/** Perfil do utilizador autenticado (GET /users-profiles/me). */
export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("users-profiles/me");
  return data;
}

/**
 * Actualiza o perfil do utilizador autenticado (PATCH /users-profiles/me).
 * Envia sempre o objecto completo — o endpoint substitui os campos recebidos,
 * por isso quem chamar deve partir do perfil actual (getMyProfile) e só alterar o necessário.
 */
export async function updateMyProfile(input: UpdateMyProfileInput): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>("users-profiles/me", input);
  return data;
}

export async function getUserProfiles(filters: UserProfileFilters = {}): Promise<PagedResult<UserProfile>> {
  const { data } = await api.get<PagedResult<UserProfile>>("users-profiles", {
    params: {
      Page: filters.page,
      PageSize: filters.pageSize,
      FullName: filters.fullName,
      FirstName: filters.firstName,
      LastName: filters.lastName,
      Email: filters.email,
      IdentificationNumber: filters.identificationNumber,
      RoleId: filters.roleId,
      Gender: filters.gender,
      IsActive: filters.isActive,
      IsDeleted: filters.isDeleted,
      CreatedAfter: filters.createdAfter,
      CreatedBefore: filters.createdBefore,
      CreatedBy: filters.createdBy,
    },
  });
  return data;
}

export async function getUserProfileById(id: string): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(`users-profiles/${id}`);
  return data;
}

export async function enableUserProfile(userProfileId: string): Promise<void> {
  await api.put(`users-profiles/enable/${userProfileId}`);
}

export async function disableUserProfile(userProfileId: string): Promise<void> {
  await api.put(`users-profiles/disable/${userProfileId}`);
}
