'use server';

import api from '@/lib/api';

const endpoint = '/features/v1/payments';
export async function getPaymentsFromRegistrations(
  page = 1,
  limit = 10,
  search = '',
  tenantId?: string
) {
  try {
    const body = (
      await api.get('/features/v1/registrations', {
        params: { page, limit, search, tenant_id: tenantId },
      })
    ).data;
    const rows = await Promise.all(
      (body.data ?? []).map(async (registration: Record<string, unknown>) => {
        try {
          const payment = (await api.get(`${endpoint}/registration/${registration.id}`)).data.data;
          return {
            ...payment,
            registration: {
              id: registration.id,
              registrationNumber: registration.registration_number,
              user: {
                id: registration.user_id,
                name: registration.user_name,
                email: registration.user_email,
              },
              event: {
                id: registration.event_id,
                title: registration.event_title,
                price: registration.price,
              },
            },
          };
        } catch {
          return null;
        }
      })
    );
    const data = rows.filter(Boolean);
    const total = body.pagination?.total ?? data.length;
    return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 1 } };
  }
}
export async function getParticipantPayments() {
  try {
    const registrations =
      (await api.get('/features/v1/registrations/me', { params: { limit: 100 } })).data.data ?? [];
    const payments = await Promise.all(
      registrations.map(async (registration: Record<string, unknown>) => {
        try {
          const payment = (await api.get(`${endpoint}/registration/${String(registration.id)}`))
            .data.data;
          return {
            ...payment,
            registration: {
              id: registration.id,
              registrationNumber: registration.registration_number,
              status: registration.status,
              event: {
                id: registration.event_id,
                title: registration.event_title,
                slug: registration.event_slug,
              },
            },
          };
        } catch {
          return null;
        }
      })
    );
    return payments.filter(Boolean);
  } catch {
    return [];
  }
}
export async function getPayments(page = 1, limit = 10, search = '') {
  try {
    const body = (await api.get(endpoint, { params: { page, limit, search } })).data;
    const total = body.pagination?.total ?? body.data?.length ?? 0;
    return {
      success: true,
      data: body.data ?? [],
      meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
    };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}
