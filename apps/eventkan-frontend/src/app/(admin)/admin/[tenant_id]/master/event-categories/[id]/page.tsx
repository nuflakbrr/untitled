'use client';

import type { Route } from 'next';

import Link from 'next/link';
import { use, type FC, useState } from 'react';
import { Trash, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { Separator } from '@/components/ui/separator';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';

import CategoryForm from './_components/CategoryForm';
import { useEventCategoryActions } from '../_hooks/useEventCategoryActions';

type PageProps = {
  params: Promise<{ id: string }>;
};

const EventCategoryFormPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const tenantId = useTenantId();
  const isNew = params.id === 'new';
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { hasPermission } = usePermission();
  const canManage = hasPermission(isNew ? 'event.categories.create' : 'event.categories.update');
  const { deleteCategory, isPending } = useEventCategoryActions(params.id);

  return (
    <section>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => deleteCategory()}
        loading={isPending}
      />
      <Heading
        variant="soft"
        title={isNew ? 'Tambah Kategori' : 'Ubah Kategori'}
        description={isNew ? 'Buat kategori baru untuk mengelompokkan event.' : 'Perbarui informasi kategori event.'}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {!isNew && hasPermission('event.categories.delete') && (
            <Button variant="destructive" onClick={() => setIsAlertOpen(true)} className="w-full cursor-pointer sm:w-auto">
              <Trash className="h-4 w-4 mr-2" /> Hapus
            </Button>
          )}
          {isNew && (
            <Button variant="outline" asChild className="w-full cursor-pointer sm:w-auto">
              <Link href={`/admin/${tenantId}/master/event-categories` as Route}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
              </Link>
            </Button>
          )}
          </div>
        }
      />
      <Separator className="mb-6" />
      {canManage ? (
        <CategoryForm id={params.id} />
      ) : (
        <p className="text-sm text-eventkan-muted">Kamu tidak memiliki izin untuk mengubah kategori event.</p>
      )}
    </section>
  );
};

export default EventCategoryFormPage;
