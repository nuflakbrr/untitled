'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTenant } from '@/services/admin/tenants';

export const useCellAction = (tenantId: string) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const mutation = useMutation({
    mutationFn: () => deleteTenant(tenantId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success('Tenant berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Gagal menghapus tenant.'),
  });
  return { openDelete, setOpenDelete, onDelete: mutation.mutate, isDeletePending: mutation.isPending };
};
