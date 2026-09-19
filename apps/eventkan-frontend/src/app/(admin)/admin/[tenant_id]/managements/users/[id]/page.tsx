import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { User } from '@/interfaces/features/users';

import { getUserById } from '@/services/admin/users';

import UserForm from './_components/UserForm';

type Props = {
  params: Promise<{ id: string }>;
};

const UserDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isNew = id === 'new';

  let initialData: User | null = null;

  if (!isNew) {
    const result = await getUserById(id);
    if (result.success && result.data) {
      initialData = result.data as User;
    } else {
      return notFound();
    }
  }

  return <UserForm initialData={initialData} />;
};

export default UserDetailCMS;
