'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePermission } from '@/services/admin/permissions';

export const useCellAction = (permissionId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: () => deletePermission(permissionId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      setOpen(false);
      router.refresh();
    },
  });
  return { open, setOpen, onDelete: mutation.mutate, isDeletePending: mutation.isPending };
};
