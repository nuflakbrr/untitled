'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTestimonial } from '@/services/admin/testimonials';

export const useCellAction = (testimonialId: string) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const mutation = useMutation({
    mutationFn: () => deleteTestimonial(testimonialId),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.message);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus testimoni.'),
  });
  return { openDelete, setOpenDelete, onDelete: mutation.mutate, isDeletePending: mutation.isPending };
};
