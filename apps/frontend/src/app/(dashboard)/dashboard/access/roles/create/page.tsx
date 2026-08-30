import { listAdminPermissionsAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../admin-resource-form';

export default async function CreateRolePage() {
  const result = await listAdminPermissionsAction();
  return <AdminResourceForm resource="roles" permissions={result.data ?? []} />;
}
