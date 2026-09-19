'use client';

import { usePathname } from 'next/navigation';

export function useTenantId() {
  const pathname = usePathname();
  return pathname.match(/^\/admin\/([^/]+)/)?.[1];
}
