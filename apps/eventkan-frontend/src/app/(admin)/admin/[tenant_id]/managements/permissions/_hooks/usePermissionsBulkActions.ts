'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Permission } from '@/interfaces/features/permissions';

import { deleteBulkPermissions } from '@/services/admin/permissions';

export const usePermissionsBulkActions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (items: Permission[]) => deleteBulkPermissions(items.map((item) => item.id)),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal menghapus hak akses.');
        return;
      }
      toast.success(result.message ?? 'Hak akses berhasil dihapus.');
      await queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: () => toast.error('Gagal menghapus hak akses.'),
  });

  return { bulkDelete: mutation.mutate, isDeleting: mutation.isPending };
};
