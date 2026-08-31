import {
  listAdminRolesAction,
  listAdminPermissionsAction,
  listRolePermissionIDsAction,
} from 'src/auth/actions';
import { requireSession } from 'src/auth/server';
import { redirect } from 'next/navigation';

import { AdminResourceForm } from '../../../admin-resource-form';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession('role.read');
  const [result, permissionResult, assignedResult] = await Promise.all([
    listAdminRolesAction(),
    listAdminPermissionsAction(),
    listRolePermissionIDsAction(id),
  ]);
  const row = result.data?.find((item) => item.id === id);
  if (!row || (!session.is_super_admin && id === session.user.role_id) || row.name === 'root_superadmin') {
    redirect('/error/403');
  }
  return (
    <AdminResourceForm
      resource="roles"
      id={id}
      initial={row ?? {}}
      permissions={permissionResult.data ?? []}
      assignedPermissionIDs={assignedResult.data ?? []}
      readOnly={!session.is_super_admin && !row?.tenant_id}
    />
  );
}
