'use client';

import Link from 'next/link';
import { Cog, Home, LogOut, ChevronsUpDown } from 'lucide-react';

import type { UserSettingsModalProps } from '@/interfaces/features/auth';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type SidebarUser = UserSettingsModalProps['user'];

export function SidebarUserMenu({
  user,
  onSettings,
  onLogout,
}: {
  user: SidebarUser;
  onSettings: () => void;
  onLogout: () => void;
}) {
  const { isMobile } = useSidebar();
  const initials = user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-auto cursor-pointer rounded-[15px] px-2 py-2.5 text-eventkan-ink hover:bg-eventkan-canvas hover:text-eventkan-ink data-[state=open]:border-eventkan-navy/20 data-[state=open]:bg-eventkan-canvas data-[state=open]:text-eventkan-navy"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-eventkan-navy text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-eventkan-muted">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 rounded-[22px] border-eventkan-ink/10 bg-eventkan-surface/95 p-2 text-eventkan-navy shadow-[0_18px_50px_rgba(17,35,63,.14)] backdrop-blur-xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="rounded-2xl bg-eventkan-canvas p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full bg-eventkan-accent text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-eventkan-navy">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs font-normal text-eventkan-muted">
                    {user.email}
                  </span>
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="accent"
                onClick={onSettings}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! focus:bg-eventkan-peach/50! focus:text-eventkan-peach-ink! data-highlighted:bg-eventkan-peach/50! data-highlighted:text-eventkan-peach-ink! data-highlighted:[&_svg]:text-eventkan-accent!"
              >
                <Cog className="size-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="accent"
                className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! focus:bg-eventkan-peach/50! focus:text-eventkan-peach-ink! data-highlighted:bg-eventkan-peach/50! data-highlighted:text-eventkan-peach-ink! data-highlighted:[&_svg]:text-eventkan-accent!"
                asChild
              >
                <Link href="/">
                  <Home className="size-4 text-eventkan-accent" />
                  Kembali ke Beranda
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={onLogout}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-red-700 hover:bg-red-50! hover:text-red-700! focus:bg-red-50! focus:text-red-700! data-highlighted:bg-red-50! data-highlighted:text-red-700!"
            >
              <LogOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
