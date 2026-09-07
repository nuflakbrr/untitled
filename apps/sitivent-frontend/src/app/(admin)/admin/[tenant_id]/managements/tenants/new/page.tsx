'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { createTenant } from '@/services/admin/tenants';

export default function NewTenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', code: '', type: 'FACULTY' });
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await createTenant(form);
    if (!result.success) {
      setError(result.error ?? 'Gagal membuat tenant.');
      return undefined;
    }
    router.push('..');
    router.refresh();
    return undefined;
  };
  return (
    <section className="space-y-5">
      <Heading title="Tambah Tenant" description="Buat organisasi atau unit kerja baru." />
      <form onSubmit={submit} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Tenant</Label>
          <Input
            id="name"
            placeholder="Masukkan nama tenant"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="Masukkan slug tenant"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Kode Tenant</Label>
          <Input
            id="code"
            placeholder="Masukkan kode tenant"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipe Tenant</Label>
          <select
            id="type"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="FACULTY">FACULTY</option>
            <option value="DEPARTMENT">DEPARTMENT</option>
            <option value="UNIT">UNIT</option>
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit">Simpan</Button>
      </form>
    </section>
  );
}
