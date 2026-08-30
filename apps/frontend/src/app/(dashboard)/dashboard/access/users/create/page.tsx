import { listTenantsAction, listAdminRolesAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../admin-resource-form';

export default async function CreateUserPage() {
  const [roleResult, tenantResult] = await Promise.all([
    listAdminRolesAction(),
    listTenantsAction(),
  ]);
  return (
    <AdminResourceForm
      resource="users"
      roles={roleResult.data ?? []}
      tenants={tenantResult.data ?? []}
    />
  );
}
