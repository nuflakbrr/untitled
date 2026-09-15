import type { User } from '@/interfaces/features/users';

import { notFound } from 'next/navigation';
import { getUserById } from '@/services/admin/users';

import UserForm from '../../users/[name]/_components/UserForm';

export default async function ParticipantDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const result = await getUserById(name);
  if (!result.success || !result.data) return notFound();
  return <UserForm initialData={result.data as User} />;
}
