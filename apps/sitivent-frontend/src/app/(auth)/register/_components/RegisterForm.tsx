'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

import type { RegisterValues } from '@/services/public/auth';

import { registerSchema } from '@/schemas/auth';
import { registerAction } from '@/services/public/auth';

import { getRegisterInputClass } from '../_libs/inputClass';

const RegisterForm: FC = () => {
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

  const onSubmit = (values: RegisterValues) => handleRegister(values);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="reg-name" className="mb-2 block text-[13px] font-bold text-[#11233f]">
            Nama lengkap
          </label>
          <input
            id="reg-name"
            type="text"
            placeholder="Nama kamu"
            autoComplete="name"
            disabled={isPending}
            {...form.register('name')}
            className={getRegisterInputClass(Boolean(form.formState.errors.name))}
          />
          {form.formState.errors.name && (
            <p className="mt-1.5 text-xs font-medium text-[#b84a2a]">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reg-email" className="mb-2 block text-[13px] font-bold text-[#11233f]">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            disabled={isPending}
            {...form.register('email')}
            className={getRegisterInputClass(Boolean(form.formState.errors.email))}
          />
          {form.formState.errors.email && (
            <p className="mt-1.5 text-xs font-medium text-[#b84a2a]">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reg-password" className="mb-2 block text-[13px] font-bold text-[#11233f]">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              disabled={isPending}
              {...form.register('password')}
              className={`${getRegisterInputClass(Boolean(form.formState.errors.password))} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6c7280] transition hover:bg-[#f6f3eb] hover:text-[#11233f]"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1.5 text-xs font-medium text-[#b84a2a]">
              {form.formState.errors.password.message}
            </p>
          )}
          <p className="mt-2 text-xs text-[#6c7280]">
            Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
          </p>
        </div>
      </div>

      <button
        type="submit"
        id="btn-register-submit"
        disabled={isPending}
        className="inline-flex w-full items-center group justify-center gap-2 rounded-full bg-[#ff7a45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-[#f2693a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Membuat akun...' : 'Buat akun'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </button>

      <p className="text-center text-sm text-[#6c7280]">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-[#11233f] transition hover:text-[#ff7a45]">
          Masuk
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
