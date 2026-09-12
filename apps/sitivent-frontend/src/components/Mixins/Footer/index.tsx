'use client';

import type { Route } from 'next';
import type { FC, FormEvent } from 'react';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { subscribeNewsletter } from '@/app/actions/newsletter';

import { socials, footerLinks } from './_constants/footerLinks';

const Footer: FC = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Silakan masukkan alamat email yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await subscribeNewsletter(email);
      if (response.success) {
        toast.success(response.message);
        setEmail('');
      } else {
        toast.error(response.message || 'Gagal mendaftar newsletter.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat mendaftar newsletter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="tentang" className="w-full border-t border-[#111927]/10 bg-[#f6f3eb]">
      <div className="mx-auto max-w-295 px-4 sm:px-6">
        <div className="grid gap-10 border-b border-[#111927]/10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 text-[#111927]">
              <span className="font-display grid h-9 w-9 place-items-center rounded-[12px] bg-[#11233f] text-lg font-extrabold text-white">
                S
              </span>
              <span className="font-display text-xl font-extrabold tracking-[-.04em]">Sitivent</span>
            </Link>
            <p className="mt-4 max-w-105 text-sm leading-relaxed text-[#6c7280]">
              Platform event kampus untuk registrasi, ticketing, check-in, kehadiran, dan sertifikat
              dalam satu sistem.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#111927]/15 text-[#6c7280] transition hover:-translate-y-0.5 hover:border-[#11233f] hover:bg-[#11233f] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(17,35,63,.04)] sm:p-7">
              <h2 className="font-display text-xl font-bold text-[#11233f]">Info event terbaru</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#6c7280]">
                Dapatkan notifikasi event baru dan kabar menarik langsung ke email kamu.
              </p>
              <form onSubmit={handleSubscribe} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <label htmlFor="footer-email" className="sr-only">
                  Email untuk informasi event terbaru
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  required
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 rounded-full border border-[#111927]/15 bg-[#f6f3eb] px-4 py-3 text-sm text-[#11233f] outline-none transition placeholder:text-[#6c7280]/70 focus:border-[#11233f] focus:ring-3 focus:ring-[#11233f]/15 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff7a45] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#f2693a] disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Memproses...' : 'Langganan'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4 lg:py-12">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-sm font-bold text-[#11233f]">{group.title}</h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as Route}
                      className="inline-flex items-center gap-1 text-sm text-[#6c7280] transition hover:text-[#ff7a45]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-[#111927]/10 py-5 text-xs text-[#6c7280] sm:flex-row">
          <p>© {year} SITIVENT. Seluruh hak cipta dilindungi undang-undang.</p>
          <p>Made with &hearts; for better campus events.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
