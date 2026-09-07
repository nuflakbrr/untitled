'use server';

import type { EventSearchResult } from '@/interfaces/features/events';

import api from '@/lib/api';

export interface CategoryItem { id: string; name: string; slug: string }

export async function getPublicCategoriesAction(): Promise<CategoryItem[]> {
  try { return (await api.get('/features/v1/event-categories')).data.data ?? []; } catch { return []; }
}

export async function searchEventsAction(query: string, limit = 6): Promise<EventSearchResult[]> {
  if (query.trim().length < 2) return [];
  try { return (await api.get('/features/v1/events', { params: { search: query.trim(), status: 'PUBLISHED', page: 1, limit: Math.min(limit, 10) } })).data.data ?? []; } catch { return []; }
}

export async function getPublicGalleriesAction(page = 1, limit = 8) {
  try {
    const items = (await api.get('/features/v1/galleries', { params: { page, limit } })).data.data ?? [];
    return items.map((item: Record<string, unknown>) => ({
      ...item,
      imageUrl: item.imageUrl ?? item.image_url ?? '',
      eventId: item.eventId ?? item.event_id ?? null,
      createdAt: item.createdAt ?? item.created_at,
      updatedAt: item.updatedAt ?? item.updated_at,
    }));
  } catch { return []; }
}
