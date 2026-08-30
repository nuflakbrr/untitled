import {
  listAdminRolesAction,
  listAdminPermissionsAction,
  listRolePermissionIDsAction,
} from 'src/auth/actions';

import { AdminResourceForm } from '../../../admin-resource-form';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, permissionResult, assignedResult] = await Promise.all([
    listAdminRolesAction(),
    listAdminPermissionsAction(),
    listRolePermissionIDsAction(id),
  ]);
  const row = result.data?.find((item) => item.id === id);
  return (
    <AdminResourceForm
      resource="roles"
      id={id}
      initial={row ?? {}}
      permissions={permissionResult.data ?? []}
      assignedPermissionIDs={assignedResult.data ?? []}
    />
  );
}
