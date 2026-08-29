import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { getPublicEvents, getPublicGalleries, getPublicCategories } from 'src/lib/api/events';

import { HomeView } from 'src/sections/home/view/home-view';

import { getServerSession } from 'src/auth/server';

// ----------------------------------------------------------------------

const TITLE = 'SITIVENT | Temukan Event Kampusmu';
const DESCRIPTION =
  'Temukan seminar, workshop, kompetisi, dan agenda universitas dalam satu platform event kampus.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  // A page-level openGraph REPLACES the root layout's whole openGraph object
  // (and drops the file-convention og:image), so restate everything here.
  openGraph: {
    type: 'website',
    siteName: CONFIG.appName,
    locale: 'id_ID',
    url: '/',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/sitivent-mark.svg'],
  },
};

export default async function Page() {
  const [events, categories, galleries] = await Promise.all([
    getPublicEvents().catch(() => []),
    getPublicCategories().catch(() => []),
    getPublicGalleries().catch(() => []),
  ]);
  const session = await getServerSession();

  return (
    <HomeView
      events={events}
      categories={categories}
      galleries={galleries}
      isAuthenticated={Boolean(session)}
    />
  );
}
