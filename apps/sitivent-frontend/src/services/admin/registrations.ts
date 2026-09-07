'use server';

import type { Registration, RegistrationPaginationResponse } from '@/interfaces/features/registrations';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';

const endpoint = '/features/v1/registrations';
function normalizeRegistration(item: Record<string, unknown>): Registration {
  return {
    ...item,
    eventId: item.eventId ?? item.event_id,
    userId: item.userId ?? item.user_id,
    registrationNumber: item.registrationNumber ?? item.registration_number,
    createdAt: new Date(String(item.createdAt ?? item.created_at)),
    updatedAt: new Date(String(item.updatedAt ?? item.updated_at)),
    deletedAt: item.deletedAt ?? item.deleted_at ? new Date(String(item.deletedAt ?? item.deleted_at)) : null,
    user: { id: String(item.userId ?? item.user_id), name: item.userName ?? item.user_name ?? null, email: String(item.userEmail ?? item.user_email ?? '') },
    event: { id: String(item.eventId ?? item.event_id), title: String(item.eventTitle ?? item.event_title ?? '-'), price: Number(item.price ?? 0), startDate: new Date(String(item.eventStartDate ?? item.event_start_date)) },
  } as Registration;
}
export async function getParticipantRegistrations() { try { return ((await api.get(`${endpoint}/me`)).data.data ?? []).map(normalizeRegistration); } catch { return []; } }
export async function getRegistrations(page = 1, limit = 10, search = '', eventId?: string, status?: string): Promise<RegistrationPaginationResponse> { try { const body = (await api.get(endpoint, { params: { page, limit, search, event_id: eventId, status } })).data; const data = (body.data ?? []).map(normalizeRegistration); const total = body.pagination?.total ?? data.length; return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } }; } catch { return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } }; } }
export async function getEventsForFilter() { try { const items = (await api.get('/features/v1/events', { params: { limit: 100 } })).data.data ?? []; return items.map((item: Record<string, unknown>) => ({ id: item.id, title: item.title })); } catch { return []; } }
export async function exportRegistrationsData(search: string, eventId?: string, status?: string): Promise<any> { const result = await api.get(`${endpoint}/event/${eventId || 'all'}/export`, { params: { search, status }, responseType: 'blob' }); return { success: true, data: result.data }; }
export async function registerToEvent(eventId: string): Promise<any> { try { return { success: true, data: (await api.post(endpoint, { event_id: eventId })).data.data }; } catch { return { success: false, error: 'Gagal mendaftar event.' }; } }
export async function getEventRegistrationStatus(eventId: string): Promise<any> { try { return { success: true, data: (await api.get(`${endpoint}/event/${eventId}`)).data.data }; } catch { return { success: false, data: null }; } }
export async function cancelRegistration(registrationId: string): Promise<any> { try { await api.delete(`${endpoint}/${registrationId}`); revalidatePath('/participant/dashboard'); return { success: true }; } catch { return { success: false, error: 'Gagal membatalkan pendaftaran.' }; } }
export async function deleteRegistration(registrationId: string) { return cancelRegistration(registrationId); }
