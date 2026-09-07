'use server';

import type { z } from 'zod';
import type { roleSchema } from '@/schemas/roles';
import type { RoleResponse, RolePaginationResponse } from '@/interfaces/features/roles';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';

export type RoleValues = z.infer<typeof roleSchema>;
const path = '/admin/managements/roles';
const roles = '/core/v1/roles';
const list = async (page: number, limit: number, search: string): Promise<RolePaginationResponse> => { try { const body = (await api.get(roles, { params: { page, limit, search } })).data; const allPermissions = (await api.get('/core/v1/roles/permissions', { params: { limit: 1000 } })).data.data ?? []; const data = await Promise.all((body.data ?? []).map(async (role: { id: string; permissions?: { id: string; name: string }[] }) => { if (role.permissions?.length) return role; const permissionIDs = (await api.get(`${roles}/${role.id}/permissions`)).data.data ?? []; return { ...role, permissions: permissionIDs.map((id: string) => allPermissions.find((permission: { id: string }) => permission.id === id)).filter(Boolean) }; })); const total = body.pagination?.total ?? data.length; return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } }; } catch { return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } }; } };
export async function getRoles(page = 1, limit = 10, search = '') { return list(page, limit, search); }
export async function getRoleByName(name: string): Promise<RoleResponse> { try { return { success: true, data: (await api.get(`${roles}/${name}`)).data.data }; } catch { return { success: false, error: 'Role tidak ditemukan.' }; } }
export async function getRoleById(id: string): Promise<RoleResponse> { try { const role = (await api.get(`${roles}/${id}`)).data.data; const [permissionIDs, permissionResponse] = await Promise.all([api.get(`${roles}/${id}/permissions`), api.get('/core/v1/roles/permissions', { params: { limit: 1000 } })]); const ids = permissionIDs.data.data ?? []; const permissions = (permissionResponse.data.data ?? []).filter((permission: { id: string }) => ids.includes(permission.id)); return { success: true, data: { ...role, permissions } }; } catch { return { success: false, error: 'Role tidak ditemukan.' }; } }
export async function createRole(values: RoleValues): Promise<RoleResponse> { try { const result = await api.post(roles, values); revalidatePath(path); return { success: true, data: result.data.data, message: 'Role berhasil dibuat.' }; } catch { return { success: false, error: 'Gagal membuat role.' }; } }
export async function updateRole(name: string, values: RoleValues): Promise<RoleResponse> { return updateRoleById(name, values); }
export async function updateRoleById(id: string, values: RoleValues): Promise<RoleResponse> { try { const result = await api.put(`${roles}/${id}`, values); revalidatePath(path); return { success: true, data: result.data.data, message: 'Role berhasil diperbarui.' }; } catch { return { success: false, error: 'Gagal memperbarui role.' }; } }
export async function deleteRole(id: string): Promise<RoleResponse> { try { await api.delete(`${roles}/${id}`); revalidatePath(path); return { success: true, message: 'Role berhasil dihapus.' }; } catch { return { success: false, error: 'Gagal menghapus role.' }; } }
