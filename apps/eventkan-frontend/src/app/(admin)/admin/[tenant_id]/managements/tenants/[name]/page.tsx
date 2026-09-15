'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  getTenant,
  updateTenant,
  getTenantPaymentGateway,
  updateTenantPaymentGateway,
} from '@/services/admin/tenants';
import {
  tenantSchema,
  type TenantValues,
  tenantPaymentGatewaySchema,
  type TenantPaymentGatewayValues,
} from '@/schemas/tenants';

export default function TenantDetailPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const [error, setError] = useState('');
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
    getTenant(params.name).then(async (result) => {
      if (!result.success || !result.data) {
        setError(result.error ?? 'Tenant tidak ditemukan.');
        return undefined;
      }
      tenantForm.reset({
        name: result.data.name ?? '',
        slug: result.data.slug ?? '',
        code: result.data.code ?? '',
        type: (result.data.type as TenantValues['type']) ?? 'FACULTY',
      });
      const gatewayResult = await getTenantPaymentGateway(params.name);
      if (gatewayResult.success && gatewayResult.data)
        gatewayForm.reset({ ...gatewayForm.getValues(), ...gatewayResult.data });
      return undefined;
    });
  }, [params.name]);

  async function submit(values: TenantValues) {
    const result = await updateTenant(params.name, values);
    if (!result.success) {
      setError(result.error ?? 'Gagal memperbarui tenant.');
      return undefined;
    }
    router.push('..');
    router.refresh();
    return undefined;
  }

  async function submitGateway(values: TenantPaymentGatewayValues) {
    const result = await updateTenantPaymentGateway(params.name, values);
    if (!result.success) setError(result.error ?? 'Gagal menyimpan payment gateway.');
  }

  return (
    <section className="space-y-5">
      <Heading title="Ubah Tenant" description="Perbarui informasi organisasi atau unit kerja." />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <form onSubmit={tenantForm.handleSubmit(submit)}>
          <FieldGroup className="gap-4">
          <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.name}>
            <FieldLabel htmlFor="name">Nama Tenant</FieldLabel>
            <Input
              id="name"
              placeholder="Masukkan nama tenant"
              required
              {...tenantForm.register('name')}
            />
            {tenantForm.formState.errors.name && <FieldError errors={[tenantForm.formState.errors.name]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.slug}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              placeholder="Masukkan slug tenant"
              required
              {...tenantForm.register('slug')}
            />
            {tenantForm.formState.errors.slug && <FieldError errors={[tenantForm.formState.errors.slug]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.code}>
            <FieldLabel htmlFor="code">Kode Tenant</FieldLabel>
            <Input
              id="code"
              placeholder="Masukkan kode tenant"
              required
              {...tenantForm.register('code')}
            />
            {tenantForm.formState.errors.code && <FieldError errors={[tenantForm.formState.errors.code]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.type}>
            <FieldLabel htmlFor="type">Tipe Tenant</FieldLabel>
            <select
              id="type"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...tenantForm.register('type')}
            >
              <option value="ROOT">ROOT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
              <option value="UNIT">UNIT</option>
            </select>
            {tenantForm.formState.errors.type && <FieldError errors={[tenantForm.formState.errors.type]} />}
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">Simpan Perubahan</Button>
          </FieldGroup>
        </form>
        <form onSubmit={gatewayForm.handleSubmit(submitGateway)} className="rounded-lg border p-5">
          <FieldGroup className="gap-4">
          <div>
            <h2 className="text-lg font-semibold">Payment Gateway</h2>
            <p className="text-sm text-muted-foreground">
              Atur metode pembayaran untuk tenant ini.
            </p>
          </div>
          <Field orientation="horizontal" className="gap-2" data-invalid={!!gatewayForm.formState.errors.is_active}>
            <input
              id="gateway-active"
              type="checkbox"
              {...gatewayForm.register('is_active')}
            />
            <FieldLabel htmlFor="gateway-active">Aktifkan payment gateway</FieldLabel>
          </Field>
          <Field className="gap-2" data-invalid={!!gatewayForm.formState.errors.env}>
            <FieldLabel htmlFor="env">Environment</FieldLabel>
            <select
              id="env"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...gatewayForm.register('env')}
            >
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
            {gatewayForm.formState.errors.env && <FieldError errors={[gatewayForm.formState.errors.env]} />}
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="virtualAccount">Virtual Account</FieldLabel>
            <Input
              id="virtualAccount"
              {...gatewayForm.register('virtual_account')}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="apiKey">
              API Key {gatewayForm.getValues('has_api_key') && '(tersimpan, kosongkan jika tidak diubah)'}
            </FieldLabel>
            <Input
              id="apiKey"
              type="password"
              {...gatewayForm.register('api_key')}
            />
          </Field>
          <Button type="submit">Simpan Payment Gateway</Button>
          </FieldGroup>
        </form>
      </div>
    </section>
  );
}
