import type { Metadata } from 'next';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

import ProfileForm from './_components/ProfileForm';

export const metadata: Metadata = {
  title: 'Profil Saya | EVENTKAN',
  description: 'Kelola informasi profil dan keamanan akun EVENTKAN Anda.',
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect('/login');
  }

  return (
    <section className="space-y-7 pb-10">
      <header className="flex flex-col gap-6 border-b border-[#111927]/10 pb-8">
        <div>
          <h1 className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-tighter text-[#111927]">
            Profil Saya
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6c7280]">
            Atur profil dan keamanan akunmu di sini.
          </p>
        </div>
      </header>

      <ProfileForm
        user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
      />
    </section>
  );
}
