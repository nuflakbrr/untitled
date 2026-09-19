'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTenantId } from '@/hooks/useTenantId';
import {
  tenantSchema,
  type TenantValues,
  tenantPaymentGatewaySchema,
  type TenantPaymentGatewayValues,
} from '@/schemas/tenants';
import {
  getTenant,
  createTenant,
  updateTenant,
  getTenantPaymentGateway,
  updateTenantPaymentGateway,
} from '@/services/admin/tenants';

export function useTenantForm(id: string) {
  const router = useRouter();
  const tenantId = useTenantId();
  const isNew = id === 'new';
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const tenantForm = useForm<TenantValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: '', slug: '', code: '', type: 'FACULTY' },
  });
  const gatewayForm = useForm<TenantPaymentGatewayValues>({
    resolver: zodResolver(tenantPaymentGatewaySchema),
    defaultValues: {
      provider: 'IPAYMU',
      is_active: false,
      env: 'sandbox',
      api_key: '',
      virtual_account: '',
    },
  });

  useEffect(() => {
    if (isNew) return;

    let cancelled = false;
    setIsLoading(true);
    getTenant(id).then(async (result) => {
      if (cancelled) return;
      if (!result.success || !result.data) {
        setError(result.error ?? 'Tenant tidak ditemukan.');
        setIsLoading(false);
        return;
      }

      tenantForm.reset({
        name: result.data.name ?? '',
        slug: result.data.slug ?? '',
        code: result.data.code ?? '',
        type: (result.data.type as TenantValues['type']) ?? 'FACULTY',
      });
      const gatewayResult = await getTenantPaymentGateway(id);
      if (!cancelled && gatewayResult.success && gatewayResult.data) {
        gatewayForm.reset({ ...gatewayForm.getValues(), ...gatewayResult.data });
      }
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [gatewayForm, id, isNew, tenantForm]);

  const submit = async (values: TenantValues) => {
    const result = isNew ? await createTenant(values) : await updateTenant(id, values);
    if (!result.success) {
      setError(result.error ?? (isNew ? 'Gagal membuat tenant.' : 'Gagal memperbarui tenant.'));
      return;
    }
    router.push(`/admin/${tenantId}/managements/tenants`);
    router.refresh();
  };

  const submitGateway = async (values: TenantPaymentGatewayValues) => {
    const result = await updateTenantPaymentGateway(id, values);
    if (!result.success) setError(result.error ?? 'Gagal menyimpan payment gateway.');
  };

  return { isNew, error, isLoading, tenantForm, gatewayForm, submit, submitGateway };
}
