'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import Heading from '@/components/Common/Heading';
import { getMeAction } from '@/services/public/auth';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { getUsers, deleteUser } from '@/services/admin/users';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Columns from './_components/Columns';

const UsersCMS = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [selected, setSelected] = useState<typeof users>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit, debouncedSearch],
    queryFn: () => getUsers(page, limit, debouncedSearch),
  });
  const { data: meData } = useQuery({ queryKey: ['auth-me-server-action'], queryFn: getMeAction });

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const deleteMutation = useMutation({ mutationFn: () => Promise.all(selected.map((user) => deleteUser(user.id))), onSuccess: () => { toast.success('Pengguna berhasil dihapus.'); setConfirming(false); setSelected([]); setRowSelection({}); queryClient.invalidateQueries({ queryKey: ['users'] }); } });

  return (
    <section>
      <AlertModal isOpen={confirming} onClose={() => setConfirming(false)} onConfirm={() => deleteMutation.mutate()} loading={deleteMutation.isPending} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading title={`Pengguna (${meta.total})`} description="Daftar pengguna yang terdaftar." />
        {hasPermission('user.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/managements/users/new">
              <Plus /> Tambah Pengguna
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={users}
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
        isRowSelectable={(row) => row.id !== meData?.session?.user?.id}
      />
    </section>
  );
};

export default UsersCMS;
