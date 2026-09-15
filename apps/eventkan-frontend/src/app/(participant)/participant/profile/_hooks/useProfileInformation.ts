'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import type { UpdateNameValues } from '@/schemas/profile';
import type { ParticipantProfileFormProps } from '@/interfaces/features/users';

import { updateNameSchema } from '@/schemas/profile';
import { updateUserProfile } from '@/services/participant/profile';

export function useProfileInformation({ user }: ParticipantProfileFormProps) {
  const router = useRouter();
  const form = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name, image: user.image ?? '' },
  });
  const mutation = useMutation({
    mutationFn: async (values: UpdateNameValues) => {
      const response = await updateUserProfile(values.name, values.image || null);
      if (!response.success) throw new Error(response.error ?? 'Gagal memperbarui profil.');
    },
    onSuccess: () => {
      toast.success('Profil berhasil diperbarui.');
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { form, saveProfile: mutation.mutate, isSaving: mutation.isPending };
}
