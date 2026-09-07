'use server';

import api from '@/lib/api';

const endpoints: Record<string, string> = {
  'event-categories': '/features/v1/event-categories',
  events: '/features/v1/events',
  articles: '/features/v1/articles',
  galleries: '/features/v1/galleries',
  certificates: '/features/v1/certificates',
  registrations: '/features/v1/registrations',
  payments: '/features/v1/payments',
  users: '/core/v1/users',
  roles: '/core/v1/roles',
  permissions: '/core/v1/permissions',
  tenants: '/core/v1/tenants',
};

export async function resolveLabel(id: string, parentSegment: string): Promise<string | null> {
  const endpoint = endpoints[parentSegment];
  if (!endpoint) return null;
  try {
    if (parentSegment === 'event-categories') {
      const response = await api.get(endpoint, { params: { page: 1, limit: 1000 } });
      const item = (response.data.data ?? []).find(
        (category: { id?: string }) => category.id === id
      );
      return item?.name ?? null;
    }
    const item = (await api.get(`${endpoint}/${id}`)).data.data;
    return item?.name ?? item?.title ?? item?.certificateNumber ?? item?.registrationNumber ?? null;
  } catch {
    return null;
  }
}
