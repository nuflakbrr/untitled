'use client';

import { Mail, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import ReactivateAccountStatus from './ReactivateAccountStatus';
import useReactivateAccount from '../_hooks/useReactivateAccount';
import { getReactivateAccountInputClass } from '../_libs/getReactivateAccountInputClass.libs';

export default function ReactivateAccountForm() {
  const { emailSent, form, reactivated, requestMutation, token } = useReactivateAccount();

  if (token) {
    return <ReactivateAccountStatus variant="token" isReactivated={reactivated} />;
  }

  if (emailSent) {
    return <ReactivateAccountStatus variant="email" />;
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => requestMutation.mutate(values))}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-5">
        <Field className="gap-2" data-invalid={!!form.formState.errors.email}>
          <FieldLabel
            htmlFor="reactivate-email"
            className="text-[13px] font-bold text-eventkan-navy"
          >
            Email
          </FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-eventkan-muted" />
            <input
              id="reactivate-email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              disabled={requestMutation.isPending}
              {...form.register('email')}
              className={`${getReactivateAccountInputClass(Boolean(form.formState.errors.email))} pl-10`}
            />
          </div>
          {form.formState.errors.email && (
            <FieldError
              className="text-xs font-medium text-eventkan-peach-ink"
              errors={[form.formState.errors.email]}
            />
          )}
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        id="btn-reactivate-account-submit"
        disabled={requestMutation.isPending}
        className="group inline-flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,122,69,.2)] transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {requestMutation.isPending ? 'Mengirim...' : 'Kirim tautan aktivasi'}
        {requestMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        )}
      </Button>
    </form>
  );
}
