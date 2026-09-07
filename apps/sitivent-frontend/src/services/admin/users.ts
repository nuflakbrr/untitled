'use server';

import type { z } from 'zod';
import type { userSchema } from '@/schemas/users';
import type { User, UserResponse, UserPaginationResponse } from '@/interfaces/features/users';

import api from '@/lib/api';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type UserValues = z.infer<typeof userSchema>;
const endpoint = '/core/v1/users';
const normalizeUser = (user: Record<string, unknown>): User => {
  const role = typeof user.role === 'string' ? user.role : '';
  const roleId = typeof user.role_id === 'string' ? user.role_id : null;
  return {
    ...user,
    roleId,
    roles: Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : role
        ? [{ id: roleId ?? `role-${role}`, name: role }]
        : [],
  } as unknown as User;
};
export async function getUsers(page = 1, limit = 10, search = ''): Promise<UserPaginationResponse> { try { const body = (await api.get(endpoint, { params: { page, limit, search, exclude_role: 'peserta' } })).data; const total = body.pagination?.total ?? body.data?.length ?? 0; return { success: true, data: (body.data ?? []).map(normalizeUser), meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } }; } catch { return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } }; } }
export async function getUserById(id: string): Promise<UserResponse> { try { return { success: true, data: normalizeUser((await api.get(`${endpoint}/${id}`)).data.data) }; } catch { return { success: false, error: 'User tidak ditemukan.' }; } }
export async function getParticipantUser(id: string) { return getUserById(id); }
export async function createUser(values: UserValues): Promise<UserResponse> { try { const result = await api.post(endpoint, { ...values, full_name: values.name }); revalidatePath('/admin/managements/users'); return { success: true, data: result.data.data, message: 'User berhasil dibuat.' }; } catch { return { success: false, error: 'Gagal membuat user.' }; } }
export async function updateUser(id: string, values: UserValues): Promise<UserResponse> { try { const result = await api.put(`${endpoint}/${id}`, { ...values, full_name: values.name }); revalidatePath('/admin/managements/users'); return { success: true, data: result.data.data, message: 'User berhasil diperbarui.' }; } catch { return { success: false, error: 'Gagal memperbarui user.' }; } }
export async function deleteUser(id: string): Promise<UserResponse> { try { await api.delete(`${endpoint}/${id}`); revalidatePath('/admin/managements/users'); return { success: true, message: 'User berhasil dihapus.' }; } catch { return { success: false, error: 'Gagal menghapus user.' }; } }
export async function banUser(id: string): Promise<UserResponse> { try { await api.post(`${endpoint}/${id}/ban`, { reason: 'Diblokir oleh administrator.' }); revalidatePath('/admin/managements/users'); return { success: true, message: 'User berhasil diban.' }; } catch { return { success: false, error: 'Gagal memban user.' }; } }
export async function unbanUser(id: string): Promise<UserResponse> { try { await api.post(`${endpoint}/${id}/unban`); revalidatePath('/admin/managements/users'); return { success: true, message: 'User berhasil di-unban.' }; } catch { return { success: false, error: 'Gagal melakukan unban user.' }; } }
export async function getCurrentUserData() { const session = await auth.api.getSession(); return { permissions: session?.permissions ?? [], roles: session?.roles ?? [] }; }
