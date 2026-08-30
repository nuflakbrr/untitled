import { listTenantsAction, listAdminRolesAction, listAdminUsersAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../../admin-resource-form';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, roleResult, tenantResult] = await Promise.all([
    listAdminUsersAction(),
    listAdminRolesAction(),
    listTenantsAction(),
  ]);
  const row = result.data?.find((item) => item.id === id);
  return (
    <AdminResourceForm
      resource="users"
      id={id}
      initial={row ?? {}}
      roles={roleResult.data ?? []}
      tenants={tenantResult.data ?? []}
    />
  );
}
