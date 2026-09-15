'use server';

import api from '@/lib/api';

export async function updateUserName(name: string) {
  try {
    await api.put('/core/v1/users/me', { full_name: name.trim() });
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal memperbarui nama.' };
  }
}

export async function updateUserEmail(newEmail: string) {
  try {
    await api.put('/core/v1/users/me', { email: newEmail.trim().toLowerCase() });
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal memperbarui email.' };
  }
}
