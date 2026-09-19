'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteEventCategory } from '@/services/admin/event-categories';

export const useEventCategoryActions = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: () => deleteEventCategory(id),
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

  return { deleteCategory, isPending };
};
