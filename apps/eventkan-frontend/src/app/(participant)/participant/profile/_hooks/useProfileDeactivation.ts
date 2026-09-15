'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { signOut } from '@/lib/authClient';
import { deactivateParticipantAccount } from '@/services/participant/profile';

export function useProfileDeactivation() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: deactivateParticipantAccount,
    onSuccess: async (response) => {
      if (!response.success) {
        toast.error(response.error ?? 'Gagal menangguhkan akun.');
        return;
      }
      toast.success('Akun berhasil ditangguhkan.');
      await signOut();
      router.push('/login');
      router.refresh();
    },
    onError: () => toast.error('Gagal menangguhkan akun.'),
  });

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    deactivateAccount: () => mutation.mutate(),
    isDeactivating: mutation.isPending,
  };
}
