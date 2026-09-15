import type { ApiResponse, PaginatedResponse } from './common';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  _count?: {
    users: number;
    permissions: number;
    roleHasPermissions: number;
    modelHasPermissions: number;
  };
}

export type RoleResponse = ApiResponse<Role>;
export type RolePaginationResponse = PaginatedResponse<Role>;
