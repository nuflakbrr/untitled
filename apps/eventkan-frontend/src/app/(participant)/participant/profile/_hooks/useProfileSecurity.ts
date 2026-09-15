'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import type { ChangePasswordValues } from '@/schemas/profile';

import { signOut } from '@/lib/authClient';
import { changePasswordSchema } from '@/schemas/profile';
import { changeParticipantPassword } from '@/services/participant/profile';

export function useProfileSecurity() {
  const router = useRouter();
  const [visibility, setVisibility] = useState({ current: false, next: false, confirm: false });
  const [pendingValues, setPendingValues] = useState<ChangePasswordValues | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const mutation = useMutation({
    mutationFn: async (values: ChangePasswordValues) => {
      const response = await changeParticipantPassword(values.currentPassword, values.newPassword);
      if (!response.success) throw new Error(response.error ?? 'Gagal mengganti password.');
      await signOut();
    },
    onSuccess: () => {
      toast.success('Password berhasil diperbarui. Silakan login kembali.');
      router.push('/login');
      router.refresh();
    },
    onError: (error: Error) => {
      closeModal();
      toast.error(error.message || 'Gagal mengganti password.');
    },
  });

  const toggleVisibility = (key: keyof typeof visibility) =>
    setVisibility((state) => ({ ...state, [key]: !state[key] }));
  const submitPasswordChange = (values: ChangePasswordValues) => {
    setPendingValues(values);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (mutation.isPending) return;
    setIsModalOpen(false);
    setPendingValues(null);
  };
  const confirmPasswordChange = () => {
    if (pendingValues) mutation.mutate(pendingValues);
  };

  return {
    form,
    visibility,
    toggleVisibility,
    submitPasswordChange,
    closeModal,
    confirmPasswordChange,
    isModalOpen,
    isChanging: mutation.isPending,
  };
}
