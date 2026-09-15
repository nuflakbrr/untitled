'use server';

import type { Gallery, GalleryPaginationResponse } from '@/interfaces/features/galleries';

import api from '@/lib/api';

function normalizeGallery(item: Record<string, unknown>): Gallery {
  return {
    ...item,
    tenantId: item.tenantId ?? item.tenant_id ?? null,
    imageUrl: item.imageUrl ?? item.image_url ?? '',
    eventId: item.eventId ?? item.event_id ?? null,
    createdAt: String(item.createdAt ?? item.created_at ?? ''),
    updatedAt: String(item.updatedAt ?? item.updated_at ?? ''),
    deletedAt: item.deletedAt ?? item.deleted_at ?? null,
  } as Gallery;
}

export async function getPublicGalleries(
  page = 1,
  limit = 10,
  featured?: boolean
): Promise<GalleryPaginationResponse> {
  try {
    const result = (
      await api.get('/features/v1/galleries', {
        params: { page, limit, featured },
      })
    ).data;
    const data = (result.data ?? [])
      .map(normalizeGallery)
      .filter((item: Gallery) => !item.deletedAt);
    const total = result.meta?.pagination?.total ?? data.length;

    return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}
