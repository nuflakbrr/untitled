'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LogOut, UserCircle, ChevronDown, LayoutDashboard } from 'lucide-react';

import type { NavbarUser } from '@/interfaces/navbar';

import { signOut } from '@/lib/authClient';
import { getInitials } from '@/lib/getInitials';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  user: NavbarUser;
  isAdmin: boolean;
  tenantId?: string | null;
}

const UserMenu: FC<UserMenuProps> = ({ user, isAdmin, tenantId }) => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const dashboardHref = isAdmin
    ? tenantId
      ? `/admin/${tenantId}/dashboard`
      : '/admin'
    : '/participant/dashboard';
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) throw new Error('Gagal keluar dari sistem.');
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      window.location.href = '/';
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Menu akun"
            className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-eventkan-ink/10 bg-white/60 p-1.5 pr-3 text-left shadow-[0_8px_24px_rgba(17,35,63,.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-eventkan-navy/25"
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-eventkan-navy text-xs font-bold tracking-wide text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-28 sm:grid">
              {/* <span className="text-[10px] font-bold uppercase tracking-[.12em] text-eventkan-accent">
                Akun saya
              </span> */}
              <span className="truncate text-sm font-bold text-eventkan-navy">{user.name}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-eventkan-muted transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 rounded-[22px] border-eventkan-ink/10 bg-eventkan-surface/95 p-2 text-eventkan-navy shadow-[0_18px_50px_rgba(17,35,63,.14)] backdrop-blur-xl"
        >
          <DropdownMenuLabel className="rounded-2xl bg-eventkan-canvas p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-eventkan-accent text-xs font-bold text-white">
                  {getInitials(user.name)}
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
            {!isAdmin && (
              <DropdownMenuItem variant="accent" asChild>
                <Link
                  href="/participant/profile"
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! focus:bg-eventkan-peach/50! focus:text-eventkan-peach-ink! data-highlighted:bg-eventkan-peach/50! data-highlighted:text-eventkan-peach-ink! data-highlighted:[&_svg]:text-eventkan-accent!"
                >
                  <UserCircle className="h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem variant="accent" asChild>
              <Link
                href={dashboardHref as Route}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy hover:bg-eventkan-peach/50! hover:text-eventkan-peach-ink! focus:bg-eventkan-peach/50! focus:text-eventkan-peach-ink! data-highlighted:bg-eventkan-peach/50! data-highlighted:text-eventkan-peach-ink! data-highlighted:[&_svg]:text-eventkan-accent!"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setLogoutOpen(true)}
            className="cursor-pointer rounded-xl px-3 py-2.5 text-red-700 hover:bg-red-50! hover:text-red-700! focus:bg-red-50! focus:text-red-700! data-highlighted:bg-red-50! data-highlighted:text-red-700!"
          >
            <LogOut className="h-4 w-4 text-red-700" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => mutate()}
        loading={isPending}
        variant="public"
        title="Keluar dari Sistem"
        desc="Apakah Anda yakin ingin keluar dari akun Anda?"
      />
    </>
  );
};

export default UserMenu;
