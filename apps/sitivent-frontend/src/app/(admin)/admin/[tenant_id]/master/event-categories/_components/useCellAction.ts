'use client';

import type { EventCategory } from '@/interfaces/features/event-categories';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteEventCategory,
  restoreEventCategory,
  permanentlyDeleteEventCategory,
} from '@/services/admin/event-categories';

export const useCellAction = (data: EventCategory) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteEventCategory(data.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus kategori.');
        return;
      }
      toast.success('Kategori berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  const { mutate: onRestore, isPending: isRestorePending } = useMutation({
    mutationFn: () => restoreEventCategory(data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      } else toast.error(res.error);
    },
  });
  const { mutate: onPermanentDelete, isPending: isPermanentDeletePending } = useMutation({
    mutationFn: () => permanentlyDeleteEventCategory(data.id),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message);
        setOpenDelete(false);
        await queryClient.refetchQueries({ queryKey: ['event-categories'], type: 'active' });
      } else toast.error(res.error);
    },
  });

  return {
    openDelete,
    setOpenDelete,
    onDelete,
    isDeletePending,
    onRestore,
    isRestorePending,
    onPermanentDelete,
    isPermanentDeletePending,
  };
};
