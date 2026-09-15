'use client';

import type { FC } from 'react';

import Link from 'next/link';

import { socials } from './_constants/footerLinks.constants';
import FooterLinkGroups from './_components/FooterLinkGroups';
import FooterNewsletter from './_components/FooterNewsletter';

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="tentang" className="w-full border-t border-[#111927]/10 bg-[#f6f3eb]">
      <div className="mx-auto max-w-295 px-4 sm:px-6">
        <div className="grid gap-10 border-b border-[#111927]/10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 text-[#111927]">
              <span className="font-display grid h-9 w-9 place-items-center rounded-[12px] bg-[#11233f] text-lg font-extrabold text-white">
                S
              </span>
              <span className="font-display text-xl font-extrabold tracking-[-.04em]">
                EVENTKAN
              </span>
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
            <FooterNewsletter />
          </div>
        </div>

        <FooterLinkGroups />

        <div className="flex flex-col justify-between gap-3 border-t border-[#111927]/10 py-5 text-xs text-[#6c7280] sm:flex-row">
          <p>© {year} EVENTKAN. Seluruh hak cipta dilindungi undang-undang.</p>
          <p>
            Made with <span className="text-[#ff7a45]">&#x2665;</span> for better campus events.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
