import type { FC } from 'react';
import type { Metadata } from 'next';

import { aboutValues } from './_constants/values';
import { AboutHeader } from './_components/AboutHeader';
import { AboutValues } from './_components/AboutValues';
import { AboutIntroduction } from './_components/AboutIntroduction';

export const metadata: Metadata = {
  title: 'Tentang SITIVENT — Platform Manajemen Event',
  description:
    'SITIVENT adalah platform manajemen event dan tiket digital untuk seminar, workshop, webinar, dan bootcamp di Indonesia.',
};

const About: FC = () => (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans antialiased">
      <AboutHeader
        title="Tentang SITIVENT"
        subtitle="Satu platform untuk menemukan, mendaftar, dan mengikuti event teknologi terbaik di Indonesia."
      />
      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-24">
        <AboutIntroduction />
      </div>
      <AboutValues items={aboutValues} />
    </div>
  );

export default About;
