'use server';

import api from '@/lib/api';

export async function queueEmail(to: string, ..._legacyArgs: unknown[]) {
  try {
    await api.post('/features/v1/emails/newsletter/subscribe', { email: to });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mengirim email.' };
  }
}

export async function processEmailQueue() {
  return { success: true };
}
