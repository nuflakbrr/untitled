import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { Permission } from '@/interfaces/features/permissions';

import { getPermissionByName } from '@/services/admin/permissions';

import PermissionForm from './_components/PermissionForm';

type Props = {
  params: Promise<{ id: string }>;
};

const PermissionsDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const isNew = decodedId === 'new';

  let initialData: Permission | null = null;

  if (!isNew) {
    const result = await getPermissionByName(decodedId);
    if (!result.success || !result.data) notFound();
    initialData = result.data as Permission;
  }

  return <PermissionForm initialData={initialData} />;
};

export default PermissionsDetailCMS;
