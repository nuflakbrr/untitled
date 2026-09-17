'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import useLogin from '../_hooks/useLogin';
import { getLoginInputClass } from '../_libs/getLoginInputClass.libs';

const LoginForm: FC = () => {
  const { form, handleLogin, isPending, setShowPassword, showPassword } = useLogin();

  return (
    <form
      onSubmit={form.handleSubmit((values) => handleLogin(values))}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-5">
        <Field className="gap-2" data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="login-email" className="text-[13px] font-bold text-eventkan-navy">
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
          {form.formState.errors.email && (
            <FieldError
              className="text-xs font-medium text-eventkan-peach-ink"
              errors={[form.formState.errors.email]}
            />
          )}
        </Field>

        <Field className="gap-2" data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="login-password" className="text-[13px] font-bold text-eventkan-navy">
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
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-eventkan-muted transition hover:bg-eventkan-canvas hover:text-eventkan-navy"
              tabIndex={-1}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {form.formState.errors.password && (
            <FieldError
              className="text-xs font-medium text-eventkan-peach-ink"
              errors={[form.formState.errors.password]}
            />
          )}
        </Field>
      </FieldGroup>

      <div className="-mt-2 flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-eventkan-navy transition hover:text-eventkan-accent"
        >
          Lupa password?
        </Link>
      </div>

      <Button
        type="submit"
        id="btn-login-submit"
        disabled={isPending}
        className="inline-flex h-auto w-full group items-center justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Memproses...' : 'Masuk'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </Button>

      <p className="text-center text-sm text-eventkan-muted">
        Belum punya akun?{' '}
        <Link
          href="/register"
          className="font-bold text-eventkan-navy transition hover:text-eventkan-accent"
        >
          Daftar
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
