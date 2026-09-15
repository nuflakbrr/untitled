'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { authClient } from '@/lib/authClient';
import { FieldGroup } from '@/components/ui/field';
import { resetPasswordSchema, type ResetPasswordValues } from '@/schemas/auth';

import PasswordField from './PasswordField';
import ResetPasswordInvalid from './ResetPasswordInvalid';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { getPasswordRules } from '../_libs/getPasswordRules';

const ResetPasswordForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
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
  const rules = getPasswordRules(password);

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
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    },
    onError: (error: Error) => toast.error(error.message),
  });

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

        <div className="grid gap-2 rounded-[16px] border border-[#111927]/10 bg-white/45 p-4">
          {rules.map((rule) => (
            <div
              key={rule.label}
              className={`flex items-center gap-2 text-xs ${rule.valid ? 'text-[#36784b]' : 'text-[#6c7280]'}`}
            >
              <span
                className={`grid h-4.5 w-4.5 place-items-center rounded-full border ${rule.valid ? 'border-[#b8dac1] bg-[#e6f3e9]' : 'border-[#111927]/10'}`}
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
        <p className="-mt-3 text-xs font-medium text-[#36784b]">Password cocok.</p>
      )}

      <div className="rounded-[14px] bg-[#ffe5d8] px-4 py-3 text-xs leading-relaxed text-[#8d492e]">
        Link reset hanya berlaku satu kali dan dapat memiliki batas waktu. Jika tidak valid, minta
        link baru dari halaman lupa password.
      </div>

      <button
        type="submit"
        id="btn-reset-password-submit"
        disabled={isPending || !form.formState.isValid}
        className="inline-flex group w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ff7a45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-[#f2693a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Menyimpan...' : 'Simpan password baru'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </button>

      <p className="text-center text-sm text-[#6c7280]">
        Ingat password kamu?{' '}
        <Link href="/login" className="font-bold text-[#11233f] transition hover:text-[#ff7a45]">
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
