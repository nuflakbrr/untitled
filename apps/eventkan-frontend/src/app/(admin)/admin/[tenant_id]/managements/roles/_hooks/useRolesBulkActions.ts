'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Role } from '@/interfaces/features/roles';

import { deleteRole, permanentlyDeleteRole } from '@/services/admin/roles';

export const useRolesBulkActions = (includeDeleted = false) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (items: Role[]) =>
      Promise.all(items.map((item) => (includeDeleted ? permanentlyDeleteRole(item.id) : deleteRole(item.id)))),
    onSuccess: async (results) => {
      const failed = results.find((result) => !result.success);
      if (failed) {
        toast.error(failed.error ?? 'Gagal menghapus jabatan.');
        return;
      }
      toast.success('Jabatan berhasil dihapus.');
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: () => toast.error('Gagal menghapus jabatan.'),
  });

  return { bulkDelete: mutation.mutate, isDeleting: mutation.isPending };
};
