'use client';

import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';

import type { CreateSupportMessageInput } from '@/interfaces/features/support';

import { getMeAction } from '@/services/public/auth';
import { supportMessageSchema } from '@/schemas/support';
import { createSupportMessageAction } from '@/services/participant/support';

const useHelpForm = () => {
  const { data: meData } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: () => getMeAction(),
  });
  const session = meData?.session;
  const isAuthenticated = !!session?.user;

  const form = useForm<CreateSupportMessageInput>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      title: '',
      category: '',
      chronology: '',
    },
  });

  useEffect(() => {
    if (!session?.user) return;

    form.setValue('name', session.user.name ?? '');
    form.setValue('email', session.user.email ?? '');
  }, [form, session]);

  const { mutate: handleSubmitMessage, isPending, isSuccess } = useMutation({
    mutationFn: async (values: CreateSupportMessageInput) => {
      const result = await createSupportMessageAction(values);

      if (!result.success) {
        throw new Error(result.error ?? 'Gagal mengirim aduan.');
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Laporan berhasil dikirim. Tim kami akan segera menindaklanjuti.');
      form.reset({
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        phone: '',
        title: '',
        category: '',
        chronology: '',
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    form,
    handleSubmitMessage,
    isAuthenticated,
    isPending,
    isSuccess,
    session,
  };
};

export default useHelpForm;
