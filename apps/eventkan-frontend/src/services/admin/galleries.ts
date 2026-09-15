'use server';

import type { z } from 'zod';
import type { gallerySchema } from '@/schemas/galleries';
import type {
  Gallery,
  GalleryResponse,
  GalleryPaginationResponse,
} from '@/interfaces/features/galleries';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';

const BASE_PATH = '/admin/master/galleries';
export type GalleryValues = z.infer<typeof gallerySchema>;

function toGalleryPayload(values: GalleryValues) {
  return {
    title: values.title,
    description: values.description || '',
    image_url: values.imageUrl,
    featured: values.featured,
    event_id: values.eventId || undefined,
  };
}

function normalizeGallery(item: Record<string, unknown>): Gallery {
  return {
    ...item,
    tenantId: item.tenantId ?? item.tenant_id ?? null,
    imageUrl: item.imageUrl ?? item.image_url ?? '',
    eventId: item.eventId ?? item.event_id ?? null,
    createdAt: item.createdAt ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updated_at,
    deletedAt: item.deletedAt ?? item.deleted_at ?? null,
  } as Gallery;
}

export async function getGalleries(
  page = 1,
  limit = 10,
  search = '',
  featured?: boolean,
  includeDeleted = false
): Promise<GalleryPaginationResponse> {
  try {
    const result = (
      await api.get('/features/v1/galleries', {
        params: { page, limit, search, featured, include_deleted: includeDeleted },
      })
    ).data;
    const data = (result.data ?? [])
      .map(normalizeGallery)
      .filter((item: Gallery) => (includeDeleted ? Boolean(item.deletedAt) : !item.deletedAt));
    const total = result.meta?.pagination?.total ?? data.length;
    return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}
export async function getGalleryById(id: string): Promise<GalleryResponse> {
  try {
    return {
      success: true,
      data: normalizeGallery((await api.get(`/features/v1/galleries/${id}`)).data.data),
    };
  } catch {
    return { success: false, error: 'Galeri tidak ditemukan.' };
  }
}
export async function createGallery(values: GalleryValues): Promise<GalleryResponse> {
  try {
    const result = await api.post('/features/v1/galleries', toGalleryPayload(values));
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Galeri berhasil dibuat.' };
  } catch {
    return { success: false, error: 'Gagal membuat galeri.' };
  }
}
export async function updateGallery(id: string, values: GalleryValues): Promise<GalleryResponse> {
  try {
    const result = await api.put(`/features/v1/galleries/${id}`, toGalleryPayload(values));
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Galeri berhasil diperbarui.' };
  } catch {
    return { success: false, error: 'Gagal memperbarui galeri.' };
  }
}
export async function deleteGallery(id: string): Promise<GalleryResponse> {
  try {
    await api.delete(`/features/v1/galleries/${id}`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Galeri berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus galeri.' };
  }
}
export async function restoreGallery(id: string): Promise<GalleryResponse> {
  try {
    await api.patch(`/features/v1/galleries/${id}/restore`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Galeri berhasil dipulihkan.' };
  } catch {
    return { success: false, error: 'Gagal memulihkan galeri.' };
  }
}
export async function permanentlyDeleteGallery(id: string): Promise<GalleryResponse> {
  try {
    await api.delete(`/features/v1/galleries/${id}/permanent`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Galeri berhasil dihapus permanen.' };
  } catch {
    return { success: false, error: 'Gagal menghapus galeri permanen.' };
  }
}
