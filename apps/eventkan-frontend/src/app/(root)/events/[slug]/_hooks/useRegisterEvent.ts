'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { registerToEvent } from '@/services/participant/registrations';

export function useRegisterEvent(eventId: string) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: onRegister, isPending } = useMutation({
    mutationFn: () => registerToEvent(eventId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal melakukan pendaftaran event.');
        return;
      }

      toast.success(result.message ?? 'Pendaftaran event berhasil.');
      setIsOpen(false);
      router.refresh();
      router.push('/participant/dashboard');
    },
    onError: () => toast.error('Gagal melakukan pendaftaran event.'),
  });

  return { isOpen, isPending, onRegister, setIsOpen };
}
