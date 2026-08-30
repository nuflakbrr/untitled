import { notFound } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { listMyRegistrationsAction } from 'src/auth/actions';

export default async function RegistrationSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const registrationID = (await params).id;
  const result = await listMyRegistrationsAction();
  const registration = result.data?.find((item) => item.id === registrationID);
  if (!registration) notFound();

  const confirmed = ['REGISTERED', 'CHECKED_IN'].includes(registration.status);

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
              color: confirmed ? 'success.main' : 'warning.main',
              bgcolor: confirmed ? 'success.lighter' : 'warning.lighter',
            }}
          >
            <Iconify
              icon={confirmed ? 'solar:check-circle-bold' : 'solar:clock-circle-outline'}
              width={38}
            />
          </Box>

          <Box>
            <Chip
              size="small"
              color={confirmed ? 'success' : 'warning'}
              label={confirmed ? 'Registrasi berhasil' : 'Pembayaran sedang diverifikasi'}
            />
            <Typography variant="h2" sx={{ mt: 2 }}>
              {confirmed ? 'Kamu sudah terdaftar' : 'Sedikit lagi selesai'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {confirmed
                ? 'Tiket event sudah tersedia dan dapat dibuka melalui dashboard peserta.'
                : 'Kami sedang menunggu konfirmasi pembayaran dari iPaymu. Status tiket akan diperbarui otomatis.'}
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{ width: '100%', p: 3, borderRadius: 2, textAlign: 'left' }}
          >
            <Stack spacing={1.5}>
              <Typography variant="h5">{registration.event_title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Nomor registrasi: {registration.registration_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(registration.event_start_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {' · '}
                {registration.event_location || 'Lokasi belum ditentukan'}
              </Typography>
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
            <Button fullWidth href={paths.participant.dashboard} variant="contained" size="large">
              Lihat tiket saya
            </Button>
            <Button
              fullWidth
              href={paths.event.details(registration.event_slug)}
              variant="outlined"
              size="large"
            >
              Lihat event
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
