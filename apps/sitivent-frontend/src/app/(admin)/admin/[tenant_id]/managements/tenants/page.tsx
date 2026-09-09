'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import Heading from '@/components/Common/Heading';
import { useMemo, useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTenants, deleteTenant, permanentlyDeleteTenant } from '@/services/admin/tenants';

import Columns from './_components/Columns';

export default function TenantsCMS() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [selected, setSelected] = useState<NonNullable<typeof data>['data']>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const tenantId = usePathname().split('/')[2];
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-tenants', page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getTenants(page, limit, debouncedSearch, includeDeleted),
  });
  const deleteMutation = useMutation({
    mutationFn: () =>
      Promise.all(
        selected.map((tenant) =>
          includeDeleted ? permanentlyDeleteTenant(tenant.id) : deleteTenant(tenant.id)
        )
      ).then((results) => {
        const failed = results.find((result) => !result.success);
        if (failed) throw new Error(failed.error ?? 'Gagal menghapus tenant.');
        return results;
      }),
    onSuccess: async () => {
      toast.success('Tenant berhasil dihapus.');
      setConfirming(false);
      setSelected([]);
      setRowSelection({});
      await queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      await refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus tenant.');
    },
  });
  const tenants = data?.data ?? [];
  useEffect(() => {
    const parentIds = new Set(tenants.map((tenant) => tenant.parentId).filter(Boolean) as string[]);
    setExpanded((current) => new Set([...current, ...parentIds]));
  }, [tenants]);
  const treeTenants = useMemo(() => {
    const uniqueTenants = [...new Map(tenants.map((tenant) => [tenant.id, tenant])).values()];
    const byParent = new Map<string | undefined, typeof tenants>();
    for (const tenant of uniqueTenants) {
      const siblings = byParent.get(tenant.parentId) ?? [];
      siblings.push(tenant);
      byParent.set(tenant.parentId, siblings);
    }
    const visited = new Set<string>();
    const flatten = (nodes: typeof tenants, depth: number): typeof tenants =>
      nodes.flatMap((tenant) => {
        if (visited.has(tenant.id)) return [];
        visited.add(tenant.id);
        const children = byParent.get(tenant.id) ?? [];
        const isExpanded = expanded.has(tenant.id);
        return [
          {
            ...tenant,
            depth,
            hasChildren: children.length > 0,
            isExpanded,
            onToggle: () =>
              setExpanded((current) => {
                const next = new Set(current);
                if (next.has(tenant.id)) next.delete(tenant.id);
                else next.add(tenant.id);
                return next;
              }),
          },
          ...(isExpanded ? flatten(children, depth + 1) : []),
        ];
      });
    // A scoped tenant list can omit the real parent (for example, a faculty
    // admin only receives its own tenant and direct children). Treat those
    // orphaned-in-the-response tenants as tree roots.
    const roots = uniqueTenants.filter(
      (tenant) => !tenant.parentId || !byParent.has(tenant.parentId)
    );
    return flatten(roots.length > 0 ? roots : uniqueTenants, 0);
  }, [expanded, tenants]);

  return (
    <section>
      <AlertModal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Organisasi (${data?.meta.total ?? 0})`}
          description="Kelola organisasi dan unit kerja dalam SITIVENT."
        />
        <Button asChild>
          <Link href={`/admin/${tenantId}/managements/tenants/new`}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Organisasi
          </Link>
        </Button>
      </div>
      <Separator />
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
        onBulkDelete={(rows) => {
          setSelected(rows);
          setConfirming(true);
        }}
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={(value) => {
          setIncludeDeleted(value);
          setPage(1);
          setRowSelection({});
        }}
      />
    </section>
  );
}
