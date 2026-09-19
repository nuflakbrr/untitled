'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { EventCategory } from '@/interfaces/features/events';

import {
  deleteEventCategory,
  permanentlyDeleteEventCategory,
} from '@/services/admin/event-categories';

export const useEventCategoriesBulkActions = (includeDeleted: boolean) => {
  const queryClient = useQueryClient();

  const { mutate: bulkDelete } = useMutation({
    mutationFn: (items: EventCategory[]) =>
      Promise.all(
        items.map((item) =>
          includeDeleted ? permanentlyDeleteEventCategory(item.id) : deleteEventCategory(item.id)
        )
      ),
    onSuccess: (results) => {
      const failed = results.find((result) => !result.success);
      if (failed) {
        toast.error(failed.error ?? 'Sebagian kategori gagal dihapus.');
        return;
      }
      toast.success('Kategori terpilih berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
    },
    onError: () => toast.error('Gagal menghapus kategori terpilih.'),
  });

  return { bulkDelete };
};
