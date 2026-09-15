'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ParticipantNavbarProps } from '@/interfaces/navbar';

import { cn } from '@/lib/utils';
import ParticipantUserMenu from '@/components/Mixins/Participant/ParticipantUserMenu';

import { participantNavLinks } from './_constants/navLinks.constants';

const ParticipantNavLinks: FC = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-7.5 text-sm font-semibold text-[#4b5565] lg:flex">
      {participantNavLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            {...(link.tourTarget && { 'data-tour-desktop': `step-${link.tourTarget}` })}
            className={cn('transition hover:text-[#111927]', isActive && 'text-[#111927]')}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export const ParticipantNavbar: FC<ParticipantNavbarProps> = ({ user }) => (
  <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6">
    <div className="relative mx-auto max-w-295 rounded-[18px] border border-white/70 bg-[#fffdf8]/65 p-[14px_18px] shadow-[0_10px_28px_rgba(17,35,63,.08),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/participant/dashboard"
          aria-label="EVENTKAN"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-[-.03em] text-[#111927]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="grid h-9.5 w-9.5 -rotate-3 place-items-center rounded-xl bg-[#11233f] text-[15px] text-white">
            S
          </span>
          <span>EVENTKAN</span>
        </Link>

        <ParticipantNavLinks />

        <div className="flex items-center gap-2" data-tour-desktop="step-profile">
          <ParticipantUserMenu user={user} />
        </div>
      </div>
    </div>
  </header>
);
