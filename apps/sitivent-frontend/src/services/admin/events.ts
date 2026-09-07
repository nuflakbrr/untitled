'use server';

import type { z } from 'zod';
import type { Event, EventResponse, EventPaginationResponse } from '@/interfaces/features/events';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { eventSchema } from '@/schemas/events';

const BASE_PATH = '/admin/master/events';
export type EventValues = z.infer<typeof eventSchema>;

function body<T>(result: {
  data: { data?: T; pagination?: { total?: number; page?: number; limit?: number } };
}) {
  return result.data;
}

function normalizeEvent(item: Record<string, unknown>): Event {
  return {
    ...(item as unknown as Event),
    eventType: (item.eventType ?? item.event_type) as Event['eventType'],
    startDate: new Date(String(item.startDate ?? item.start_date)),
    endDate: new Date(String(item.endDate ?? item.end_date)),
    startTime: String(item.startTime ?? item.start_time ?? ''),
    endTime: String(item.endTime ?? item.end_time ?? ''),
    registrationDeadline: new Date(String(item.registrationDeadline ?? item.registration_deadline)),
    certificateEnabled: Boolean(item.certificateEnabled ?? item.certificate_enabled),
    createdAt: new Date(String(item.createdAt ?? item.created_at)),
    updatedAt: new Date(String(item.updatedAt ?? item.updated_at)),
    deletedAt: item.deletedAt
      ? new Date(String(item.deletedAt))
      : item.deleted_at
        ? new Date(String(item.deleted_at))
        : null,
    _count: (item._count ?? { registrations: 0 }) as Event['_count'],
  };
}

export async function getEvents(
  page = 1,
  limit = 10,
  search = '',
  includeDeleted = false
): Promise<EventPaginationResponse> {
  try {
    const result = body<Record<string, unknown>[]>(
      await api.get('/features/v1/events/admin', { params: { page, limit, search } })
    );
    const data = (result.data ?? [])
      .map(normalizeEvent)
      .filter((event) => (includeDeleted ? Boolean(event.deletedAt) : !event.deletedAt));
    const total = result.pagination?.total ?? data.length;
    return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}

export async function restoreEvent(id: string): Promise<EventResponse> {
  try {
    await api.patch(`/features/v1/events/${id}/restore`);
    revalidatePath(BASE_PATH);
    return { success: true, message: 'Event berhasil dipulihkan.' };
  } catch {
    return { success: false, error: 'Gagal memulihkan event.' };
  }
}

export async function getEventById(id: string): Promise<EventResponse> {
  try {
    const result = body<Record<string, unknown>[]>(
      await api.get('/features/v1/events/admin', { params: { page: 1, limit: 100 } })
    );
    const event = (result.data ?? []).find((item) => item.id === id);
    return event
      ? { success: true, data: normalizeEvent(event) }
      : { success: false, error: 'Event tidak ditemukan.' };
  } catch {
    return { success: false, error: 'Event tidak ditemukan.' };
  }
}

export async function createEvent(values: EventValues): Promise<EventResponse> {
  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input event tidak valid.' };
  try {
    const result = await api.post('/features/v1/events', parsed.data);
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Event berhasil dibuat.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal membuat event.',
    };
  }
}

export async function updateEvent(id: string, values: EventValues): Promise<EventResponse> {
  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input event tidak valid.' };
  try {
    const result = await api.put(`/features/v1/events/${id}`, parsed.data);
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Event berhasil diperbarui.' };
  } catch {
    return { success: false, error: 'Gagal memperbarui event.' };
  }
}

export async function deleteEvent(id: string, permanent = false): Promise<EventResponse> {
  try {
    await api.delete(`/features/v1/events/${id}${permanent ? '/permanent' : ''}`);
    revalidatePath(BASE_PATH);
    return {
      success: true,
      message: permanent ? 'Event berhasil dihapus permanen.' : 'Event berhasil dihapus.',
    };
  } catch (error) {
    const detail = (
      error as { response?: { data?: { message?: string; errors?: { detail?: string[] } } } }
    ).response?.data;
    return {
      success: false,
      error: detail?.errors?.detail?.[0] ?? detail?.message ?? 'Gagal menghapus event.',
    };
  }
}
export async function publishEvent(id: string): Promise<EventResponse> {
  try {
    const result = await api.patch(`/features/v1/events/${id}/status`, { status: 'PUBLISHED' });
    revalidatePath(BASE_PATH);
    return { success: true, data: result.data.data, message: 'Event berhasil dipublikasikan.' };
  } catch {
    return { success: false, error: 'Gagal mempublikasikan event.' };
  }
}
export async function getAllEvents() {
  try {
    const data = (await api.get('/features/v1/events', { params: { limit: 100 } })).data.data ?? [];
    return data.map((event: Event) => ({ id: event.id, title: event.title }));
  } catch {
    return [];
  }
}
export async function getPublicEvents(): Promise<Event[]> {
  try {
    return (
      (await api.get('/features/v1/events', { params: { status: 'PUBLISHED', limit: 100 } })).data
        .data ?? []
    );
  } catch {
    return [];
  }
}
