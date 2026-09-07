'use server';

import type {
  SupportMessagesResponse,
  CreateSupportMessageInput,
  SupportMessageMutationResponse,
} from '@/interfaces/features/support';

import api from '@/lib/api';
import { supportMessageSchema } from '@/schemas/support';
import { verifyPermission } from '@/services/admin/security';

export async function createSupportMessageAction(
  values: CreateSupportMessageInput
): Promise<SupportMessageMutationResponse> {
  const parsed = supportMessageSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Data input tidak valid.' };
  try {
    const result = await api.post('/features/v1/support-messages', parsed.data);
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal mengirim pengaduan.' };
  }
}

export async function getSupportMessagesAction(
  page = 1,
  limit = 10,
  search = '',
  status = 'ALL'
): Promise<SupportMessagesResponse> {
  if (!(await verifyPermission('support.read'))) return { success: false, error: 'Akses ditolak.' };
  try {
    const result = await api.get('/features/v1/support-messages', {
      params: { page, limit, search, status: status === 'ALL' ? undefined : status },
    });
    const body = result.data;
    return {
      success: true,
      data: body.data ?? [],
      meta: {
        total: body.pagination?.total ?? 0,
        page,
        lastPage: Math.ceil((body.pagination?.total ?? 0) / limit) || 1,
      },
    };
  } catch {
    return { success: false, error: 'Gagal mengambil data pengaduan.' };
  }
}

export async function updateSupportMessageStatusAction(
  id: string,
  status: 'PENDING' | 'PROCESS' | 'RESOLVED'
): Promise<SupportMessageMutationResponse> {
  if (!(await verifyPermission('support.update')))
    return { success: false, error: 'Akses ditolak.' };
  try {
    const result = await api.patch(`/features/v1/support-messages/${id}/status`, { status });
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal memperbarui status pengaduan.' };
  }
}
