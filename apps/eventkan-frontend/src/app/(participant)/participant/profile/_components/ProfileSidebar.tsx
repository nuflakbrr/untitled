'use client';

import type { MouseEvent } from 'react';

import type { ParticipantProfileFormProps } from '@/interfaces/features/profile';

import { getInitials } from '@/lib/getInitials';

export default function ProfileSidebar({ user }: ParticipantProfileFormProps) {
  const navigateToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    section: 'info' | 'security' | 'deactivate'
  ) => {
    event.preventDefault();
    const href = `/participant/profile#${section}`;
    window.history.replaceState(null, '', href);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="h-fit rounded-[26px] bg-eventkan-navy p-6.5 text-white lg:sticky lg:top-28">
      {user.image ? (
        <img src={user.image} alt={user.name} className="h-18 w-18 rounded-full object-cover" />
      ) : (
        <div className="grid h-18 w-18 place-items-center rounded-full bg-eventkan-accent font-display text-[28px] font-extrabold">
          {getInitials(user.name)}
        </div>
      )}
      <h2 className="font-display mt-4 text-2xl font-extrabold tracking-[-.03em]">{user.name}</h2>
      <p className="text-[13px] text-white/60">{user.email}</p>
      <nav aria-label="Navigasi profil" className="mt-5.5 grid gap-2">
        <a href="/participant/profile#info" onClick={(event) => navigateToSection(event, 'info')} className="rounded-xl bg-white/10 px-3 py-2.75 text-[13px] font-medium text-white">
          Informasi Profil
        </a>
        <a href="/participant/profile#security" onClick={(event) => navigateToSection(event, 'security')} className="rounded-xl px-3 py-2.75 text-[13px] font-medium text-white/65 transition hover:bg-white/10 hover:text-white">
          Keamanan Akun
        </a>
        <a href="/participant/profile#deactivate" onClick={(event) => navigateToSection(event, 'deactivate')} className="rounded-xl px-3 py-2.75 text-[13px] font-medium text-white/65 transition hover:bg-white/10 hover:text-white">
          Tangguhkan Akun
        </a>
      </nav>
    </aside>
  );
}
