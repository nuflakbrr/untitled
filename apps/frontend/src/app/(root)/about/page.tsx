import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

export const metadata: Metadata = {
  title: 'Tentang Kami | SITIVENT',
  description: 'Mengenal SITIVENT, platform manajemen event universitas.',
};

const principles = [
  [
    'solar:calendar-mark-outline',
    'Terorganisir',
    'Satu alur untuk publikasi, pendaftaran, dan pengelolaan event.',
  ],
  [
    'solar:shield-check-outline',
    'Terpercaya',
    'Data peserta dan proses event dikelola dengan konteks akses yang aman.',
  ],
  [
    'solar:users-group-rounded-outline',
    'Terhubung',
    'Mempertemukan mahasiswa, penyelenggara, dan komunitas kampus.',
  ],
];

export default function AboutPage() {
  return (
    <Box component="main">
      <Box sx={{ pt: { xs: 11, md: 17 }, pb: { xs: 9, md: 14 }, bgcolor: 'background.neutral' }}>
        <Container>
          <Box sx={{ maxWidth: 820 }}>
            <Typography variant="overline" color="primary.main">
              Tentang SITIVENT
            </Typography>
            <Typography
              variant="h1"
              sx={{ mt: 1.5, fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 1.02 }}
            >
              Event kampus yang lebih mudah diikuti dan dikelola.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 3, maxWidth: 650, fontSize: { md: '1.15rem' } }}
            >
              SITIVENT adalah ruang bersama untuk menemukan agenda kampus, mendaftar dengan cepat,
              dan membantu setiap penyelenggara membuat event yang berdampak.
            </Typography>
            <Button href={paths.event.root} variant="contained" size="large" sx={{ mt: 4 }}>
              Jelajahi event
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 9, md: 14 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '0.8fr 1.2fr' },
            gap: { xs: 5, md: 12 },
            alignItems: 'start',
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            Dibangun untuk ekosistem kampus.
          </Typography>
          <Stack spacing={3}>
            <Typography variant="h5">
              Kami percaya event yang baik dimulai dari pengalaman yang tertata.
            </Typography>
            <Typography color="text.secondary">
              Dari seminar kecil hingga agenda universitas, SITIVENT membantu seluruh proses berada
              dalam satu tempat. Peserta mendapatkan informasi yang jelas, sedangkan penyelenggara
              dapat fokus pada kualitas kegiatan.
            </Typography>
            <Typography color="text.secondary">
              Platform ini dirancang dengan struktur multi-tenant agar setiap fakultas dapat
              bergerak mandiri, tetap terhubung, dan menjaga data sesuai kewenangannya.
            </Typography>
          </Stack>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'grey.900', color: 'common.white', py: { xs: 9, md: 12 } }}>
        <Container>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Cara kami bekerja
          </Typography>
          <Typography
            variant="h2"
            sx={{ mt: 1, maxWidth: 620, fontSize: { xs: '2rem', md: '3.2rem' } }}
          >
            Lebih sedikit friksi. Lebih banyak partisipasi.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mt: 6,
            }}
          >
            {principles.map(([icon, title, description]) => (
              <Box
                key={title}
                sx={{
                  p: 3,
                  minHeight: 190,
                  border: '1px solid',
                  borderColor: 'grey.700',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.04)',
                }}
              >
                <Iconify icon={icon} width={28} sx={{ color: 'primary.light' }} />
                <Typography variant="h5" sx={{ mt: 4 }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 1, color: 'grey.400' }}>{description}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 9, md: 13 }, textAlign: 'center' }}>
        <Typography variant="h2">Temukan event berikutnya.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          Mulai dari satu event, lalu temukan komunitas yang tepat untukmu.
        </Typography>
        <Button href={paths.event.root} variant="outlined" size="large" sx={{ mt: 3 }}>
          Lihat semua event
        </Button>
      </Container>
    </Box>
  );
}
