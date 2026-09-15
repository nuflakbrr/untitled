'use server';

import api from '@/lib/api';
import { sendPasswordChangeNotificationEmail } from '@/services/public/auth';

export async function updateUserProfile(name: string, image?: string | null) {
  try {
    await api.put('/core/v1/users/me', { name: name.trim(), image: image ?? null });
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal memperbarui nama.' };
  }
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  try {
    await api.post('/core/v1/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return { success: true };
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    return {
      success: false,
      error: status === 400 ? 'Password saat ini salah.' : 'Gagal mengganti password.',
    };
  }
}

export async function changeParticipantPassword(currentPassword: string, newPassword: string) {
  const result = await changeUserPassword(currentPassword, newPassword);
  if (!result.success) return result;

  await sendPasswordChangeNotificationEmail();
  return result;
}

export async function deactivateParticipantAccount() {
  try {
    await api.delete('/core/v1/users/me');
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menangguhkan akun.' };
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
