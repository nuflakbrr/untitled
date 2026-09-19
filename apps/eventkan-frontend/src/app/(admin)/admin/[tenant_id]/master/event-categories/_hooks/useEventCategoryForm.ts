'use client';

import type { z } from 'zod';
import type { Route } from 'next';

import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useTenantId } from '@/hooks/useTenantId';
import { eventCategorySchema } from '@/schemas/event-categories';
import {
  createEventCategory,
  updateEventCategory,
  getEventCategoryById,
} from '@/services/admin/event-categories';

type EventCategoryValues = z.infer<typeof eventCategorySchema>;

export const useEventCategoryForm = (id: string) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const { data: existing, isLoading } = useQuery({
    queryKey: ['event-category', tenantId, id],
    queryFn: () => getEventCategoryById(id),
    enabled: Boolean(tenantId) && !isNew,
  });

  const form = useForm<EventCategoryValues>({
    resolver: zodResolver(eventCategorySchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (!existing?.data) return;

    form.reset({
      name: existing.data.name,
      description: existing.data.description ?? '',
    });
  }, [existing, form]);

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (values: EventCategoryValues) =>
      isNew ? createEventCategory(values) : updateEventCategory(id, values),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Terjadi kesalahan.');
        return;
      }

      toast.success(result.message ?? 'Berhasil.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      router.push(`/admin/${tenantId}/master/event-categories` as Route);
    },
    onError: () => toast.error('Terjadi kesalahan.'),
  });

  return {
    ...form,
    isNew,
    isLoading: !isNew && isLoading,
    isPending,
    onSubmit: form.handleSubmit((values) => submit(values)),
    onCancel: () => router.push(`/admin/${tenantId}/master/event-categories` as Route),
  };
};
