import type { FC } from 'react';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

import { siteMetadata } from '@/data/siteMetadata';

const FAQContactCTA: FC = () => (
  <div className="relative mt-16 overflow-hidden rounded-[30px] bg-[#ff7a45] p-7 text-white sm:p-10 lg:p-11">
    <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-32 border-white/15" />
    <div className="pointer-events-none absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-[#f7df86]/25" />
    <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-72 -rotate-12 bg-white/20" />

    <div className="relative z-10 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
      <div>
        <h2 className="font-display max-w-full text-[clamp(32px,5vw,50px)] font-extrabold leading-none tracking-tighter">
          Butuh bantuan langsung?
        </h2>
        <p className="mt-3 max-w-140 text-sm leading-relaxed text-white/80 sm:text-base">
          Tim EVENTKAN siap membantu kamu menyelesaikan kendala sebelum event dimulai.
        </p>
      </div>
      <Link
        href={`mailto:${siteMetadata.email}`}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4.5 py-3 text-sm font-bold text-[#11233f] transition hover:-translate-y-0.5"
      >
        <MessageSquare className="h-4 w-4" />
        Email Kami
      </Link>
    </div>
  </div>
);

export default FAQContactCTA;
