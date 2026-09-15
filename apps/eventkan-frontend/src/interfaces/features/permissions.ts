import type { ApiResponse, PaginatedResponse } from './common';

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    roles: number;
    role_has_permissions: number;
    model_has_permissions: number;
  };
}

export type PermissionResponse = ApiResponse<Permission | Permission[]>;

export type PermissionPaginationResponse = PaginatedResponse<Permission>;
