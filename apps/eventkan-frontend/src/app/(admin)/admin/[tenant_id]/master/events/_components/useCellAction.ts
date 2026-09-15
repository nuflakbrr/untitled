'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, publishEvent, restoreEvent } from '@/services/admin/events';

export const useCellAction = (eventId: string, isDeleted = false) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteEvent(eventId, isDeleted),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.refetchQueries({ queryKey: ['events'], type: 'active' });
        setOpenDelete(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus event.');
    },
  });

  const { mutate: onPublish, isPending: isPublishPending } = useMutation({
    mutationFn: () => publishEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setOpenPublish(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal mempublikasikan event.');
    },
  });

  const { mutate: onRestore, isPending: isRestorePending } = useMutation({
    mutationFn: () => restoreEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['events'] });
      } else toast.error(result.error);
    },
  });

  return {
    openDelete,
    setOpenDelete,
    openPublish,
    setOpenPublish,
    onDelete,
    isDeletePending,
    onPublish,
    isPublishPending,
    onRestore,
    isRestorePending,
  };
};
