import type { ReactNode } from 'react';

import TenantCookieSync from './_components/TenantCookieSync';

export default async function TenantAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenant_id: string }>;
}) {
  const { tenant_id: tenantId } = await params;
  return <TenantCookieSync tenantId={tenantId}>{children}</TenantCookieSync>;
}
