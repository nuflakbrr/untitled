'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { authClient } from '@/lib/authClient';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/schemas/auth';

export default function useForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (values: ForgotPasswordValues) => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
      });

      if (error) throw new Error('Gagal mengirim email. Periksa kembali alamat email Anda.');
      return values.email;
    },
    onSuccess: (email) => {
      setSentEmail(email);
      setEmailSent(true);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    emailSent,
    form,
    handleSubmit,
    isPending,
    sentEmail,
    setEmailSent,
  };
}
