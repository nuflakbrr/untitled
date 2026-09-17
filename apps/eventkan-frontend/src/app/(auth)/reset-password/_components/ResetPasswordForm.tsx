'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { Check, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';

import PasswordField from './PasswordField';
import ResetPasswordInvalid from './ResetPasswordInvalid';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import useResetPassword from '../_hooks/useResetPassword';

const ResetPasswordForm: FC = () => {
  const {
    confirmPassword,
    form,
    handleReset,
    isPending,
    password,
    rules,
    setShowConfirm,
    setShowPassword,
    showConfirm,
    showPassword,
    success,
    token,
  } = useResetPassword();

  if (!token) return <ResetPasswordInvalid />;
  if (success) return <ResetPasswordSuccess />;

  return (
    <form
      onSubmit={form.handleSubmit((values) => handleReset(values))}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-5">
        <PasswordField
          id="reset-password"
          label="Password baru"
          error={form.formState.errors.password?.message}
          register={form.register}
          valueName="password"
          showPassword={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
        />

        <div className="grid gap-2 rounded-[16px] border border-eventkan-ink/10 bg-white/45 p-4">
          {rules.map((rule) => (
            <div
              key={rule.label}
              className={`flex items-center gap-2 text-xs ${rule.valid ? 'text-eventkan-green-ink' : 'text-eventkan-muted'}`}
            >
              <span
                className={`grid h-4.5 w-4.5 place-items-center rounded-full border ${rule.valid ? 'border-[#b8dac1] bg-[#e6f3e9]' : 'border-eventkan-ink/10'}`}
              >
                {rule.valid && <Check className="h-3 w-3" />}
              </span>
              {rule.label}
            </div>
          ))}
        </div>

        <PasswordField
          id="reset-confirm"
          label="Konfirmasi password baru"
          error={form.formState.errors.confirmPassword?.message}
          register={form.register}
          valueName="confirmPassword"
          showPassword={showConfirm}
          onToggle={() => setShowConfirm((value) => !value)}
        />
      </FieldGroup>

      {password && confirmPassword && password === confirmPassword && (
        <p className="-mt-3 text-xs font-medium text-eventkan-green-ink">Password cocok.</p>
      )}

      <div className="rounded-[14px] bg-eventkan-peach px-4 py-3 text-xs leading-relaxed text-[#8d492e]">
        Link reset hanya berlaku satu kali dan dapat memiliki batas waktu. Jika tidak valid, minta
        link baru dari halaman lupa password.
      </div>

      <Button
        type="submit"
        id="btn-reset-password-submit"
        disabled={isPending || !form.formState.isValid}
        className="inline-flex group h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Menyimpan...' : 'Simpan password baru'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </Button>

      <p className="text-center text-sm text-eventkan-muted">
        Ingat password kamu?{' '}
        <Link href="/login" className="font-bold text-eventkan-navy transition hover:text-eventkan-accent">
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
