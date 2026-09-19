'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { type FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useTenantId } from '@/hooks/useTenantId';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useRolesList } from './_hooks/useRolesList';
import { useRolesBulkActions } from './_hooks/useRolesBulkActions';

const RolesCMS: FC = () => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const [selected, setSelected] = useState<ReturnType<typeof useRolesList>['roles']>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { roles, meta, isLoading, search, setPage, setLimit, handleSearchChange } = useRolesList(includeDeleted);
  const { bulkDelete, isDeleting } = useRolesBulkActions(includeDeleted);

  return (
    <section className="mx-auto w-full max-w-375">
      <AlertModal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => bulkDelete(selected)}
        loading={isDeleting}
      />
      <Heading
        variant="soft"
        title="Jabatan"
        titleSuffix={`(${meta.total})`}
        description="Daftar jabatan yang tersedia."
        action={
          hasPermission('role.create') ? (
            <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
              <Link href={`/admin/${tenantId}/managements/roles/new`}>
                <Plus /> Tambah Jabatan
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={roles}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onBulkDelete={
          hasPermission('role.delete')
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
};

export default RolesCMS;
