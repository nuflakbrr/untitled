'use client';

import type { ReactNode } from 'react';

import { useEffect } from 'react';

export default function TenantCookieSync({
  tenantId,
  children,
}: {
  tenantId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.cookie = `sitivent_active_tenant=${encodeURIComponent(tenantId)}; path=/; samesite=lax`;
  }, [tenantId]);

  return children;
}
