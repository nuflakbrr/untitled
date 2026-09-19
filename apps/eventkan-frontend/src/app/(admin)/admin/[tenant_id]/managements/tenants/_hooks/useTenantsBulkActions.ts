'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminTenantRow } from '@/interfaces/features/tenants';

import { deleteTenant, permanentlyDeleteTenant } from '@/services/admin/tenants';

export const useTenantsBulkActions = (
  includeDeleted: boolean,
  onSuccess: () => Promise<unknown> | unknown
) => {
  const queryClient = useQueryClient();
  const { mutate: bulkDelete, isPending } = useMutation({
    mutationFn: async (tenants: AdminTenantRow[]) => {
      const results = await Promise.all(
        tenants.map((tenant) =>
          includeDeleted ? permanentlyDeleteTenant(tenant.id) : deleteTenant(tenant.id)
        )
      );
      const failed = results.find((result) => !result.success);
      if (failed) throw new Error(failed.error ?? 'Gagal menghapus tenant.');
    },
    onSuccess: async () => {
      toast.success('Tenant berhasil dihapus.');
      await queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      await onSuccess();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus tenant.'),
  });

  return { bulkDelete, isPending };
};
