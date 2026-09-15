import { Check, ChevronsUpDown } from 'lucide-react';

import type { AdminTenant } from '@/interfaces/features/tenants';

import { Input } from '@/components/ui/input';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TenantSwitcherMenu({
  tenants,
  activeTenantId,
  query,
  onQueryChange,
  onSwitch,
}: {
  tenants: AdminTenant[];
  activeTenantId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSwitch: (id: string) => void;
}) {
  const activeTenant = tenants.find((tenant) => tenant.id === activeTenantId);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTenants = normalizedQuery
    ? tenants.filter((tenant) => tenant.name.toLowerCase().includes(normalizedQuery))
    : tenants;

  return (
    <SidebarMenu className="mt-3 w-full">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
                {(activeTenant?.code || activeTenantId.slice(0, 2)).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Organisasi saat ini</span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeTenant?.name ?? 'Pilih tenant'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-(--radix-dropdown-menu-trigger-width)">
            <div className="p-2">
              <Input
                placeholder="Cari tenant..."
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
              />
            </div>
            {filteredTenants.map((tenant) => (
              <DropdownMenuItem key={tenant.id} onSelect={() => onSwitch(tenant.id)}>
                {tenant.name}
                {tenant.id === activeTenantId && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
            {filteredTenants.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">Tenant tidak ditemukan.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
