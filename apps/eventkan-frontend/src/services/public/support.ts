'use server';

import type {
  CreateSupportMessageInput,
  SupportMessageMutationResponse,
} from '@/interfaces/features/support';

import api from '@/lib/api';
import { supportMessageSchema } from '@/schemas/support';

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
