import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { listMyRegistrationsAction } from 'src/auth/actions';

export default async function ParticipantDashboardPage() {
  const result = await listMyRegistrationsAction();
  const registrations = result.data ?? [];
  const activeCount = registrations.filter((item) => item.status !== 'CANCELLED').length;

  return (
    <Stack
      spacing={{ xs: 3, md: 4 }}
      sx={{ maxWidth: 1120, mx: 'auto', py: { xs: 3, md: 6 }, px: { xs: 2, md: 3 } }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          color: 'common.white',
          bgcolor: 'grey.900',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 650 }}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Ruang peserta
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Event yang kamu ikuti.
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'grey.400', maxWidth: 540 }}>
            Simpan tiket, pantau status registrasi, dan temukan pengalaman berikutnya.
          </Typography>
          <Button component="a" href={paths.event.root} variant="contained" sx={{ mt: 3 }}>
            Jelajahi event
          </Button>
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: 260,
            height: 260,
            right: -70,
            bottom: -150,
            border: '52px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
            opacity: 0.55,
          }}
        />
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {[
          ['Total registrasi', registrations.length],
          ['Event aktif', activeCount],
          ['Sertifikat', 0],
        ].map(([label, value]) => (
          <Paper key={label} variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
            <Typography variant="h3">{value}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box>
        <Typography variant="h4">Registrasi terbaru</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Semua event yang terhubung dengan akunmu.
        </Typography>
      </Box>
      {result.error ? <Alert severity="error">{result.error}</Alert> : null}
      {!result.error && !registrations.length ? (
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, textAlign: 'center' }}
        >
          <Typography variant="h5">Belum ada event di sini</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Jelajahi event publik untuk mulai berpartisipasi.
          </Typography>
          <Button component="a" href={paths.event.root} variant="outlined" sx={{ mt: 3 }}>
            Lihat katalog event
          </Button>
        </Paper>
      ) : null}
      {registrations.map((registration) => (
        <Paper
          key={registration.id}
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box>
            <Typography variant="h5">{registration.event_title}</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Terdaftar{' '}
              {new Date(registration.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Chip
              label={registration.status}
              size="small"
              color={registration.status === 'CONFIRMED' ? 'success' : 'default'}
            />
            <Button
              component="a"
              href={paths.event.details(registration.event_slug)}
              variant="text"
            >
              Lihat event
            </Button>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
