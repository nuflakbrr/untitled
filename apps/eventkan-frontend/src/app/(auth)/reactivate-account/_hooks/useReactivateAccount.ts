'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  accountReactivationSchema,
  type AccountReactivationValues,
} from '@/schemas/auth';
import {
  reactivateAccountAction,
  requestAccountReactivationAction,
} from '@/services/public/auth';

export default function useReactivateAccount() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [emailSent, setEmailSent] = useState(false);
  const [reactivated, setReactivated] = useState(false);

  const form = useForm<AccountReactivationValues>({
    resolver: zodResolver(accountReactivationSchema),
    defaultValues: { email: '' },
  });

  const requestMutation = useMutation({
    mutationFn: (values: AccountReactivationValues) =>
      requestAccountReactivationAction(values.email),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal memproses permintaan aktivasi akun.');
        return;
      }
      setEmailSent(true);
    },
    onError: () => toast.error('Gagal memproses permintaan aktivasi akun.'),
  });

  const { mutate: confirmAccount } = useMutation({
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
    if (token) confirmAccount(token);
  }, [confirmAccount, token]);

  return {
    emailSent,
    form,
    reactivated,
    requestMutation,
    token,
  };
}
