'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useTour } from '@reactour/tour';
import { useMutation } from '@tanstack/react-query';
import {
  Home,
  LogOut,
  ChevronDown,
} from 'lucide-react';

import type { ParticipantNavbarProps } from '@/interfaces/navbar';

import { signOut } from '@/lib/authClient';
import { getInitials } from '@/lib/getInitials';
import { useIsMobile } from '@/hooks/useMobile';
import AlertModal from '@/components/Common/Modals/AlertModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { participantUserMenuLinks } from './_constants/userMenuLinks.constants';

export default function ParticipantUserMenu({ user }: ParticipantNavbarProps) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { isOpen: isTourOpen } = useTour();
  const isMobile = useIsMobile();

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
      <DropdownMenu
        open={open || (isMobile && isTourOpen)}
        onOpenChange={setOpen}
        modal={!(isMobile && isTourOpen)}
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Menu akun"
            className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-eventkan-ink/10 bg-white/60 p-1.5 pr-3 text-left shadow-[0_8px_24px_rgba(17,35,63,.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-eventkan-navy/25"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-eventkan-navy text-xs font-bold tracking-wide text-white">
              {getInitials(user.name)}
            </span>
            <span className="hidden max-w-28 sm:grid">
              <span className="truncate text-sm font-bold text-eventkan-navy">{user.name}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-eventkan-muted transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          forceMount
          className="w-72 rounded-[22px] border-eventkan-ink/10 bg-eventkan-surface/95 p-2 text-eventkan-navy shadow-[0_18px_50px_rgba(17,35,63,.14)] backdrop-blur-xl"
          onInteractOutside={(event) => {
            if (isMobile && isTourOpen) event.preventDefault();
          }}
          onFocusOutside={(event) => {
            if (isMobile && isTourOpen) event.preventDefault();
          }}
        >
          <DropdownMenuLabel className="rounded-2xl bg-eventkan-canvas p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-eventkan-accent text-xs font-bold text-white">
                {getInitials(user.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-eventkan-navy">{user.name}</span>
                <span className="block truncate text-xs font-normal text-eventkan-muted">{user.email}</span>
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {participantUserMenuLinks.map((link) => {
            const Icon = link.icon;

            return (
              <DropdownMenuItem
                key={link.href}
                asChild
                className={link.mobileOnly ? 'md:hidden' : undefined}
              >
                <Link
                  href={link.href}
                  {...(link.tourTarget && {
                    'data-tour-mobile': `step-${link.tourTarget}`,
                  })}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy data-highlighted:bg-eventkan-canvas"
                >
                  <Icon className="h-4 w-4 text-eventkan-accent" />
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator className="md:hidden" />
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-navy data-highlighted:bg-eventkan-canvas">
              <Home className="h-4 w-4 text-eventkan-accent" /> Kembali ke Beranda
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setLogoutOpen(true)} className="cursor-pointer rounded-xl px-3 py-2.5 text-eventkan-peach-ink data-highlighted:bg-[#fff0e9] data-highlighted:text-eventkan-peach-ink">
            <LogOut className="h-4 w-4" /> Keluar
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
}
