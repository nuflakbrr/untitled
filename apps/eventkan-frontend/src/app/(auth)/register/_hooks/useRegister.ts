'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerAction } from '@/services/public/auth';
import { registerSchema, type RegisterValues } from '@/schemas/auth';

export default function useRegister() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: async (values: RegisterValues) => {
      const result = await registerAction(values);
      if (!result.success) {
        throw new Error(result.error ?? 'Terjadi kesalahan saat registrasi.');
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan masuk.');
      router.push('/login');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    form,
    handleRegister,
    isPending,
    setShowPassword,
    showPassword,
  };
}
