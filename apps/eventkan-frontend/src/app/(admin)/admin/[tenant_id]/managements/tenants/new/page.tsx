'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { createTenant } from '@/services/admin/tenants';
import { tenantSchema, type TenantValues } from '@/schemas/tenants';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function NewTenantPage() {
  const router = useRouter();
  const params = useParams<{ tenant_id: string }>();
  const [error, setError] = useState('');
  const form = useForm<TenantValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: '', slug: '', code: '', type: 'FACULTY' },
  });
  const submit = async (values: TenantValues) => {
    const result = await createTenant(values);
    if (!result.success) {
      setError(result.error ?? 'Gagal membuat tenant.');
      return undefined;
    }
    router.push(`/admin/${params.tenant_id}/managements/tenants`);
    router.refresh();
    return undefined;
  };
  return (
    <section className="space-y-5">
      <Heading title="Tambah Tenant" description="Buat organisasi atau unit kerja baru." />
      <form onSubmit={form.handleSubmit(submit)} className="max-w-xl">
        <FieldGroup className="gap-4">
          <Field className="gap-2" data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Nama Tenant</FieldLabel>
            <Input
              id="name"
              placeholder="Masukkan nama tenant"
              required
              {...form.register('name')}
            />
            {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!form.formState.errors.slug}>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              placeholder="Masukkan slug tenant"
              required
              {...form.register('slug')}
            />
            {form.formState.errors.slug && <FieldError errors={[form.formState.errors.slug]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!form.formState.errors.code}>
            <FieldLabel htmlFor="code">Kode Tenant</FieldLabel>
            <Input
              id="code"
              placeholder="Masukkan kode tenant"
              required
              {...form.register('code')}
            />
            {form.formState.errors.code && <FieldError errors={[form.formState.errors.code]} />}
          </Field>
          <Field className="gap-2" data-invalid={!!form.formState.errors.type}>
            <FieldLabel htmlFor="type">Tipe Tenant</FieldLabel>
            <select
              id="type"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              {...form.register('type')}
            >
              <option value="FACULTY">FACULTY</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
              <option value="UNIT">UNIT</option>
            </select>
            {form.formState.errors.type && <FieldError errors={[form.formState.errors.type]} />}
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">Simpan</Button>
        </FieldGroup>
      </form>
    </section>
  );
}
