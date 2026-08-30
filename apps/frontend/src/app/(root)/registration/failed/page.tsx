import { cookies } from 'next/headers';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

const defaultErrorContent = {
  title: 'Registrasi belum berhasil',
  description:
    'Terjadi kendala saat memproses pendaftaran. Silakan coba kembali beberapa saat lagi.',
};

const errorContent: Record<string, { title: string; description: string }> = {
  registration_invalid: {
    title: 'Data pendaftaran tidak valid',
    description: 'Buka kembali event dan periksa pilihan pendaftaran sebelum mencoba lagi.',
  },
  registration_closed: {
    title: 'Pendaftaran sudah ditutup',
    description: 'Periode pendaftaran event ini telah berakhir. Silakan pilih event lainnya.',
  },
  quota_full: {
    title: 'Kuota event sudah penuh',
    description: 'Tidak ada kursi tersisa untuk event ini. Kamu masih dapat melihat event lainnya.',
  },
  already_registered: {
    title: 'Kamu sudah terdaftar',
    description:
      'Registrasi tidak dibuat ulang. Event tersebut sudah tersimpan di dashboard peserta.',
  },
  checkout: {
    title: 'Pembayaran belum dapat dibuka',
    description:
      'Registrasi sudah tersimpan. Buka detail event dari dashboard peserta untuk mencoba pembayaran lagi.',
  },
  registration: defaultErrorContent,
};

export default async function RegistrationFailedPage() {
  const error = (await cookies()).get('registration_error')?.value ?? 'registration';
  const content = errorContent[error] ?? defaultErrorContent;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: { xs: 10, md: 16 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: 'error.main',
              bgcolor: 'error.lighter',
            }}
          >
            <Iconify icon="solar:stop-circle-bold" width={38} />
          </Box>

          <Box>
            <Typography variant="h2">{content.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {content.description}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
            <Button
              fullWidth
              href={paths.event.root}
              variant="contained"
              size="large"
              startIcon={<Iconify icon="solar:restart-bold" />}
            >
              Coba event lain
            </Button>
            <Button
              fullWidth
              href={paths.participant.dashboard}
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="solar:home-2-outline" />}
            >
              Buka dashboard
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
