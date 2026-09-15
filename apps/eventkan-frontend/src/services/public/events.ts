'use server';

import type { Event } from '@/interfaces/features/events';

import api from '@/lib/api';

function normalizeEvent(item: Record<string, unknown>): Event {
  const creator = item.creator as Record<string, unknown> | null | undefined;

  return {
    ...(item as unknown as Event),
    eventType: (item.eventType ?? item.event_type) as Event['eventType'],
    startDate: new Date(String(item.startDate ?? item.start_date)),
    endDate: new Date(String(item.endDate ?? item.end_date)),
    startTime: String(item.startTime ?? item.start_time ?? ''),
    endTime: String(item.endTime ?? item.end_time ?? ''),
    registrationDeadline: new Date(String(item.registrationDeadline ?? item.registration_deadline)),
    certificateEnabled: Boolean(item.certificateEnabled ?? item.certificate_enabled),
    registrationCount: Number(item.registrationCount ?? item.registration_count ?? 0),
    speakers: (item.speakers ?? []) as Event['speakers'],
    benefits: (item.benefits ?? []) as Event['benefits'],
    createdBy: creator
      ? {
          id: String(creator.id),
          name: String(creator.name ?? ''),
          email: String(creator.email ?? ''),
          image: (creator.image ?? creator.avatarUrl ?? creator.avatar_url ?? null) as
            string | null,
        }
      : null,
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

export async function getPublicEvents(search = '', categorySlug = ''): Promise<Event[]> {
  try {
    const result = await api.get('/features/v1/events', {
      params: { status: 'PUBLISHED', limit: 100, search, category_slug: categorySlug },
      headers: { 'X-Skip-Tenant': 'true' },
    });

    return (result.data.data ?? []).map(normalizeEvent);
  } catch {
    return [];
  }
}

export async function getPublicEventBySlug(slug: string): Promise<Event | null> {
  try {
    const result = await api.get(`/features/v1/events/${slug}`);
    return result.data.data ? normalizeEvent(result.data.data) : null;
  } catch {
    return null;
  }
}
