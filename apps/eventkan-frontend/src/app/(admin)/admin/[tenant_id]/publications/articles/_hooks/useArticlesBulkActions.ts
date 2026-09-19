'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteBulkArticles } from '@/services/admin/articles';

export const useArticlesBulkActions = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { mutate: bulkDelete, isPending } = useMutation({
    mutationFn: deleteBulkArticles,
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      onSuccess();
    },
  });

  return { bulkDelete, isPending };
};
