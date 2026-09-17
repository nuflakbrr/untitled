'use client';

import type { Route } from 'next';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn } from '@/lib/authClient';
import { loginSchema, type LoginValues } from '@/schemas/auth';

import { sanitizeCallbackUrl } from '../_libs/sanitizeCallbackUrl.libs';

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const targetUrl = sanitizeCallbackUrl(
    searchParams.get('callbackURL') || searchParams.get('redirectTo')
  );
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: targetUrl,
      });

      if (error) {
        let message = 'Terjadi kesalahan saat login.';
        if (error.status === 401 || error.code === 'INVALID_EMAIL_OR_PASSWORD') {
          message = 'Email atau password salah.';
        } else if (error.status === 503) {
          message =
            'Server sedang tidak dapat dihubungi. Pastikan backend EVENTKAN sedang berjalan.';
        } else if (error.code === 'USER_NOT_FOUND') {
          message = 'Pengguna tidak ditemukan.';
        }
        throw new Error(message);
      }

      return data;
    },
    onSuccess: async (session) => {
      await queryClient.invalidateQueries({ queryKey: ['auth-me-server-action'] });
      toast.success('Login berhasil! Selamat datang kembali.');
      const userRole = session?.data?.user?.role;
      const tenantPath =
        userRole === 'peserta'
          ? '/participant/dashboard'
          : session?.data?.tenantId
            ? `/admin/${session.data.tenantId}/dashboard`
            : '/admin';
      router.push(tenantPath as Route);
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    form,
    handleLogin,
    isPending,
    setShowPassword,
    showPassword,
  };
}
