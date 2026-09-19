'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import type { User } from '@/interfaces/features/users';

import { Button } from '@/components/ui/button';
import { useTenantId } from '@/hooks/useTenantId';
import Heading from '@/components/Common/Heading';
import { getMeAction } from '@/services/public/auth';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useUsersList } from './_hooks/useUsersList';
import { useUsersBulkActions } from './_hooks/useUsersBulkActions';

export const UsersCMS = ({ participantOnly = false }: { participantOnly?: boolean }) => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const [selected, setSelected] = useState<User[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { data: meData } = useQuery({ queryKey: ['auth-me-server-action'], queryFn: getMeAction });
  const { users, meta, isLoading, refetch, setPage, setLimit, search, handleSearchChange } =
    useUsersList(participantOnly, includeDeleted);
  const { bulkDelete, isPending: isBulkDeletePending } = useUsersBulkActions(
    includeDeleted,
    async () => {
      setConfirming(false);
      setSelected([]);
      setRowSelection({});
      await refetch();
    }
  );

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
        title={participantOnly ? 'Peserta' : 'Pengguna'}
        titleSuffix={`(${meta.total})`}
        description={participantOnly ? 'Kelola akun peserta yang terdaftar.' : 'Daftar pengguna yang terdaftar.'}
        action={
          hasPermission('user.create') ? (
            <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
              <Link href={participantOnly ? `/admin/${tenantId}/managements/participants/new` : `/admin/${tenantId}/managements/users/new`}>
                <Plus /> Tambah Pengguna
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={users}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onBulkDelete={
          hasPermission('user.delete')
            ? (rows) => {
                setSelected(rows);
                setConfirming(true);
              }
            : undefined
        }
        isRowSelectable={(row) => row.id !== meData?.session?.user?.id}
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
};

export default UsersCMS;
