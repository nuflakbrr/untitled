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
            <SidebarMenuButton
              size="lg"
              className="h-auto rounded-[15px] border border-eventkan-ink/12 bg-eventkan-surface p-3 hover:bg-eventkan-canvas"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-eventkan-navy text-[11px] font-extrabold text-white">
                {(activeTenant?.code || activeTenantId.slice(0, 2)).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Organisasi saat ini</span>
                <span className="truncate text-xs text-eventkan-muted">
                  {activeTenant?.name ?? 'Pilih tenant'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width)"
          >
            <div className="p-2">
              <Input
                placeholder="Cari tenant..."
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
              />
            </div>
            {filteredTenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => onSwitch(tenant.id)}
                className="cursor-pointer"
              >
                {tenant.name}
                {tenant.id === activeTenantId && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
            {filteredTenants.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-eventkan-muted">Tenant tidak ditemukan.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
