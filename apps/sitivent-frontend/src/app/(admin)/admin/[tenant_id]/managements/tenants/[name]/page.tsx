'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useParams, useRouter } from 'next/navigation';
import { getTenant, updateTenant } from '@/services/admin/tenants';

export default function TenantDetailPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', code: '', type: 'FACULTY' });
  const [error, setError] = useState('');

  useEffect(() => {
    getTenant(params.name).then((result) => {
      if (!result.success || !result.data) {
        setError(result.error ?? 'Tenant tidak ditemukan.');
        return undefined;
      }
      setForm({
        name: result.data.name ?? '',
        slug: result.data.slug ?? '',
        code: result.data.code ?? '',
        type: result.data.type ?? 'FACULTY',
      });
      return undefined;
    });
  }, [params.name]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = await updateTenant(params.name, form);
    if (!result.success) {
      setError(result.error ?? 'Gagal memperbarui tenant.');
      return undefined;
    }
    router.push('..');
    router.refresh();
    return undefined;
  }

  return (
    <section className="space-y-5">
      <Heading title="Ubah Tenant" description="Perbarui informasi organisasi atau unit kerja." />
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
            <option value="ROOT">ROOT</option>
            <option value="FACULTY">FACULTY</option>
            <option value="DEPARTMENT">DEPARTMENT</option>
            <option value="UNIT">UNIT</option>
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </section>
  );
}
