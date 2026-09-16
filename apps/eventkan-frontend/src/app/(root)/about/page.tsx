import { genPageMetadata } from '@/app/seo';

import { AboutCta } from './_components/AboutCta';
import { AboutHeader } from './_components/AboutHeader';
import { AboutValues } from './_components/AboutValues';
import { AboutJourney } from './_components/AboutJourney';
import { aboutValues } from './_constants/values.constants';
import { AboutIntroduction } from './_components/AboutIntroduction';

export const metadata = genPageMetadata({
  title: 'Tentang EVENTKAN — Platform Manajemen Event',
  description:
    'EVENTKAN adalah platform manajemen event dan tiket digital untuk seminar, workshop, webinar, dan bootcamp di Indonesia.',
});

const About = () => (
  <div className="w-full overflow-hidden bg-eventkan-canvas text-eventkan-ink">
    <AboutHeader
      title="Event yang baik dimulai jauh sebelum hari-H."
      subtitle="EVENTKAN membantu menghubungkan perjalanan peserta dari menemukan event, mendaftar, menerima tiket, check-in, hingga memperoleh sertifikat tanpa proses administratif yang tercecer."
    />
    <AboutIntroduction />
    <AboutValues items={aboutValues} />
    <AboutJourney />
    <AboutCta />
  </div>
);

export default About;
