'use client';

import type { z } from 'zod';
import type { User } from '@/interfaces/features/users';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { userSchema } from '@/schemas/users';
import { getRoles } from '@/services/admin/roles';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser, deleteUser, updateUser } from '@/services/admin/users';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUserForm = (initialData: User | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      newPassword: '',
      roleId: initialData?.roles?.[0]?.id || '',
      image: initialData?.image || '',
    },
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles-all'],
    queryFn: async () => {
      const result = await getRoles(1, 100);
      return result.success ? result.data : [];
    },
  });

  const roles = rolesData || [];

  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof userSchema>) =>
      initialData ? await updateUser(initialData.id, data) : await createUser(data),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/users');
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/users');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof userSchema>) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    roles,
    isLoadingRoles,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
