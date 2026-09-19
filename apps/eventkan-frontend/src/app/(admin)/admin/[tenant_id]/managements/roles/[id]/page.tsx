import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { Role } from '@/interfaces/features/roles';

import { getRoleById } from '@/services/admin/roles';

import RoleForm from './_components/RoleForm';

type Props = {
  params: Promise<{ id: string }>;
};

const RolesDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isNew = id === 'new';

  let initialData: Role | null = null;

  if (!isNew) {
    const result = await getRoleById(id);
    if (!result.success || !result.data) notFound();
    initialData = result.data as Role;
  }

  return <RoleForm initialData={initialData} />;
};

export default RolesDetailCMS;
