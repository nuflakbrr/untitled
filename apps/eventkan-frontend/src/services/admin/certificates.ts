'use server';

import { revalidatePath } from 'next/cache';

import type {
  CertificateResponse,
  CertificateTemplateHeader,
  CertificateTemplateNumbering,
  CertificatePaginationResponse,
  CertificateTemplateAppearance,
  CertificateVerificationResponse,
} from '@/interfaces/features/certificates';

import api from '@/lib/api';

const endpoint = '/features/v1/certificates';
const path = '/admin/master/certificates';
export type CertTemplateUpsertInput = Partial<
  CertificateTemplateAppearance & CertificateTemplateHeader & CertificateTemplateNumbering
>;
export type SignatureInput = { name: string; title?: string; signatureUrl: string; order?: number };
export async function getCertificates(
  page = 1,
  limit = 5,
  search = '',
  eventId?: string
): Promise<CertificatePaginationResponse> {
  try {
    const body = (await api.get(endpoint, { params: { page, limit, search, event_id: eventId } }))
      .data;
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
export async function getParticipantCertificates(): Promise<CertificateResponse[]> {
  try {
    return ((await api.get(`${endpoint}/me`)).data.data ?? []).map(
      (item: Record<string, unknown>) => ({
        id: String(item.id ?? ''),
        certificateNumber: String(item.certificate_number ?? item.certificateNumber ?? ''),
        createdAt: new Date(String(item.issued_at ?? item.created_at ?? item.createdAt)),
        downloadTime: null,
        registration: { registrationNumber: String(item.registration_number ?? '') },
        event: {
          title: String(item.event_title ?? item.eventTitle ?? ''),
          slug: String(item.event_slug ?? ''),
        },
        user: {
          name: (item.participant_name as string | null) ?? null,
          email: String(item.participant_email ?? ''),
        },
        downloadUrl: String(item.download_url ?? item.downloadUrl ?? ''),
      })
    );
  } catch {
    return [];
  }
}
export async function generateCertificatesForEvent(eventId: string): Promise<any> {
  try {
    return {
      success: true,
      data: (await api.post(`${endpoint}/generate`, { event_id: eventId })).data.data,
    };
  } catch {
    return { success: false, error: 'Gagal membuat sertifikat.' };
  }
}
export async function getCertificateById(
  id: string
): Promise<CertificateVerificationResponse | null> {
  try {
    const item = (await api.get(`${endpoint}/verify/${id}`)).data.data;

    return {
      id: String(item.id ?? ''),
      registrationId: String(item.registration_id ?? item.registrationId ?? ''),
      eventId: String(item.event_id ?? item.eventId ?? ''),
      certificateNumber: String(item.certificate_number ?? item.certificateNumber ?? ''),
      participantName: String(item.participant_name ?? item.participantName ?? ''),
      participantEmail: String(item.participant_email ?? item.participantEmail ?? ''),
      eventTitle: String(item.event_title ?? item.eventTitle ?? ''),
      eventLocation: String(item.event_location ?? item.eventLocation ?? ''),
      issuerFaculty: String(item.issuer_faculty ?? item.issuerFaculty ?? ''),
      eventDate: new Date(String(item.event_date ?? item.eventDate)),
      pdfUrl: String(item.pdf_url ?? item.pdfUrl ?? ''),
      downloadUrl: String(item.download_url ?? item.downloadUrl ?? ''),
      signatures: Array.isArray(item.signatures)
        ? item.signatures.map((signature: Record<string, unknown>) => ({
            id: String(signature.id ?? ''),
            name: String(signature.name ?? ''),
            title: (signature.title as string | null) ?? null,
            signatureUrl: String(signature.signature_url ?? signature.signatureUrl ?? ''),
            order: Number(signature.order ?? 0),
          }))
        : [],
      issuedAt: new Date(String(item.issued_at ?? item.issuedAt)),
    };
  } catch {
    return null;
  }
}
export async function updateDownloadTime(id: string): Promise<any> {
  try {
    return { success: true, data: (await api.patch(`${endpoint}/${id}/downloaded`)).data.data };
  } catch {
    return { success: false };
  }
}
export async function getCompletedEventsWithCertStats() {
  try {
    return (
      (
        await api.get('/features/v1/events', {
          params: { status: 'COMPLETED', certificate_enabled: true, limit: 100 },
        })
      ).data.data ?? []
    );
  } catch {
    return [];
  }
}
export async function getCertificateTemplate(eventId: string): Promise<any> {
  try {
    return { success: true, data: (await api.get(`${endpoint}/templates/${eventId}`)).data.data };
  } catch {
    return { success: false, error: 'Template tidak ditemukan.' };
  }
}
export async function upsertCertificateTemplate(
  eventId: string,
  input: CertTemplateUpsertInput
): Promise<any> {
  try {
    const result = await api.put(`${endpoint}/templates/${eventId}`, input);
    revalidatePath(path);
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal menyimpan template.' };
  }
}
export async function addSignature(templateId: string, input: SignatureInput): Promise<any> {
  try {
    return {
      success: true,
      data: (await api.post(`${endpoint}/templates/${templateId}/signatures`, input)).data.data,
    };
  } catch {
    return { success: false, error: 'Gagal menambah tanda tangan.' };
  }
}
export async function updateSignature(
  signatureId: string,
  input: Partial<SignatureInput>
): Promise<any> {
  try {
    return {
      success: true,
      data: (await api.put(`${endpoint}/signatures/${signatureId}`, input)).data.data,
    };
  } catch {
    return { success: false, error: 'Gagal memperbarui tanda tangan.' };
  }
}
export async function deleteSignature(signatureId: string): Promise<any> {
  try {
    await api.delete(`${endpoint}/signatures/${signatureId}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus tanda tangan.' };
  }
}
export async function reorderSignatures(orderedIds: string[]) {
  try {
    await api.patch(`${endpoint}/signatures/reorder`, { ids: orderedIds });
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal mengurutkan tanda tangan.' };
  }
}
export async function deleteCertificate(id: string): Promise<any> {
  try {
    await api.delete(`${endpoint}/${id}`);
    revalidatePath(path);
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus sertifikat.' };
  }
}
export async function getEventsWithCertificateEnabled() {
  try {
    return (
      (await api.get('/features/v1/events', { params: { certificate_enabled: true, limit: 100 } }))
        .data.data ?? []
    );
  } catch {
    return [];
  }
}
export async function generateCertificatesForAllEvents() {
  try {
    return { success: true, data: (await api.post(`${endpoint}/generate-all`)).data.data };
  } catch {
    return { success: false, error: 'Gagal membuat sertifikat.' };
  }
}
export async function checkUserIsAdmin() {
  return true;
}
