'use server';

import type {
  AdminDashboardStats,
  ParticipantDashboardStats,
} from '@/interfaces/features/dashboard';

import api from '@/lib/api';

import { verifySession } from './security';

export async function getAdminDashboardData(
  tenantId?: string
): Promise<AdminDashboardStats | null> {
  try {
    const tenantHeaders = tenantId ? { 'X-Tenant-ID': tenantId } : undefined;
    let tenantName = '';
    if (tenantId) {
      try {
        tenantName = String(
          (await api.get(`/core/v1/tenants/${tenantId}`, { headers: tenantHeaders })).data.data
            ?.name ?? ''
        );
      } catch {
        /* dashboard data can render without tenant label */
      }
    }
    const eventResponse = await api.get('/features/v1/events/admin', {
      params: { page: 1, limit: 100 },
      headers: tenantHeaders,
    });
    const events = (eventResponse.data.data ?? []) as Array<Record<string, unknown>>;
    const registrationResponse = await api.get('/features/v1/registrations', {
      params: { page: 1, limit: 100 },
      headers: tenantHeaders,
    });
    const registrations = (registrationResponse.data.data ?? []) as Array<Record<string, unknown>>;
    const payments = await Promise.all(
      registrations.map(async (registration) => {
        try {
          const response = await api.get(
            `/features/v1/payments/registration/${String(registration.id)}`,
            { headers: tenantHeaders }
          );
          return response.data.data as Record<string, unknown>;
        } catch {
          return null;
        }
      })
    );
    const globalEventResponse = await api.get('/features/v1/events/admin', {
      params: { page: 1, limit: 100 },
      headers: { 'X-Skip-Tenant': 'true' },
    });
    const globalRegistrationResponse = await api.get('/features/v1/registrations', {
      params: { page: 1, limit: 100 },
      headers: { 'X-Skip-Tenant': 'true' },
    });
    const globalEvents = (globalEventResponse.data.data ?? []) as Array<Record<string, unknown>>;
    const globalRegistrations = (globalRegistrationResponse.data.data ?? []) as Array<
      Record<string, unknown>
    >;
    const countByEvent = new Map<string, number>();
    for (const registration of registrations) {
      const eventId = String(registration.event_id ?? '');
      countByEvent.set(eventId, (countByEvent.get(eventId) ?? 0) + 1);
    }
    const toNumber = (value: unknown) => Number(value ?? 0);
    const popularEvents = events
      .map((event) => ({
        id: String(event.id),
        title: String(event.title ?? ''),
        slug: String(event.slug ?? ''),
        quota: toNumber(event.quota),
        price: toNumber(event.price),
        _count: { registrations: countByEvent.get(String(event.id)) ?? 0 },
        tenant_name: String((event.tenant as Record<string, unknown> | null)?.name ?? ''),
        tenant_type: String((event.tenant as Record<string, unknown> | null)?.type ?? ''),
      }))
      .sort((a, b) => b._count.registrations - a._count.registrations);
    const globalCounts = new Map<string, number>();
    globalRegistrations.forEach((registration) => {
      const eventId = String(registration.event_id ?? '');
      globalCounts.set(eventId, (globalCounts.get(eventId) ?? 0) + 1);
    });
    const globalPopularEvents = globalEvents
      .map((event) => ({
        id: String(event.id),
        title: String(event.title ?? ''),
        slug: String(event.slug ?? ''),
        quota: toNumber(event.quota),
        price: toNumber(event.price),
        _count: { registrations: globalCounts.get(String(event.id)) ?? 0 },
        tenant_name: String((event.tenant as Record<string, unknown> | null)?.name ?? ''),
        tenant_type: String((event.tenant as Record<string, unknown> | null)?.type ?? ''),
      }))
      .sort((a, b) => b._count.registrations - a._count.registrations);
    const recentRegistrations = registrations
      .sort((a, b) => String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')))
      .slice(0, 10)
      .map((registration) => ({
        id: String(registration.id),
        registrationNumber: String(registration.registration_number ?? ''),
        createdAt: new Date(String(registration.created_at)),
        status: String(registration.status ?? ''),
        user: {
          name: (registration.user_name as string | null) ?? null,
          email: String(registration.user_email ?? ''),
        },
        event: {
          title: String(registration.event_title ?? ''),
          price: toNumber(registration.price),
        },
        payment: null,
      }));
    const statusCount = (status: string) =>
      registrations.filter((item) => item.status === status).length;
    return {
      counts: {
        events: {
          total: events.length,
          draft: events.filter((event) => event.status === 'DRAFT').length,
          published: events.filter((event) => event.status === 'PUBLISHED').length,
          closed: events.filter((event) => event.status === 'CLOSED').length,
          completed: events.filter((event) => event.status === 'COMPLETED').length,
        },
        registrations: {
          total: registrations.length,
          uniqueParticipants: new Set(registrations.map((item) => item.user_id)).size,
        },
        revenue: payments
          .filter((payment) => payment?.status === 'PAID')
          .reduce((sum, payment) => sum + toNumber(payment?.amount), 0),
        checkIns: registrations.filter(
          (item) => item.attendance_status === 'SUCCESS' || item.status === 'CHECKED_IN'
        ).length,
        certificates: statusCount('ISSUED'),
      },
      popularEvents,
      globalPopularEvents,
      recentRegistrations,
      tenantName,
    };
  } catch {
    return null;
  }
}

export async function getParticipantDashboardData(): Promise<ParticipantDashboardStats | null> {
  if (!(await verifySession())) return null;
  try {
    const registrations = ((
      await api.get('/features/v1/registrations/me', { params: { limit: 100 } })
    ).data.data ?? []) as Array<Record<string, unknown>>;
    const history = registrations.map((registration) => ({
      id: String(registration.id ?? ''),
      registrationNumber: String(registration.registration_number ?? ''),
      createdAt: new Date(String(registration.created_at ?? '')),
      status: String(registration.status ?? ''),
      event: {
        id: String(registration.event_id ?? ''),
        title: String(registration.event_title ?? 'Event tidak tersedia'),
        slug: String(registration.event_slug ?? ''),
        startDate: new Date(String(registration.event_start_date ?? '')),
        startTime: '',
        endTime: '',
        location: String(registration.event_location ?? ''),
        status: String(registration.event_status ?? ''),
        certificateEnabled: registration.certificate_status !== 'TIDAK TERSEDIA',
        eventType: String(registration.event_type ?? ''),
        meetingLink: null,
      },
      attendances: [{ status: String(registration.attendance_status ?? '') }],
      certificates: [],
    })) as ParticipantDashboardStats['history'];
    const upcoming = history.find((item: ParticipantDashboardStats['history'][number]) =>
      ['REGISTERED', 'CHECKED_IN'].includes(item.status)
    );
    const upcomingEvent = upcoming?.event ?? null;
    return {
      upcomingEvent:
        upcomingEvent && upcoming
          ? {
              ...upcomingEvent,
              id: upcoming.id,
              description: '',
              banner: null,
              endDate: upcomingEvent.startDate,
              qrToken: null,
              registrationNumber: upcoming.registrationNumber,
            }
          : null,
      history,
      summary: {
        totalRegistered: history.length,
        totalCheckedIn: history.filter(
          (item: ParticipantDashboardStats['history'][number]) => item.status === 'CHECKED_IN'
        ).length,
        totalPendingPayment: history.filter(
          (item: ParticipantDashboardStats['history'][number]) => item.status === 'WAITING_PAYMENT'
        ).length,
        pendingTestimonials: 0,
      },
    };
  } catch {
    return null;
  }
}
