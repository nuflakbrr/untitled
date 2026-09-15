'use server';

import { queueEmail } from '@/services/public/emails';

export async function subscribeNewsletter(email: string) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Silakan masukkan alamat email yang valid.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    const res = await queueEmail(cleanEmail);
    if (!res.success) {
      return { success: false, message: res.error || 'Gagal mendaftar newsletter.' };
    }

    return { success: true, message: 'Berhasil berlangganan! Cek email Anda untuk konfirmasi.' };
  } catch (error) {
    console.error('Subscribe Newsletter Error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem saat mendaftar newsletter.' };
  }
}
