'use client';

import { useState } from 'react';

import type { AdminTenant } from '@/interfaces/features/tenants';

import { TenantSwitcherMenu } from './_components/TenantSwitcherMenu';

export function TenantSwitcher({
  tenants,
  activeTenantId,
  onSwitch,
}: {
  tenants: AdminTenant[];
  activeTenantId: string;
  onSwitch: (id: string) => void;
}) {
  const [query, setQuery] = useState('');

  return (
    <TenantSwitcherMenu
      tenants={tenants}
      activeTenantId={activeTenantId}
      query={query}
      onQueryChange={setQuery}
      onSwitch={onSwitch}
    />
  );
}
