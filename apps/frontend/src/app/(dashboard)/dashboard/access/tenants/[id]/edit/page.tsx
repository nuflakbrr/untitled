import { requireSession } from 'src/auth/server';
import { getTenantAction, listTenantsAction } from 'src/auth/actions';

import { AdminResourceForm } from '../../../admin-resource-form';

export default async function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession('tenant.update');
  // getTenantAction works for a non-superadmin editing their own tenant;
  // listTenantsAction (used only for the parent-tenant picker) is superadmin-only.
  const [row, tenants] = await Promise.all([
    getTenantAction(id),
    session.is_super_admin ? listTenantsAction() : Promise.resolve(null),
  ]);
  return (
    <AdminResourceForm
      resource="tenants"
      id={id}
      initial={row.data ?? {}}
      tenants={tenants?.data ?? []}
      isSuperAdmin={session.is_super_admin}
    />
  );
}
