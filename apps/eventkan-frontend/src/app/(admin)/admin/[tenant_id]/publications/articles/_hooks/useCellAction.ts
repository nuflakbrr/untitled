'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreArticle, deleteArticleById, permanentlyDeleteArticle } from '@/services/admin/articles';

export const useCellAction = (articleId: string, isDeleted: boolean) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: () => (isDeleted ? permanentlyDeleteArticle(articleId) : deleteArticleById(articleId)),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setOpen(false);
      router.refresh();
    },
  });
  const restoreMutation = useMutation({
    mutationFn: () => restoreArticle(articleId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
  return { open, setOpen, onDelete: mutation.mutate, isDeletePending: mutation.isPending, onRestore: restoreMutation.mutate, isRestorePending: restoreMutation.isPending };
};
