'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { type FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useTenantId } from '@/hooks/useTenantId';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';

import Columns from './_components/Columns';
import { usePermissionsList } from './_hooks/usePermissionsList';
import { usePermissionsBulkActions } from './_hooks/usePermissionsBulkActions';

const PermissionsCMS: FC = () => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<ReturnType<typeof usePermissionsList>['permissions']>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { permissions, meta, isLoading, search, setPage, setLimit, handleSearchChange } = usePermissionsList();
  const { bulkDelete, isDeleting } = usePermissionsBulkActions();

  return (
    <section className="mx-auto w-full max-w-375">
      <AlertModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => bulkDelete(selectedPermissions)}
        loading={isDeleting}
      />
      <Heading
        variant="soft"
        title="Hak Akses"
        titleSuffix={`(${meta.total})`}
        description="Daftar hak akses yang tersedia."
        action={
          hasPermission('permission.create') ? (
            <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
              <Link href={`/admin/${tenantId}/managements/permissions/new`}>
                <Plus /> Tambah Hak Akses
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={permissions}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        onBulkDelete={
          hasPermission('permission.delete')
            ? (rows) => {
                setSelectedPermissions(rows);
                setIsBulkDeleteOpen(true);
              }
            : undefined
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        searchValue={search}
        variant="eventkan"
      />
      {/* {process.env.NODE_ENV === 'development' && (
        <>
          <Heading title="API Routes" description="Endpoints untuk mengakses data hak akses." />
          <Separator />
          <ApiListAlert entityName="permissions" entityIdName="id" />
        </>
      )} */}
    </section>
  );
};

export default PermissionsCMS;
