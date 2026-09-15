'use server';

import type { ParticipantRegistration } from '@/interfaces/features/registrations';

import api from '@/lib/api';

function normalizeRegistration(item: Record<string, unknown>): ParticipantRegistration {
  return {
    ...item,
    eventId: item.eventId ?? item.event_id,
    userId: item.userId ?? item.user_id,
    registrationNumber: item.registrationNumber ?? item.registration_number,
    createdAt: new Date(String(item.createdAt ?? item.created_at)),
    updatedAt: new Date(String(item.updatedAt ?? item.updated_at)),
    deletedAt:
      (item.deletedAt ?? item.deleted_at)
        ? new Date(String(item.deletedAt ?? item.deleted_at))
        : null,
    user: {
      id: String(item.userId ?? item.user_id),
      name: item.userName ?? item.user_name ?? null,
      email: String(item.userEmail ?? item.user_email ?? ''),
    },
    event: {
      id: String(item.eventId ?? item.event_id),
      title: String(item.eventTitle ?? item.event_title ?? '-'),
      slug: String(item.eventSlug ?? item.event_slug ?? ''),
      price: Number(item.price ?? 0),
      startDate: new Date(String(item.eventStartDate ?? item.event_start_date)),
      startTime: String(item.eventStartTime ?? item.event_start_time ?? ''),
      endTime: String(item.eventEndTime ?? item.event_end_time ?? ''),
      location: String(item.eventLocation ?? item.event_location ?? ''),
      status: String(item.eventStatus ?? item.event_status ?? ''),
      certificateEnabled: Boolean(item.certificateEnabled ?? item.certificate_enabled ?? false),
      eventType: String(item.eventType ?? item.event_type ?? ''),
      meetingLink: (item.eventMeetingLink ?? item.event_meeting_link ?? null) as string | null,
    },
    certificates: (item.certificates ?? []) as ParticipantRegistration['certificates'],
    testimonial: (item.testimonial ?? null) as ParticipantRegistration['testimonial'],
  } as ParticipantRegistration;
}

export async function getParticipantRegistrations(): Promise<ParticipantRegistration[]> {
  try {
    return ((await api.get('/features/v1/registrations/me')).data.data ?? []).map(
      normalizeRegistration
    );
  } catch {
    return [];
  }
}

export async function registerToEvent(
  eventId: string
): Promise<{ success: boolean; data?: ParticipantRegistration; message?: string; error?: string }> {
  try {
    return {
      success: true,
      message: 'Pendaftaran event berhasil.',
      data: normalizeRegistration(
        (await api.post('/features/v1/registrations', { event_id: eventId })).data.data
      ),
    };
  } catch {
    return { success: false, error: 'Gagal mendaftar event.' };
  }
}

export async function getEventRegistrationStatus(
  eventId: string
): Promise<ParticipantRegistration | null> {
  const registrations = await getParticipantRegistrations();
  return (
    registrations.find(
      (registration) => registration.eventId === eventId && !registration.deletedAt
    ) ?? null
  );
}
