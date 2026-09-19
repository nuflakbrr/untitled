'use client';

import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { cancelRegistration, deleteRegistration } from '@/services/admin/registrations';

export const useCellAction = (registrationId: string) => {
  const queryClient = useQueryClient();
  const [openCancel, setOpenCancel] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onCancel = () => startTransition(async () => {
    const result = await cancelRegistration(registrationId);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    } else toast.error(result.error);
    setOpenCancel(false);
  });

  const onDelete = () => startTransition(async () => {
    const result = await deleteRegistration(registrationId);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    } else toast.error(result.error);
    setOpenDelete(false);
  });

  return { openCancel, setOpenCancel, openDelete, setOpenDelete, isPending, onCancel, onDelete };
};
