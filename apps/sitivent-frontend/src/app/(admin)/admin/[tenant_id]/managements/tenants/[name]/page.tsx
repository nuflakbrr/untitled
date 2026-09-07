'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useParams, useRouter } from 'next/navigation';
import { getTenant, updateTenant, getTenantPaymentGateway, type TenantPaymentGateway, updateTenantPaymentGateway } from '@/services/admin/tenants';

export default function TenantDetailPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', code: '', type: 'FACULTY' });
  const [error, setError] = useState('');
  const [gateway, setGateway] = useState<TenantPaymentGateway>({ provider: 'MANUAL', is_active: false, env: 'sandbox' });

  useEffect(() => {
    getTenant(params.name).then(async (result) => {
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
      const gatewayResult = await getTenantPaymentGateway(params.name);
      if (gatewayResult.success && gatewayResult.data) setGateway((current) => ({ ...current, ...gatewayResult.data }));
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

  async function submitGateway(event: React.FormEvent) {
    event.preventDefault();
    const result = await updateTenantPaymentGateway(params.name, gateway);
    if (!result.success) setError(result.error ?? 'Gagal menyimpan payment gateway.');
  }

  return (
    <section className="space-y-5">
      <Heading title="Ubah Tenant" description="Perbarui informasi organisasi atau unit kerja." />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <form onSubmit={submit} className="space-y-4">
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
      <form onSubmit={submitGateway} className="space-y-4 rounded-lg border p-5">
        <div><h2 className="text-lg font-semibold">Payment Gateway</h2><p className="text-sm text-muted-foreground">Atur metode pembayaran untuk tenant ini.</p></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={gateway.is_active} onChange={(e) => setGateway({ ...gateway, is_active: e.target.checked })} /> Aktifkan payment gateway</label>
        <div className="space-y-2"><Label htmlFor="provider">Provider</Label><select id="provider" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={gateway.provider} onChange={(e) => setGateway({ ...gateway, provider: e.target.value as TenantPaymentGateway['provider'] })}><option value="MANUAL">MANUAL</option><option value="IPAYMU">IPAYMU</option></select></div>
        <div className="space-y-2"><Label htmlFor="env">Environment</Label><select id="env" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={gateway.env} onChange={(e) => setGateway({ ...gateway, env: e.target.value as TenantPaymentGateway['env'] })}><option value="sandbox">Sandbox</option><option value="production">Production</option></select></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="bankName">Nama Bank</Label><Input id="bankName" value={gateway.bank_name ?? ''} onChange={(e) => setGateway({ ...gateway, bank_name: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="accountNumber">Nomor Rekening</Label><Input id="accountNumber" value={gateway.bank_account_number ?? ''} onChange={(e) => setGateway({ ...gateway, bank_account_number: e.target.value })} /></div></div>
        <div className="space-y-2"><Label htmlFor="accountHolder">Nama Pemilik Rekening</Label><Input id="accountHolder" value={gateway.bank_account_holder ?? ''} onChange={(e) => setGateway({ ...gateway, bank_account_holder: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="virtualAccount">Virtual Account</Label><Input id="virtualAccount" value={gateway.virtual_account ?? ''} onChange={(e) => setGateway({ ...gateway, virtual_account: e.target.value })} /></div>
        {gateway.provider === 'IPAYMU' && <div className="space-y-2"><Label htmlFor="apiKey">API Key {gateway.has_api_key && '(tersimpan, kosongkan jika tidak diubah)'}</Label><Input id="apiKey" type="password" value={gateway.api_key ?? ''} onChange={(e) => setGateway({ ...gateway, api_key: e.target.value })} /></div>}
        <Button type="submit">Simpan Payment Gateway</Button>
      </form>
      </div>
    </section>
  );
}
