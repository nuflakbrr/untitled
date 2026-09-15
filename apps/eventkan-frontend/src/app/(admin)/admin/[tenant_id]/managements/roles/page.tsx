'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, deleteRole, permanentlyDeleteRole } from '@/services/admin/roles';

import Columns from './_components/Columns';

const RolesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [selected, setSelected] = useState<typeof roles>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['roles', page, limit, debouncedSearch, includeDeleted],
    queryFn: async () => {
      const result = await getRoles(page, limit, debouncedSearch, includeDeleted);
      return result;
    },
  });

  const roles = (data?.data || []).filter((role) =>
    includeDeleted ? Boolean(role.deletedAt) : !role.deletedAt
  );
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const deleteMutation = useMutation({ mutationFn: () => Promise.all(selected.map((role) => includeDeleted ? permanentlyDeleteRole(role.id) : deleteRole(role.id))), onSuccess: async () => { toast.success('Jabatan berhasil dihapus.'); setConfirming(false); setSelected([]); setRowSelection({}); await queryClient.invalidateQueries({ queryKey: ['roles'] }); await refetch(); } });

  return (
    <section>
      <AlertModal isOpen={confirming} onClose={() => setConfirming(false)} onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading title={`Jabatan (${meta.total})`} description="Daftar jabatan yang tersedia." />
        {hasPermission('role.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/managements/roles/new">
              <Plus /> Tambah Jabatan
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={roles}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={(v) => {
          setSearch(v);
          setDebouncedSearch(v);
          setPage(1);
        }}
        searchValue={search}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onBulkDelete={(rows) => { setSelected(rows); setConfirming(true); }}
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={(value) => { setIncludeDeleted(value); setPage(1); setRowSelection({}); }}
      />
    </section>
  );
};

export default RolesCMS;
