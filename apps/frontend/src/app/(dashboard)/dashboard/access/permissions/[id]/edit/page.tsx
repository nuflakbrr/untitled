import { listAdminPermissionsAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../../admin-resource-form';

export default async function EditPermissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await listAdminPermissionsAction();
  const row = result.data?.find((item) => item.id === id);
  return (
    <AdminResourceForm
      resource="roles/permissions"
      routeResource="permissions"
      id={id}
      initial={row ?? {}}
    />
  );
}
