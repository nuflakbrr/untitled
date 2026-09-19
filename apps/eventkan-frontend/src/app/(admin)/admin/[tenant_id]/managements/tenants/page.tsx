'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import type { AdminTenantRow } from '@/interfaces/features/tenants';

import { Button } from '@/components/ui/button';
import { useTenantId } from '@/hooks/useTenantId';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useTenantsList } from './_hooks/useTenantsList';
import { useTenantsBulkActions } from './_hooks/useTenantsBulkActions';

export default function TenantsCMS() {
  const [selected, setSelected] = useState<AdminTenantRow[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const { data, isLoading, refetch, setPage, setLimit, search, handleSearchChange } =
    useTenantsList(includeDeleted);
  const { bulkDelete, isPending: isBulkDeletePending } = useTenantsBulkActions(
    includeDeleted,
    async () => {
      setConfirming(false);
      setSelected([]);
      setRowSelection({});
      await refetch();
    }
  );
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
    <section className="mx-auto w-full max-w-375">
      <AlertModal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => bulkDelete(selected)}
        loading={isBulkDeletePending}
      />
      <Heading
        variant="soft"
        title="Organisasi"
        titleSuffix={`(${data?.meta.total ?? 0})`}
        description="Kelola organisasi dan unit kerja dalam EVENTKAN."
        action={
          hasPermission('tenant.create') ? (
          <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
            <Link href={`/admin/${tenantId}/managements/tenants/new`}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Organisasi
            </Link>
          </Button>
          ) : null
        }
      />
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
        onSearchChange={handleSearchChange}
        searchValue={search}
        searchKey="name"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onBulkDelete={
          hasPermission('tenant.delete')
            ? (rows) => {
                setSelected(rows);
                setConfirming(true);
              }
            : undefined
        }
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={(value) => {
          setIncludeDeleted(value);
          setPage(1);
          setRowSelection({});
        }}
        variant="eventkan"
      />
    </section>
  );
}
