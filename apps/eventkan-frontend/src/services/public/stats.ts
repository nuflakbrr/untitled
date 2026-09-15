'use server';

import type { PublicStats } from '@/interfaces/features/dashboard';

import api from '@/lib/api';

export async function getPublicStats(): Promise<PublicStats> {
  try {
    const result = await api.get('/features/v1/dashboard/stats');
    return {
      events: Number(result.data.data?.events ?? 0),
      registrations: Number(result.data.data?.registrations ?? 0),
      certificates: Number(result.data.data?.certificates ?? 0),
    };
  } catch {
    return { events: 0, registrations: 0, certificates: 0 };
  }
}
