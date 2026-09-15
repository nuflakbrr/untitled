'use client';

import type { Route } from 'next';

import Link from 'next/link';

import type { NavbarMobileMenuProps } from '@/interfaces/navbar';

import { navlinks } from '../_constants/navLinks.constants';

const NavbarMobileMenu = ({
  isAuthenticated,
  dashboardHref,
}: NavbarMobileMenuProps) => (
  <div className="absolute inset-x-0 top-full z-10 mt-3 rounded-[18px] border border-white/70 bg-[#fffdf8]/95 p-3 shadow-[0_18px_40px_rgba(17,35,63,.12),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
    <nav className="grid gap-1">
      {navlinks
        .filter((link) => link.path !== '/')
        .map((link) => (
          <Link
            key={link.path}
            href={link.path as Route}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4b5565] hover:bg-[#f6f3eb]"
          >
            {link.title}
          </Link>
        ))}
    </nav>
    <div className="mt-3 grid gap-2 border-t border-[#111927]/10 pt-3">
      {isAuthenticated ? (
        <Link
          href={dashboardHref as Route}
          className="rounded-full bg-[#11233f] px-4 py-3 text-center text-sm font-bold text-white"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            href={'/login' as Route}
            className="rounded-full bg-[#f6f3eb] px-4 py-3 text-center text-sm font-bold text-[#11233f]"
          >
            Masuk
          </Link>
          <Link
            href={'/events' as Route}
            className="rounded-full bg-[#11233f] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Cari Event
          </Link>
        </>
      )}
    </div>
  </div>
);

export default NavbarMobileMenu;
