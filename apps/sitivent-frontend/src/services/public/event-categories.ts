'use server';

import type { EventCategory } from '@/interfaces/features/events';

import api from '@/lib/api';

export async function getPublicEventCategories(): Promise<EventCategory[]> {
  try {
    return (
      await api.get('/features/v1/event-categories', {
        headers: { 'X-Skip-Tenant': 'true' },
      })
    ).data.data ?? [];
  } catch {
    return [];
  }
}
