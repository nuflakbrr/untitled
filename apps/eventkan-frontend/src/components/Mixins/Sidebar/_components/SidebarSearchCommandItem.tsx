import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';

import { CommandItem } from '@/components/ui/command';

export function SidebarSearchCommandItem({
  href,
  label,
  icon: Icon,
  onSelect,
}: {
  href: Route;
  label: string;
  icon: LucideIcon;
  onSelect: (url: string) => void;
}) {
  return (
    <CommandItem
      onSelect={() => onSelect(href)}
      className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-eventkan-navy outline-none [&_svg]:text-eventkan-accent! hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! hover:[&_svg]:text-eventkan-accent! aria-selected:bg-eventkan-peach/50! aria-selected:text-eventkan-peach-ink! aria-selected:[&_svg]:text-eventkan-accent!"
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
    </CommandItem>
  );
}
