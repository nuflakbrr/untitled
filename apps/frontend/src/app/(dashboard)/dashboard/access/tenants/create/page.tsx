import { requireSession } from 'src/auth/server';
import { listTenantsAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../admin-resource-form';

export default async function CreateTenantPage() {
  const session = await requireSession('tenant.create');
  // Non-superadmin tenant admins can only create a child of their own tenant
  // (enforced server-side) — they have no use for the full tenant list.
  const result = session.is_super_admin ? await listTenantsAction() : null;
  return (
    <AdminResourceForm
      resource="tenants"
      tenants={result?.data ?? []}
      isSuperAdmin={session.is_super_admin}
    />
  );
}
