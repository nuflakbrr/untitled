import type { Metadata } from 'next';

import { cookies } from 'next/headers';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getPublicEvents, getPublicCategories } from 'src/lib/api/events';

import { EventCard } from 'src/sections/home/home-event-card';

export const metadata: Metadata = { title: 'Event | SITIVENT' };

export default async function EventListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const error = (await cookies()).get('registration_error')?.value;
  const [events, categories] = await Promise.all([
    getPublicEvents(category),
    getPublicCategories(),
  ]);

  return (
    <Container sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 5, md: 9 } }}>
      <Typography variant="overline" color="primary.main">
        Temukan pengalaman berikutnya
      </Typography>
      <Typography variant="h1" sx={{ mt: 1 }}>
        Semua event
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
        Jelajahi agenda kampus dari berbagai fakultas dan pilih event yang paling sesuai untukmu.
      </Typography>
      {error && (
        <Alert
          severity={error === 'registration_closed' || error === 'quota_full' ? 'warning' : 'error'}
          sx={{ mt: 3 }}
        >
          {error === 'registration_closed'
            ? 'Pendaftaran event ini sudah ditutup.'
            : error === 'quota_full'
              ? 'Kuota event ini sudah penuh.'
              : error === 'already_registered'
                ? 'Kamu sudah terdaftar di event ini.'
                : 'Registrasi gagal. Silakan coba lagi atau hubungi penyelenggara.'}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 4 }}>
        <Chip
          label="Semua"
          component="a"
          href="/event"
          clickable
          color={!category ? 'primary' : 'default'}
        />
        {categories.map((item) => (
          <Chip
            key={item.id}
            label={item.name}
            component="a"
            href={`/event?category=${encodeURIComponent(item.slug)}`}
            clickable
            color={category === item.slug ? 'primary' : 'default'}
          />
        ))}
      </Box>
      {events.length ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            mt: 5,
          }}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 6 }}>
          Belum ada event untuk kategori ini.
        </Typography>
      )}
    </Container>
  );
}
