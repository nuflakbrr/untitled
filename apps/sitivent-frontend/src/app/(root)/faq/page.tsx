'use client';

import type { FC } from 'react';

import { useState } from 'react';

import FAQBrowser from './_components/FAQBrowser';
import FAQContactCTA from './_components/FAQContactCTA';

const FAQPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('semua');

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#111927] antialiased">
      <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:pb-16">
        <div className="relative mx-auto max-w-295">
          <h1 className="font-display mt-5 max-w-230 text-[clamp(48px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em]">
            Punya pertanyaan? Mulai dari sini.
          </h1>
          <p className="mt-5 max-w-175 text-lg leading-relaxed text-[#6c7280]">
            Temukan jawaban seputar akun, pendaftaran event, e-ticket, pembayaran, refund, dan
            kebutuhan penyelenggara.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-295">
          <FAQBrowser
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <FAQContactCTA />
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
