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
import { getRoles, deleteRole } from '@/services/admin/roles';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page, limit, debouncedSearch],
    queryFn: async () => {
      const result = await getRoles(page, limit, debouncedSearch);
      return result;
    },
  });

  const roles = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const deleteMutation = useMutation({ mutationFn: () => Promise.all(selected.map((role) => deleteRole(role.id))), onSuccess: () => { toast.success('Jabatan berhasil dihapus.'); setConfirming(false); setSelected([]); setRowSelection({}); queryClient.invalidateQueries({ queryKey: ['roles'] }); } });

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
      />
    </section>
  );
};

export default RolesCMS;
