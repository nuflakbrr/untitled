'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

import { signIn } from '@/lib/authClient';
import { loginSchema, type LoginValues } from '@/schemas/auth';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { getLoginInputClass } from '../_libs/getLoginInputClass.libs';
import { sanitizeCallbackUrl } from '../_libs/sanitizeCallbackUrl.libs';

const LoginForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackURL') || searchParams.get('redirectTo');
  const targetUrl = sanitizeCallbackUrl(rawCallbackUrl);
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

  const onSubmit = (values: LoginValues) => handleLogin(values);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FieldGroup className="gap-5">
      <Field className="gap-2" data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="login-email" className="text-[13px] font-bold text-[#11233f]">
          Email
        </FieldLabel>
        <input
          id="login-email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          disabled={isPending}
          {...form.register('email')}
          className={getLoginInputClass(Boolean(form.formState.errors.email))}
        />
        {form.formState.errors.email && <FieldError className="text-xs font-medium text-[#b84a2a]" errors={[form.formState.errors.email]} />}
      </Field>

      <Field className="gap-2" data-invalid={!!form.formState.errors.password}>
        <FieldLabel htmlFor="login-password" className="text-[13px] font-bold text-[#11233f]">
          Password
        </FieldLabel>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            autoComplete="current-password"
            disabled={isPending}
            {...form.register('password')}
            className={`${getLoginInputClass(Boolean(form.formState.errors.password))} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6c7280] transition hover:bg-[#f6f3eb] hover:text-[#11233f]"
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password && <FieldError className="text-xs font-medium text-[#b84a2a]" errors={[form.formState.errors.password]} />}
      </Field>
      </FieldGroup>

      <div className="-mt-2 flex justify-end">
        <Link
          href={'/forgot-password' as Route}
          className="text-xs font-semibold text-[#11233f] transition hover:text-[#ff7a45]"
        >
          Lupa password?
        </Link>
      </div>

      <p className="-mt-2 text-center text-xs text-[#6c7280]">
        Akun nonaktif?{' '}
        <Link
          href={'/reactivate-account' as Route}
          className="font-semibold text-[#11233f] transition hover:text-[#ff7a45]"
        >
          Aktifkan kembali
        </Link>
      </p>

      <button
        type="submit"
        id="btn-login-submit"
        disabled={isPending}
        className="inline-flex w-full group items-center justify-center gap-2 rounded-full bg-[#ff7a45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-[#f2693a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Memproses...' : 'Masuk'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </button>

      <p className="text-center text-sm text-[#6c7280]">
        Belum punya akun?{' '}
        <Link href="/register" className="font-bold text-[#11233f] transition hover:text-[#ff7a45]">
          Daftar
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
