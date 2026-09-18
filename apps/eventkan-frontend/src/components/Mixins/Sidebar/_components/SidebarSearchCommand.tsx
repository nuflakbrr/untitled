import type { Route } from 'next';

import { Home, CornerDownLeft } from 'lucide-react';

import type { SideLinkGroup } from '../_constants/sideLinks.constants';

import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandDialog,
} from '@/components/ui/command';

import { SidebarSearchCommandItem } from './SidebarSearchCommandItem';

export function SidebarSearchCommand({
  open,
  onOpenChange,
  items,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SideLinkGroup[];
  onNavigate: (url: string) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-[15px] bg-eventkan-surface text-eventkan-ink shadow-[0_18px_50px_rgba(17,35,63,.12)]">
        <CommandInput placeholder="Cari Menu..." className="border-none focus:ring-0" />
        <CommandList className="max-h-75">
          <CommandEmpty>Oops! Tidak ada hasil.</CommandEmpty>
          {items.map((group) => (
            <CommandGroup key={group.title} heading={group.title} className="px-2">
              {group.hasChildren ? (
                group.items?.map((item) => (
                  <SidebarSearchCommandItem
                    key={item.title}
                    href={item.url as Route}
                    label={item.title}
                    icon={item.icon}
                    onSelect={onNavigate}
                  />
                ))
              ) : (
                <SidebarSearchCommandItem
                  href={group.url as Route}
                  label={group.title}
                  icon={Home}
                  onSelect={onNavigate}
                />
              )}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex items-center gap-2 border-t border-eventkan-ink/12 bg-eventkan-canvas/50 px-4 py-3 text-[10px] text-eventkan-muted">
          <div className="flex items-center gap-1.5 rounded border border-eventkan-ink/12 bg-eventkan-surface px-1.5 py-0.5 font-mono font-medium">
            <CornerDownLeft className="size-3" />
          </div>
          <span className="font-medium uppercase tracking-wider">Menuju ke Halaman</span>
        </div>
      </Command>
    </CommandDialog>
  );
}
