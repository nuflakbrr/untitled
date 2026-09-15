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

export interface ParticipantRegistration extends Registration {
  event: Registration['event'] & {
    slug: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
    certificateEnabled: boolean;
    eventType: string;
    meetingLink: string | null;
  };
  certificates: Array<{ id: string; downloadUrl: string }>;
  testimonial?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

export type RegistrationResponse = ApiResponse<Registration>;
export type RegistrationPaginationResponse = PaginatedResponse<Registration>;
