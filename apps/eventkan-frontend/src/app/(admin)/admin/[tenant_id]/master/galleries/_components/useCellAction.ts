'use client';

import type { Gallery } from '@/interfaces/features/galleries';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteGallery,
  restoreGallery,
  permanentlyDeleteGallery,
} from '@/services/admin/galleries';

export const useCellAction = (data: Gallery) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteGallery(data.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus foto.');
        return;
      }
      toast.success('Foto berhasil dihapus dari galeri.');
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });
  const { mutate: onRestore, isPending: isRestorePending } = useMutation({
    mutationFn: () => restoreGallery(data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['galleries'] });
      } else toast.error(res.error);
    },
  });
  const { mutate: onPermanentDelete, isPending: isPermanentDeletePending } = useMutation({
    mutationFn: () => permanentlyDeleteGallery(data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['galleries'] });
        setOpenDelete(false);
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
