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
            className="w-(--radix-dropdown-menu-trigger-width) rounded-[18px] border-eventkan-ink/10 bg-eventkan-surface/95 p-2 text-eventkan-navy shadow-[0_18px_50px_rgba(17,35,63,.14)] backdrop-blur-xl"
          >
            <div className="p-2">
              <Input
                placeholder="Cari tenant..."
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                className="h-9 rounded-xl border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-ink placeholder:text-eventkan-muted focus-visible:border-eventkan-accent focus-visible:ring-eventkan-accent/20"
              />
            </div>
            {filteredTenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => onSwitch(tenant.id)}
                variant="accent"
                className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! focus:bg-eventkan-peach/50! focus:text-eventkan-peach-ink! data-highlighted:bg-eventkan-peach/50! data-highlighted:text-eventkan-peach-ink! data-highlighted:[&_svg]:text-eventkan-accent!"
              >
                {tenant.name}
                {tenant.id === activeTenantId && (
                  <Check className="ml-auto size-4 text-eventkan-accent" />
                )}
              </DropdownMenuItem>
            ))}
            {filteredTenants.length === 0 && (
              <p className="px-3 py-2.5 text-sm text-eventkan-muted">Tenant tidak ditemukan.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
