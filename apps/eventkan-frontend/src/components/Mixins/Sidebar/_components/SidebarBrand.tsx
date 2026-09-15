import Image from 'next/image';

import type { AdminTenant } from '@/interfaces/features/tenants';

import { SidebarHeader } from '@/components/ui/sidebar';

import { TenantSwitcher } from '../TenantSwitcher';

export function SidebarBrand({
  tenants,
  activeTenantId,
  isRootSuperadmin,
  onSwitch,
}: {
  tenants: AdminTenant[];
  activeTenantId: string;
  isRootSuperadmin: boolean;
  onSwitch: (id: string) => void;
}) {
  return (
    <SidebarHeader className="flex items-center justify-center p-4">
      <Image
        className="h-25 w-auto"
        src="/assets/img/EVENTKAN-PRIMARY.png"
        alt="EVENTKAN"
        width={120}
        height={40}
        loading="lazy"
      />
      {(tenants.length > 1 || isRootSuperadmin) && tenants.length > 0 && (
        <TenantSwitcher tenants={tenants} activeTenantId={activeTenantId} onSwitch={onSwitch} />
      )}
    </SidebarHeader>
  );
}
