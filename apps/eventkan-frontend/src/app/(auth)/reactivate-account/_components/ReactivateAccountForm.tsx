'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { accountReactivationSchema, type AccountReactivationValues } from '@/schemas/auth';
import { reactivateAccountAction, requestAccountReactivationAction } from '@/services/public/auth';

const inputClass =
  'h-auto w-full rounded-[14px] border border-eventkan-ink/12 bg-eventkan-surface px-3.5 py-3 text-sm text-eventkan-navy outline-none transition placeholder:text-eventkan-muted/70 focus:border-eventkan-accent focus:ring-3 focus:ring-eventkan-accent/15';

export default function ReactivateAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [emailSent, setEmailSent] = useState(false);
  const [reactivated, setReactivated] = useState(false);
  const form = useForm<AccountReactivationValues>({
    resolver: zodResolver(accountReactivationSchema),
    defaultValues: { email: '' },
  });

  const requestMutation = useMutation({
    mutationFn: (values: AccountReactivationValues) => requestAccountReactivationAction(values.email),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal memproses permintaan aktivasi akun.');
        return;
      }
      setEmailSent(true);
    },
    onError: () => toast.error('Gagal memproses permintaan aktivasi akun.'),
  });

  const confirmMutation = useMutation({
    mutationFn: (value: string) => reactivateAccountAction(value),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Tautan aktivasi tidak valid.');
        return;
      }
      setReactivated(true);
    },
    onError: () => toast.error('Tautan aktivasi tidak valid atau telah kedaluwarsa.'),
  });

  useEffect(() => {
    if (token) confirmMutation.mutate(token);
    // Token is intentionally consumed once when the email link is opened.
     
  }, [token]);

  if (token) {
    return (
      <div className="space-y-4 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-eventkan-green-ink" />
        <h3 className="font-display text-xl font-extrabold text-eventkan-navy">
          {reactivated ? 'Akun berhasil diaktifkan.' : 'Memproses aktivasi akun...'}
        </h3>
        {reactivated && (
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-eventkan-navy px-5 py-3 text-sm font-bold text-white">
            Masuk ke EVENTKAN <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="space-y-3 text-center">
        <Mail className="mx-auto h-10 w-10 text-eventkan-green-ink" />
        <h3 className="font-display text-xl font-extrabold text-eventkan-navy">Cek emailmu.</h3>
        <p className="text-sm leading-relaxed text-eventkan-muted">
          Jika akun dapat diaktifkan kembali, kami akan mengirim tautan ke email tersebut.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((values) => requestMutation.mutate(values))} className="space-y-5" noValidate>
      <FieldGroup className="gap-5">
        <Field className="gap-2" data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="reactivate-email" className="text-[13px] font-bold text-eventkan-navy">Email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-eventkan-muted" />
            <input id="reactivate-email" type="email" placeholder="nama@email.com" autoComplete="email" disabled={requestMutation.isPending} {...form.register('email')} className={`${inputClass} pl-10`} />
          </div>
          {form.formState.errors.email && <FieldError className="text-xs font-medium text-eventkan-peach-ink" errors={[form.formState.errors.email]} />}
        </Field>
      </FieldGroup>
      <button type="submit" disabled={requestMutation.isPending} className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-eventkan-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-eventkan-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
        {requestMutation.isPending ? 'Mengirim...' : 'Kirim tautan aktivasi'}
        {requestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />}
      </button>
    </form>
  );
}
