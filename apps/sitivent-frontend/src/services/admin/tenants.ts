'use server';

import axios from 'axios';
import api from '@/lib/api';

export interface AdminTenantRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: string;
  parentId?: string;
  depth?: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  parentName: string;
  createdAt: string;
}

export interface TenantPaginationResponse {
  success: boolean;
  data: AdminTenantRow[];
  meta: { total: number; page: number; lastPage: number };
}

export interface TenantPaymentGateway {
  provider: 'IPAYMU' | 'MANUAL';
  is_active: boolean;
  api_key?: string;
  virtual_account?: string;
  env: 'sandbox' | 'production';
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  has_api_key?: boolean;
}

export async function getTenants(
  page = 1,
  limit = 10,
  search = '',
  includeDeleted = false
): Promise<TenantPaginationResponse> {
  try {
    const response = await api.get('/core/v1/tenants', {
      params: { page, limit, search, include_deleted: includeDeleted },
    });
    const body = response.data;
    const tenants = (body.data ?? []) as Record<string, unknown>[];
    const parentIds = [
      ...new Set(
        tenants
          .map((tenant) => (typeof tenant.parent_id === 'string' ? tenant.parent_id : ''))
          .filter(Boolean)
      ),
    ];
    const parentEntries = await Promise.all(
      parentIds.map(async (id) => {
        try {
          const parentResponse = await api.get(`/core/v1/tenants/${id}`);
          return [id, String(parentResponse.data?.data?.name ?? '-')] as const;
        } catch {
          return [id, '-'] as const;
        }
      })
    );
    const parentNames = new Map(parentEntries);
    const rows = tenants.map((tenant) => ({
      id: String(tenant.id),
      name: String(tenant.name ?? '-'),
      slug: String(tenant.slug ?? '-'),
      code: String(tenant.code ?? '-'),
      type: String(tenant.type ?? '-'),
      parentId: typeof tenant.parent_id === 'string' ? tenant.parent_id : undefined,
      parentName: String(
        (tenant.parent as Record<string, unknown> | null)?.name ??
          (typeof tenant.parent_id === 'string' ? parentNames.get(tenant.parent_id) : undefined) ??
          '-'
      ),
      createdAt: String(tenant.created_at ?? tenant.createdAt ?? ''),
    }));
    const total = Number(body.pagination?.total ?? rows.length);
    return {
      success: true,
      data: rows,
      meta: { total, page, lastPage: Math.max(1, Math.ceil(total / limit)) },
    };
  } catch {
    return { success: false, data: [], meta: { total: 0, page, lastPage: 1 } };
  }
}

export async function createTenant(values: Record<string, unknown>) {
  try {
    const result = await api.post('/core/v1/tenants', values);
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal membuat tenant.' };
  }
}
export async function getTenant(id: string) {
  try {
    const result = await api.get(`/core/v1/tenants/${id}`);
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal mengambil data tenant.' };
  }
}
export async function updateTenant(id: string, values: Record<string, unknown>) {
  try {
    const result = await api.put(`/core/v1/tenants/${id}`, values);
    return { success: true, data: result.data.data };
  } catch {
    return { success: false, error: 'Gagal memperbarui tenant.' };
  }
}
export async function deleteTenant(id: string) {
  try {
    await api.delete(`/core/v1/tenants/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus tenant.' };
  }
}
export async function permanentlyDeleteTenant(id: string) {
  try {
    await api.delete(`/core/v1/tenants/${id}/permanent`);
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === 'string' && message) return { success: false, error: message };
    }
    return { success: false, error: 'Gagal menghapus tenant secara permanen.' };
  }
}
export async function getTenantPaymentGateway(id: string) {
  try {
    const result = await api.get(`/core/v1/tenants/${id}/payment-gateway`);
    return { success: true, data: result.data.data as TenantPaymentGateway | null };
  } catch {
    return { success: false, error: 'Gagal mengambil pengaturan payment gateway.' };
  }
}
export async function updateTenantPaymentGateway(id: string, values: TenantPaymentGateway) {
  try {
    const result = await api.put(`/core/v1/tenants/${id}/payment-gateway`, values);
    return { success: true, data: result.data.data as TenantPaymentGateway };
  } catch {
    return { success: false, error: 'Gagal menyimpan pengaturan payment gateway.' };
  }
}
