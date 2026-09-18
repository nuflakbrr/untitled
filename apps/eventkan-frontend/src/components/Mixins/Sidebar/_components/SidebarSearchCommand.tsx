import type { Route } from 'next';

import { Home, CornerDownLeft } from 'lucide-react';

import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandDialog,
} from '@/components/ui/command';

import { sideLinks } from '../_constants/sideLinks.constants';

export function SidebarSearchCommand({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (url: string) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-[15px] border border-eventkan-ink/12 bg-eventkan-surface text-eventkan-ink shadow-[0_18px_50px_rgba(17,35,63,.12)]">
        <CommandInput placeholder="Cari Menu..." className="border-none focus:ring-0" />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>Oops! Tidak ada hasil.</CommandEmpty>
          {sideLinks.navMain.map((group) => (
            <CommandGroup key={group.title} heading={group.title} className="px-2">
              {group.hasChildren ? (
                group.items?.map((item) => (
                  <SearchCommandItem
                    key={item.title}
                    href={item.url as Route}
                    label={item.title}
                    icon={item.icon}
                    onSelect={onNavigate}
                  />
                ))
              ) : (
                <SearchCommandItem
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

function SearchCommandItem({
  href,
  label,
  icon: Icon,
  onSelect,
}: {
  href: Route;
  label: string;
  icon: typeof Home;
  onSelect: (url: string) => void;
}) {
  return (
    <CommandItem
      onSelect={() => onSelect(href)}
      className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none hover:bg-accent aria-selected:bg-accent"
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-eventkan-muted group-hover:text-eventkan-ink" />
        <span>{label}</span>
      </div>
    </CommandItem>
  );
}
