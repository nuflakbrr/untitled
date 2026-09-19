'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { User } from '@/interfaces/features/users';

import { deleteUser, permanentlyDeleteUser } from '@/services/admin/users';

export const useUsersBulkActions = (
  includeDeleted: boolean,
  onSuccess: () => Promise<unknown> | unknown
) => {
  const queryClient = useQueryClient();
  const { mutate: bulkDelete, isPending } = useMutation({
    mutationFn: async (users: User[]) => {
      const results = await Promise.all(
        users.map((user) =>
          includeDeleted ? permanentlyDeleteUser(user.id) : deleteUser(user.id)
        )
      );
      const failed = results.find((result) => !result.success);
      if (failed) throw new Error(failed.error ?? 'Gagal menghapus pengguna.');
    },
    onSuccess: async () => {
      toast.success('Pengguna berhasil dihapus.');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await onSuccess();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus pengguna.'),
  });

  return { bulkDelete, isPending };
};
