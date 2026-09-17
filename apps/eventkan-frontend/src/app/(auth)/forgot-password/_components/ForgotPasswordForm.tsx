'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { Mail, Info, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import useForgotPassword from '../_hooks/useForgotPassword';
import { getForgotPasswordInputClass } from '../_libs/getForgotPasswordInputClass.libs';

const ForgotPasswordForm: FC = () => {
  const { emailSent, form, handleSubmit, isPending, sentEmail, setEmailSent } = useForgotPassword();

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
        <FieldLabel htmlFor="forgot-email" className="text-[13px] font-bold text-eventkan-navy">
          Email
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-eventkan-muted" />
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
        {form.formState.errors.email && <FieldError className="text-xs font-medium text-eventkan-peach-ink" errors={[form.formState.errors.email]} />}
      </Field>
      </FieldGroup>

      <div className="flex gap-3 rounded-[16px] bg-eventkan-peach px-4 py-3 text-xs leading-relaxed text-[#8d492e]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Demi keamanan, kami tidak akan memberi tahu apakah email tersebut sudah terdaftar.
        </span>
      </div>

      <Button
        type="submit"
        id="btn-forgot-password-submit"
        disabled={isPending}
        className="inline-flex group h-auto w-full items-center justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Mengirim...' : 'Kirim tautan reset password'}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </Button>

      <p className="text-center text-sm text-eventkan-muted">
        Ingat password kamu?{' '}
        <Link href="/login" className="font-bold text-eventkan-navy transition hover:text-eventkan-accent">
          Masuk
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
