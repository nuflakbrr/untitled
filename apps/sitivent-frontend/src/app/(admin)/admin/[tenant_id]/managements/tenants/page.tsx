'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import Heading from '@/components/Common/Heading';
import { useMemo, useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { getTenants, deleteTenant } from '@/services/admin/tenants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Columns from './_components/Columns';

export default function TenantsCMS() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [selected, setSelected] = useState<NonNullable<typeof data>['data']>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const tenantId = usePathname().split('/')[2];
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tenants', page, limit, debouncedSearch],
    queryFn: () => getTenants(page, limit, debouncedSearch),
  });
  const deleteMutation = useMutation({ mutationFn: () => Promise.all(selected.map((tenant) => deleteTenant(tenant.id))), onSuccess: () => { toast.success('Tenant berhasil dihapus.'); setConfirming(false); setSelected([]); setRowSelection({}); queryClient.invalidateQueries({ queryKey: ['admin-tenants'] }); } });
  const tenants = data?.data ?? [];
  useEffect(() => {
    const parentIds = new Set(tenants.map((tenant) => tenant.parentId).filter(Boolean) as string[]);
    setExpanded((current) => new Set([...current, ...parentIds]));
  }, [tenants]);
  const treeTenants = useMemo(() => {
    const byParent = new Map<string | undefined, typeof tenants>();
    for (const tenant of tenants) {
      const siblings = byParent.get(tenant.parentId) ?? [];
      siblings.push(tenant);
      byParent.set(tenant.parentId, siblings);
    }
    const flatten = (nodes: typeof tenants, depth: number): typeof tenants => nodes.flatMap((tenant) => {
      const children = byParent.get(tenant.id) ?? [];
      const isExpanded = expanded.has(tenant.id);
      return [{ ...tenant, depth, hasChildren: children.length > 0, isExpanded, onToggle: () => setExpanded((current) => { const next = new Set(current); if (next.has(tenant.id)) next.delete(tenant.id); else next.add(tenant.id); return next; }) }, ...(isExpanded ? flatten(children, depth + 1) : [])];
    });
    return flatten(byParent.get(undefined) ?? tenants, 0);
  }, [expanded, tenants]);

  return (
    <section>
      <AlertModal isOpen={confirming} onClose={() => setConfirming(false)} onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending} />
      <div className="flex items-start justify-between gap-4">
        <Heading
          title={`Tenant (${data?.meta.total ?? 0})`}
          description="Kelola organisasi dan unit kerja dalam SITIVENT."
        />
        <Button asChild>
          <Link href={`/admin/${tenantId}/managements/tenants/new`}>Tambah Tenant</Link>
        </Button>
      </div>
      <DataTable
        columns={Columns()}
        data={treeTenants}
        isFetching={isLoading}
        pageCount={data?.meta.lastPage ?? 1}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setDebouncedSearch(value);
          setPage(1);
        }}
        searchValue={search}
        searchKey="name"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onBulkDelete={(rows) => { setSelected(rows); setConfirming(true); }}
      />
    </section>
  );
}
