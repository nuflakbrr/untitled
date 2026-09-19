'use server';

import api from '@/lib/api';

export async function confirmOnlineAttendance(registrationId: string): Promise<any> {
  try {
    return {
      success: true,
      message: 'Kehadiran berhasil dikonfirmasi.',
      data: (await api.post('/features/v1/attendances/scan', { registration_id: registrationId }))
        .data.data,
    };
  } catch {
    return {
      success: false,
      message: 'Gagal mengonfirmasi kehadiran.',
      error: 'Gagal mengonfirmasi kehadiran.',
    };
  }
}

export type AttendanceProofStatus = 'APPROVED' | 'REJECTED';

export async function submitAttendanceProof(registrationId: string, proofUrl: string) {
  try {
    await api.post(`/features/v1/registrations/${registrationId}/attendance-proof`, {
      proof_url: proofUrl,
    });
    return { success: true, message: 'Bukti kehadiran berhasil dikirim.' };
  } catch {
    return { success: false, error: 'Gagal mengirim bukti kehadiran.' };
  }
}

export async function reviewAttendanceProof(
  registrationId: string,
  status: AttendanceProofStatus
) {
  try {
    await api.patch(`/features/v1/registrations/${registrationId}/attendance-proof`, { status });
    return { success: true, message: 'Bukti kehadiran berhasil diperbarui.' };
  } catch {
    return { success: false, error: 'Gagal memperbarui bukti kehadiran.' };
  }
}
export async function scanQrCode(qrToken: string): Promise<any> {
  try {
    return {
      success: true,
      message: 'QR code berhasil dipindai.',
      data: (await api.post('/features/v1/attendances/scan', { qr_token: qrToken })).data.data,
    };
  } catch {
    return { success: false, message: 'QR code tidak valid.', error: 'QR code tidak valid.' };
  }
}
export async function getRecentAttendanceLogs() {
  return [];
}
