import type { Role } from './roles';
import type { ApiResponse, PaginatedResponse } from './common';

export interface User {
  deletedAt?: string | null;
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  roleId?: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  banned?: boolean;
  banReason?: string | null;
}

export interface ExtendedUser {
  id: string;
  roleId?: string | null;
  role?: string | null;
  roles?: { id: string; name: string }[];
}

export interface ParticipantProfileFormProps {
  user: Pick<User, 'name' | 'email' | 'image'>;
}

export type UserResponse = ApiResponse<User>;
export type UserPaginationResponse = PaginatedResponse<User>;
