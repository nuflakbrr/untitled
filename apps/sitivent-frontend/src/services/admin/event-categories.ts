'use server';

import type {
  EventCategory,
  EventCategoryResponse,
  EventCategoryPaginationResponse,
} from '@/interfaces/features/event-categories';

import api from '@/lib/api';
import { slugify } from '@/lib/slugify';
import { revalidatePath } from 'next/cache';
import { eventCategorySchema, type EventCategoryValues } from '@/schemas/event-categories';

const BASE_PATH = '/admin/master/event-categories';

function unwrap<T>(response: {
  data: { data?: T; pagination?: { total?: number; page?: number; limit?: number } };
}) {
  return response.data;
}

export async function getEventCategories(
  page = 1,
  limit = 10,
  search = '',
  includeDeleted = false
): Promise<EventCategoryPaginationResponse> {
  try {
    const response = await api.get('/features/v1/event-categories', {
      params: { page, limit, search },
    });
    const body = unwrap<EventCategory[]>(response);
    const pagination = body.pagination;
    const data = (body.data ?? [])
      .map((item) => ({
        ...item,
        createdAt: new Date(
          String(
            (item as unknown as Record<string, unknown>).createdAt ??
              (item as unknown as Record<string, unknown>).created_at
          )
        ),
        updatedAt: new Date(
          String(
            (item as unknown as Record<string, unknown>).updatedAt ??
              (item as unknown as Record<string, unknown>).updated_at
          )
        ),
        deletedAt: (() => {
          const value =
            (item as unknown as Record<string, unknown>).deletedAt ??
            (item as unknown as Record<string, unknown>).deleted_at;
          return value ? new Date(String(value)) : null;
        })(),
        eventsCount: Number(
          (item as unknown as Record<string, unknown>).eventsCount ??
            (item as unknown as Record<string, unknown>).events_count ??
            0
        ),
      }))
      .filter((item) => (includeDeleted ? Boolean(item.deletedAt) : !item.deletedAt));
    return {
      success: true,
      data,
      meta: {
        total: data.length,
        page: pagination?.page ?? page,
        lastPage: Math.ceil(data.length / limit) || 1,
      },
    };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}

export async function restoreEventCategory(id: string): Promise<EventCategoryResponse> {
  try {
    await api.patch(`/features/v1/event-categories/${id}/restore`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Kategori berhasil dipulihkan.' };
  } catch {
    return { success: false, error: 'Gagal memulihkan kategori.' };
  }
}

export async function getAllEventCategories(): Promise<EventCategory[]> {
  try {
    return (await api.get('/features/v1/event-categories')).data.data ?? [];
  } catch {
    return [];
  }
}

export async function getEventCategoryById(id: string): Promise<EventCategoryResponse> {
  try {
    const response = await api.get('/features/v1/event-categories', {
      params: { page: 1, limit: 1000 },
    });
    const category = (response.data.data ?? []).find((item: EventCategory) => item.id === id);
    return category
      ? { success: true, data: category }
      : { success: false, error: 'Kategori tidak ditemukan.' };
  } catch {
    return { success: false, error: 'Kategori tidak ditemukan.' };
  }
}

export async function createEventCategory(
  values: EventCategoryValues
): Promise<EventCategoryResponse> {
  const parsed = eventCategorySchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input tidak valid.' };
  try {
    const result = await api.post('/features/v1/event-categories', {
      ...parsed.data,
      slug: slugify(parsed.data.name),
    });
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Kategori berhasil dibuat.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal membuat kategori.',
    };
  }
}

export async function updateEventCategory(
  id: string,
  values: EventCategoryValues
): Promise<EventCategoryResponse> {
  const parsed = eventCategorySchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input tidak valid.' };
  try {
    const result = await api.put(`/features/v1/event-categories/${id}`, {
      ...parsed.data,
      slug: slugify(parsed.data.name),
    });
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Kategori berhasil diperbarui.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui kategori.',
    };
  }
}

export async function deleteEventCategory(id: string): Promise<EventCategoryResponse> {
  try {
    await api.delete(`/features/v1/event-categories/${id}`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus kategori.',
    };
  }
}

export async function permanentlyDeleteEventCategory(id: string): Promise<EventCategoryResponse> {
  try {
    await api.delete(`/features/v1/event-categories/${id}/permanent`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Kategori berhasil dihapus permanen.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus kategori permanen.',
    };
  }
}

export async function getPublicEventCategories(): Promise<EventCategory[]> {
  return getAllEventCategories();
}
