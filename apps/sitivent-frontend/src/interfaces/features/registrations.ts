import type { RegistrationStatus } from '@/interfaces/enums';
import type { ApiResponse, PaginatedResponse } from './common';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationNumber: string;
  qrToken?: string | null;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  event: {
    id: string;
    title: string;
    price: number;
    startDate: Date;
  };
}

export type RegistrationResponse = ApiResponse<Registration>;
export type RegistrationPaginationResponse = PaginatedResponse<Registration>;
