import type { ApiResponse, PaginatedResponse } from './common';

export interface Gallery {
  id: string;
  tenantId?: string | null;
  title: string;
  description: string | null;
  imageUrl: string;
  featured: boolean;
  eventId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  event?: {
    id: string;
    title: string;
  } | null;
}

export interface CreateGalleryInput {
  title: string;
  description?: string | null;
  imageUrl: string;
  featured?: boolean;
  eventId?: string | null;
}

export type GalleryResponse = ApiResponse<Gallery>;
export type GalleryPaginationResponse = PaginatedResponse<Gallery>;
