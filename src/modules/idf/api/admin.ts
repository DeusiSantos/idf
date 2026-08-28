import { call, cleanParams, http } from "@/modules/idf/api/http";
import type {
  CreateDocumentTypeRequest,
  CreateForestSpeciesRequest,
  CreateUserProfileRequest,
  DocumentTypeDto,
  ForestSpeciesDto,
  PagedQuery,
  PagedResult,
  RoleDto,
  UpdateDocumentTypeRequest,
  UpdateForestSpeciesRequest,
  UpdateUserProfileRequest,
  UserProfileDto,
  UsersByRoleDto,
} from "@/modules/idf/types";

const SPECIES_BASE = "idf/admin/forest-species";
const DOC_TYPES_BASE = "idf/admin/document-types";
const USERS_BASE = "users-profiles";
const ROLES_BASE = "roles";

/* ------------------------------------------------------------ Espécies florestais */

export interface SpeciesListQuery extends PagedQuery {
  code?: string;
  commonName?: string;
}

export const listForestSpecies = (query: SpeciesListQuery = {}): Promise<PagedResult<ForestSpeciesDto>> =>
  call<PagedResult<ForestSpeciesDto>>(
    http.get(SPECIES_BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Code: query.code,
        CommonName: query.commonName,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );

export const getForestSpecies = (id: string): Promise<ForestSpeciesDto> =>
  call<ForestSpeciesDto>(http.get(`${SPECIES_BASE}/${id}`));

export const createForestSpecies = (request: CreateForestSpeciesRequest): Promise<ForestSpeciesDto> =>
  call<ForestSpeciesDto>(http.post(SPECIES_BASE, request));

export const updateForestSpecies = (id: string, request: UpdateForestSpeciesRequest): Promise<ForestSpeciesDto> =>
  call<ForestSpeciesDto>(http.put(`${SPECIES_BASE}/${id}`, request));

export const deleteForestSpecies = (id: string): Promise<void> => call<void>(http.delete(`${SPECIES_BASE}/${id}`));

/* --------------------------------------------------------------- Tipos de documento */

export interface DocumentTypeListQuery extends PagedQuery {
  code?: string;
  module?: string;
}

export const listDocumentTypes = (query: DocumentTypeListQuery = {}): Promise<PagedResult<DocumentTypeDto>> =>
  call<PagedResult<DocumentTypeDto>>(
    http.get(DOC_TYPES_BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Code: query.code,
        Module: query.module,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );

export const getDocumentType = (id: string): Promise<DocumentTypeDto> =>
  call<DocumentTypeDto>(http.get(`${DOC_TYPES_BASE}/${id}`));

export const createDocumentType = (request: CreateDocumentTypeRequest): Promise<DocumentTypeDto> =>
  call<DocumentTypeDto>(http.post(DOC_TYPES_BASE, request));

export const updateDocumentType = (id: string, request: UpdateDocumentTypeRequest): Promise<DocumentTypeDto> =>
  call<DocumentTypeDto>(http.put(`${DOC_TYPES_BASE}/${id}`, request));

export const deleteDocumentType = (id: string): Promise<void> => call<void>(http.delete(`${DOC_TYPES_BASE}/${id}`));

/* --------------------------------------------------------------------- Utilizadores */

export interface UserProfileListQuery extends PagedQuery {
  fullName?: string;
  email?: string;
  roleId?: string;
}

export const listUserProfiles = (query: UserProfileListQuery = {}): Promise<PagedResult<UserProfileDto>> =>
  call<PagedResult<UserProfileDto>>(
    http.get(USERS_BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        FullName: query.fullName,
        Email: query.email,
        RoleId: query.roleId,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );

export const getUserProfile = (id: string): Promise<UserProfileDto> =>
  call<UserProfileDto>(http.get(`${USERS_BASE}/${id}`));

/** Cria a conta de acesso (login) e o perfil num só passo. */
export const createUserProfile = (request: CreateUserProfileRequest): Promise<UserProfileDto> =>
  call<UserProfileDto>(http.post(USERS_BASE, request));

export const updateUserProfile = (id: string, request: UpdateUserProfileRequest): Promise<UserProfileDto> =>
  call<UserProfileDto>(http.patch(`${USERS_BASE}/${id}`, request));

export const enableUserProfile = (id: string): Promise<void> => call<void>(http.put(`${USERS_BASE}/enable/${id}`));

export const disableUserProfile = (id: string): Promise<void> => call<void>(http.put(`${USERS_BASE}/disable/${id}`));

export const deleteUserProfile = (id: string): Promise<void> => call<void>(http.delete(`${USERS_BASE}/${id}`));

export const getUsersTotalByRole = (): Promise<UsersByRoleDto> =>
  call<UsersByRoleDto>(http.get(`${USERS_BASE}/total-by-roles`));

/* --------------------------------------------------------------------------- Perfis (roles) */

export interface RoleListQuery extends PagedQuery {
  name?: string;
}

export const listRoles = (query: RoleListQuery = {}): Promise<PagedResult<RoleDto>> =>
  call<PagedResult<RoleDto>>(
    http.get(ROLES_BASE, {
      params: cleanParams({
        Page: query.page,
        PageSize: query.pageSize,
        Name: query.name,
        IsActive: query.isActive,
        IsDeleted: query.isDeleted,
      }),
    }),
  );
