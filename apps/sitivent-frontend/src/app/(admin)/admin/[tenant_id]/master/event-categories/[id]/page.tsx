'use client';

import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { use, type FC, useState } from 'react';
import { Trash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { usePermission } from '@/providers/PermissionProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEventCategory } from '@/services/admin/event-categories';

import CategoryForm from './_components/CategoryForm';

type PageProps = {
  params: Promise<{ id: string }>;
};

const EventCategoryFormPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const isNew = params.id === 'new';
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: () => deleteEventCategory(params.id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal menghapus kategori.');
        return;
      }
      toast.success('Kategori berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      router.push('..');
    },
    onError: () => toast.error('Gagal menghapus kategori.'),
  });

  return (
    <section>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => deleteCategory()}
        loading={isPending}
      />
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <Heading
          title={isNew ? 'Tambah Kategori' : 'Ubah Kategori'}
          description={
            isNew
              ? 'Buat kategori baru untuk mengelompokkan event.'
              : 'Perbarui informasi kategori event.'
          }
        />
        <div className="flex items-center gap-2">
          {!isNew && hasPermission('event.categories.delete') && (
            <Button variant="destructive" onClick={() => setIsAlertOpen(true)}>
              <Trash className="h-4 w-4 mr-2" /> Hapus
            </Button>
          )}
          {isNew && (
            <Button variant="outline" asChild>
              <Link href={'/admin/master/event-categories' as Route}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Separator className="mb-6" />
      <CategoryForm id={params.id} />
    </section>
  );
};

export default EventCategoryFormPage;
