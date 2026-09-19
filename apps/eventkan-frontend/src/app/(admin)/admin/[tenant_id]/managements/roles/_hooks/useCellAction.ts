'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRole, restoreRole, permanentlyDeleteRole } from '@/services/admin/roles';

export const useCellAction = (roleId: string, isDeleted: boolean) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: () => (isDeleted ? permanentlyDeleteRole(roleId) : deleteRole(roleId)),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setOpen(false);
      router.refresh();
    },
  });
  const restoreMutation = useMutation({
    mutationFn: () => restoreRole(roleId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.refresh();
    },
  });
  return { open, setOpen, onDelete: mutation.mutate, isDeletePending: mutation.isPending, onRestore: restoreMutation.mutate, isRestorePending: restoreMutation.isPending };
};
