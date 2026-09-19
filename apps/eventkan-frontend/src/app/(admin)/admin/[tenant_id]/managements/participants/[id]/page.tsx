import { notFound } from 'next/navigation';

import type { User } from '@/interfaces/features/users';

import { getUserById } from '@/services/admin/users';

import UserForm from '../../users/[id]/_components/UserForm';

export default async function ParticipantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';
  let initialData: User | null = null;

  if (!isNew) {
    const result = await getUserById(id);
    if (!result.success || !result.data) return notFound();
    initialData = result.data as User;
  }

  return <UserForm initialData={initialData} />;
}
