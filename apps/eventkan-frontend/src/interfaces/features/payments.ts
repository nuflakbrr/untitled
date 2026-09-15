import type { PaymentStatus } from '@/interfaces/enums';
import type { ApiResponse, PaginatedResponse } from './common';

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  status: PaymentStatus;
  verifiedAt?: Date | null;
  verifiedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  registration: {
    id: string;
    registrationNumber: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    event: {
      id: string;
      title: string;
      price: number;
    };
  };
  verifiedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface ParticipantPayment {
  id: string;
  registrationId: string;
  amount: number;
  status: string;
  createdAt: Date;
  deletedAt?: Date | null;
  registration: {
    id: string;
    registrationNumber: string;
    status: string;
    event: { id: string; title: string; slug: string };
  };
}

export type PaymentResponse = ApiResponse<Payment>;
export type PaymentPaginationResponse = PaginatedResponse<Payment>;
