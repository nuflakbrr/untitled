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

import type { RegisterValues } from '@/schemas/auth';

import { registerSchema } from '@/schemas/auth';
import { registerAction } from '@/services/public/auth';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { getRegisterInputClass } from '../_libs/inputClass.libs';

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
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <Field className="gap-2 sm:col-span-2" data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="reg-name" className="text-[13px] font-bold text-eventkan-navy">
            Nama lengkap
          </FieldLabel>
          <input
            id="reg-name"
            type="text"
            placeholder="Nama kamu"
            autoComplete="name"
            disabled={isPending}
            {...form.register('name')}
            className={getRegisterInputClass(Boolean(form.formState.errors.name))}
          />
          {form.formState.errors.name && <FieldError className="text-xs font-medium text-eventkan-peach-ink" errors={[form.formState.errors.name]} />}
        </Field>

        <Field className="gap-2 sm:col-span-2" data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="reg-email" className="text-[13px] font-bold text-eventkan-navy">
            Email
          </FieldLabel>
          <input
            id="reg-email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            disabled={isPending}
            {...form.register('email')}
            className={getRegisterInputClass(Boolean(form.formState.errors.email))}
          />
          {form.formState.errors.email && <FieldError className="text-xs font-medium text-eventkan-peach-ink" errors={[form.formState.errors.email]} />}
        </Field>

        <Field className="gap-2 sm:col-span-2" data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="reg-password" className="text-[13px] font-bold text-eventkan-navy">
            Password
          </FieldLabel>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-eventkan-muted transition hover:bg-eventkan-canvas hover:text-eventkan-navy"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && <FieldError className="text-xs font-medium text-eventkan-peach-ink" errors={[form.formState.errors.password]} />}
          <p className="mt-2 text-xs text-eventkan-muted">
            Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
          </p>
        </Field>
      </FieldGroup>

      <button
        type="submit"
        id="btn-register-submit"
        disabled={isPending}
        className="inline-flex w-full items-center group justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Membuat akun...' : 'Buat akun'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </button>

      <p className="text-center text-sm text-eventkan-muted">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-eventkan-navy transition hover:text-eventkan-accent">
          Masuk
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
