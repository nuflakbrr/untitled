'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { X, Menu, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import UserMenu from './_components/UserMenu';
import { useNavbar } from './_hooks/useNavbar';
import { navlinks } from './_constants/navLinks.constants';
import NavbarMobileMenu from './_components/NavbarMobileMenu';

const Navbar: FC = () => {
  const { open, setOpen, session, isAdmin, tenantId, dashboardHref, isActive } = useNavbar();

  return (
    <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6">
      <div className="relative mx-auto max-w-295 rounded-[18px] border border-white/70 bg-[#fffdf8]/65 p-[14px_18px] shadow-[0_10px_28px_rgba(17,35,63,.08),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="EVENTKAN"
            className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-[-.03em] text-[#111927]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="grid h-9.5 w-9.5 -rotate-3 place-items-center rounded-xl bg-[#11233f] text-[15px] text-white">
              S
            </span>
            <span>EVENTKAN</span>
          </Link>
          <nav className="hidden items-center gap-7.5 text-sm font-semibold text-[#4b5565] lg:flex">
            {navlinks.map((link) => (
              <Link
                key={link.path}
                href={link.path as Route}
                className={cn(
                  'transition hover:text-[#111927]',
                  isActive(link.path) && 'text-[#111927]'
                )}
              >
                {link.title === 'Tentang Kami' ? 'Tentang' : link.title}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {session?.user ? (
              <UserMenu user={session.user} isAdmin={isAdmin} tenantId={tenantId} />
            ) : (
              <>
                <Link
                  href={'/login' as Route}
                  className="rounded-full px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5"
                >
                  Masuk
                </Link>
                <Link
                  href={'/events' as Route}
                  className="inline-flex items-center group gap-2 rounded-full bg-[#11233f] px-4.5 py-3 font-bold text-white shadow-[0_10px_22px_rgba(17,35,63,.16)] transition hover:-translate-y-0.5"
                >
                  Cari Event{' '}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10.5 w-10.5 place-items-center rounded-xl bg-[#11233f] text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <NavbarMobileMenu
            isAuthenticated={Boolean(session?.user)}
            dashboardHref={dashboardHref}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
