import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getMyTenantsAction } from '@/services/public/auth';

export default async function AdminEntryPage() {
  const session = await auth.api.getSession();
  if (!session?.user) redirect('/login');

  const tenantId = session.tenantId ?? (await getMyTenantsAction())[0]?.id;
  if (!tenantId) redirect('/login?tenant-selection=unavailable');

  redirect(`/admin/${tenantId}/dashboard`);
}
