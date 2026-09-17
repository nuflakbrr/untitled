'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { authClient } from '@/lib/authClient';
import { resetPasswordSchema, type ResetPasswordValues } from '@/schemas/auth';

import { getPasswordRules } from '../_libs/getPasswordRules.libs';

export default function useResetPassword() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  const { mutate: handleReset, isPending } = useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      if (!token) throw new Error('Token reset password tidak valid atau telah kedaluwarsa.');

      const { error } = await authClient.resetPassword({ newPassword: values.password, token });
      if (error) {
        throw new Error(
          error.message.includes('tidak valid')
            ? 'Token reset password tidak valid atau telah kedaluwarsa.'
            : 'Gagal mereset password. Silakan coba lagi.'
        );
      }
    },
    onSuccess: () => setSuccess(true),
    onError: (error: Error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => router.push('/login'), 3000);
    return () => clearTimeout(timeout);
  }, [router, success]);

  return {
    confirmPassword,
    form,
    handleReset,
    isPending,
    password,
    rules: getPasswordRules(password),
    setShowConfirm,
    setShowPassword,
    showConfirm,
    showPassword,
    success,
    token,
  };
}
