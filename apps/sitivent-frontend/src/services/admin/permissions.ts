'use server';

import type { z } from 'zod';
import type { permissionSchema } from '@/schemas/permissions';
import type {
  PermissionResponse,
  PermissionPaginationResponse,
} from '@/interfaces/features/permissions';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';

export type PermissionValues = z.infer<typeof permissionSchema>;
const endpoint = '/core/v1/permissions';
const path = '/admin/managements/permissions';
export async function getPermissions(
  page = 1,
  limit = 10,
  search = ''
): Promise<PermissionPaginationResponse> {
  try {
    const body = (await api.get('/core/v1/roles/permissions', { params: { limit: 1000 } })).data;
    const allPermissions = (body.data ?? []) as PermissionPaginationResponse['data'];
    const filtered = search
      ? allPermissions.filter((permission) =>
          permission.name.toLowerCase().includes(search.toLowerCase())
        )
      : allPermissions;
    const start = (page - 1) * limit;
    const total = filtered.length;
    return {
      success: true,
      data: filtered.slice(start, start + limit),
      meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
    };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}
export async function getPermissionByName(name: string): Promise<PermissionResponse> {
  try {
    return { success: true, data: (await api.get(`${endpoint}/${name}`)).data.data };
  } catch {
    return { success: false, error: 'Permission tidak ditemukan.' };
  }
}
export async function createPermission(values: PermissionValues): Promise<PermissionResponse> {
  try {
    const result = await api.post(endpoint, values);
    revalidatePath(path);
    return { success: true, data: result.data.data, message: 'Permission berhasil dibuat.' };
  } catch {
    return { success: false, error: 'Gagal membuat permission.' };
  }
}
export async function createBulkPermissions(
  values: PermissionValues[] | string,
  description = ''
): Promise<PermissionResponse> {
  try {
    const result = await api.post(`${endpoint}/bulk`, {
      permissions: Array.isArray(values) ? values : [{ name: values, description }],
    });
    revalidatePath(path);
    return { success: true, data: result.data.data, message: 'Permission berhasil dibuat.' };
  } catch {
    return { success: false, error: 'Gagal membuat permission.' };
  }
}
export async function updatePermission(
  id: string,
  values: PermissionValues
): Promise<PermissionResponse> {
  try {
    const result = await api.put(`${endpoint}/${id}`, values);
    revalidatePath(path);
    return { success: true, data: result.data.data, message: 'Permission berhasil diperbarui.' };
  } catch {
    return { success: false, error: 'Gagal memperbarui permission.' };
  }
}
export async function deletePermission(id: string): Promise<PermissionResponse> {
  try {
    await api.delete(`${endpoint}/${id}`);
    revalidatePath(path);
    return { success: true, message: 'Permission berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus permission.' };
  }
}
export async function deleteBulkPermissions(ids: string[]): Promise<PermissionResponse> {
  try {
    await Promise.all(ids.map((id) => api.delete(`${endpoint}/${id}`)));
    revalidatePath(path);
    return { success: true, message: 'Permission berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus permission.' };
  }
}
export async function getAllPermissions(): Promise<PermissionResponse> {
  try {
    return {
      success: true,
      data:
        (await api.get('/core/v1/roles/permissions', { params: { limit: 1000 } })).data.data ?? [],
    };
  } catch {
    return { success: false, error: 'Gagal mengambil permission.' };
  }
}
