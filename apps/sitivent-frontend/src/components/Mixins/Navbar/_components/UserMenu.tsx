'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

import type { NavbarUser } from '@/interfaces/navbar';

import { signOut } from '@/lib/authClient';
import AlertModal from '@/components/Common/Modals/AlertModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { getInitials } from '../_libs/utils';

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
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-[#111927]/10 bg-white/60 p-1.5 pr-3 text-left shadow-[0_8px_24px_rgba(17,35,63,.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#11233f]/25"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#11233f] text-xs font-bold tracking-wide text-white">
              {getInitials(user.name)}
            </span>
            <span className="hidden max-w-28 sm:grid">
              <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#ff7a45]">
                Akun saya
              </span>
              <span className="truncate text-sm font-bold text-[#11233f]">{user.name}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-[#6c7280] transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 rounded-[22px] border-[#111927]/10 bg-[#fffdf8]/95 p-2 text-[#11233f] shadow-[0_18px_50px_rgba(17,35,63,.14)] backdrop-blur-xl"
        >
          <DropdownMenuLabel className="rounded-2xl bg-[#f6f3eb] p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff7a45] text-xs font-bold text-white">
                {getInitials(user.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-[#11233f]">{user.name}</span>
                <span className="block truncate text-xs font-normal text-[#6c7280]">
                  {user.email}
                </span>
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={dashboardHref as Route}
              className="rounded-xl px-3 py-2.5 text-[#11233f] data-highlighted:bg-[#f6f3eb] data-highlighted:text-[#11233f]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#ff7a45]" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLogoutOpen(true)}
            className="rounded-xl px-3 py-2.5 text-[#b84a2a] data-highlighted:bg-[#fff0e9] data-highlighted:text-[#b84a2a]"
          >
            <LogOut className="h-4 w-4" />
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
