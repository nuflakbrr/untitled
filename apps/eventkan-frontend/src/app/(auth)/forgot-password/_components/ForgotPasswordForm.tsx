'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Info, Loader2, ArrowRight } from 'lucide-react';

import { authClient } from '@/lib/authClient';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/schemas/auth';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import { getForgotPasswordInputClass } from '../_libs/getForgotPasswordInputClass.libs';

const ForgotPasswordForm: FC = () => {
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

      if (error) {
        throw new Error('Gagal mengirim email. Periksa kembali alamat email Anda.');
      }

      return values.email;
    },
    onSuccess: (email) => {
      setSentEmail(email);
      setEmailSent(true);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (emailSent) {
    return <ForgotPasswordSuccess email={sentEmail} onRetry={() => setEmailSent(false)} />;
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => handleSubmit(values))}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-5">
      <Field className="gap-2" data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="forgot-email" className="text-[13px] font-bold text-[#11233f]">
          Email
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7280]" />
          <input
            id="forgot-email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            disabled={isPending}
            {...form.register('email')}
            className={getForgotPasswordInputClass(Boolean(form.formState.errors.email))}
          />
        </div>
        {form.formState.errors.email && <FieldError className="text-xs font-medium text-[#b84a2a]" errors={[form.formState.errors.email]} />}
      </Field>
      </FieldGroup>

      <div className="flex gap-3 rounded-[16px] bg-[#ffe5d8] px-4 py-3 text-xs leading-relaxed text-[#8d492e]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Demi keamanan, kami tidak akan memberi tahu apakah email tersebut sudah terdaftar.
        </span>
      </div>

      <button
        type="submit"
        id="btn-forgot-password-submit"
        disabled={isPending}
        className="inline-flex group w-full items-center justify-center gap-2 rounded-full bg-[#ff7a45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-[#f2693a] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Mengirim...' : 'Kirim tautan reset password'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </button>

      <p className="text-center text-sm text-[#6c7280]">
        Ingat password kamu?{' '}
        <Link href="/login" className="font-bold text-[#11233f] transition hover:text-[#ff7a45]">
          Masuk
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
