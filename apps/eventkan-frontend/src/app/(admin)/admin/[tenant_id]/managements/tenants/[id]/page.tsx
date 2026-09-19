'use client';

import { useParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { usePermission } from '@/providers/PermissionProvider';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { useTenantForm } from './_hooks/useTenantForm';

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = usePermission();
  const { isNew, error, isLoading, tenantForm, gatewayForm, submit, submitGateway } = useTenantForm(id);

  if (!isNew && isLoading) {
    return <div className="flex items-center justify-center py-16 text-eventkan-muted">Memuat tenant...</div>;
  }

  return (
    <section className="mx-auto w-full max-w-375 space-y-5">
      <Heading
        variant="soft"
        title={isNew ? 'Tambah Tenant' : 'Ubah Tenant'}
        description={
          isNew ? 'Buat organisasi atau unit kerja baru.' : 'Perbarui informasi organisasi atau unit kerja.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <form onSubmit={tenantForm.handleSubmit(submit)}>
          <FieldGroup className="gap-4">
            <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.name}>
              <FieldLabel htmlFor="name">Nama Tenant</FieldLabel>
              <Input id="name" placeholder="Masukkan nama tenant" required {...tenantForm.register('name')} />
              {tenantForm.formState.errors.name && <FieldError errors={[tenantForm.formState.errors.name]} />}
            </Field>
            <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" placeholder="Masukkan slug tenant" required {...tenantForm.register('slug')} />
              {tenantForm.formState.errors.slug && <FieldError errors={[tenantForm.formState.errors.slug]} />}
            </Field>
            <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.code}>
              <FieldLabel htmlFor="code">Kode Tenant</FieldLabel>
              <Input id="code" placeholder="Masukkan kode tenant" required {...tenantForm.register('code')} />
              {tenantForm.formState.errors.code && <FieldError errors={[tenantForm.formState.errors.code]} />}
            </Field>
            <Field className="gap-2" data-invalid={!!tenantForm.formState.errors.type}>
              <FieldLabel htmlFor="type">Tipe Tenant</FieldLabel>
              <select id="type" className="h-10 w-full rounded-md border border-eventkan-ink/10 bg-eventkan-surface px-3 text-sm" {...tenantForm.register('type')}>
                <option value="ROOT">ROOT</option>
                <option value="FACULTY">FACULTY</option>
                <option value="DEPARTMENT">DEPARTMENT</option>
                <option value="UNIT">UNIT</option>
              </select>
              {tenantForm.formState.errors.type && <FieldError errors={[tenantForm.formState.errors.type]} />}
            </Field>
            {error && <p className="text-sm text-eventkan-peach-ink">{error}</p>}
            {hasPermission(isNew ? 'tenant.create' : 'tenant.update') && (
              <Button type="submit" className="bg-eventkan-navy text-white hover:bg-eventkan-navy-hover">
                {isNew ? 'Simpan' : 'Simpan Perubahan'}
              </Button>
            )}
          </FieldGroup>
        </form>

        {!isNew && hasPermission('tenant.update') && (
          <form onSubmit={gatewayForm.handleSubmit(submitGateway)} className="rounded-2xl border border-eventkan-ink/10 bg-eventkan-surface p-5">
            <FieldGroup className="gap-4">
              <div>
                <h2 className="text-lg font-semibold text-eventkan-ink">Payment Gateway</h2>
                <p className="text-sm text-eventkan-muted">Atur metode pembayaran untuk tenant ini.</p>
              </div>
              <Field orientation="horizontal" className="gap-2" data-invalid={!!gatewayForm.formState.errors.is_active}>
                <input id="gateway-active" type="checkbox" {...gatewayForm.register('is_active')} />
                <FieldLabel htmlFor="gateway-active">Aktifkan payment gateway</FieldLabel>
              </Field>
              <Field className="gap-2" data-invalid={!!gatewayForm.formState.errors.env}>
                <FieldLabel htmlFor="env">Environment</FieldLabel>
                <select id="env" className="h-10 w-full rounded-md border border-eventkan-ink/10 bg-eventkan-surface px-3 text-sm" {...gatewayForm.register('env')}>
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
                {gatewayForm.formState.errors.env && <FieldError errors={[gatewayForm.formState.errors.env]} />}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="virtualAccount">Virtual Account</FieldLabel>
                <Input id="virtualAccount" {...gatewayForm.register('virtual_account')} />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="apiKey">
                  API Key {gatewayForm.getValues('has_api_key') && '(tersimpan, kosongkan jika tidak diubah)'}
                </FieldLabel>
                <Input id="apiKey" type="password" {...gatewayForm.register('api_key')} />
              </Field>
              <Button type="submit" className="bg-eventkan-navy text-white hover:bg-eventkan-navy-hover">
                Simpan Payment Gateway
              </Button>
            </FieldGroup>
          </form>
        )}
      </div>
    </section>
  );
}
