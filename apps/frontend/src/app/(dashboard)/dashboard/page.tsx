import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { requireSession } from 'src/auth/server';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          overflow: 'hidden',
          position: 'relative',
          color: 'common.white',
          bgcolor: 'grey.900',
        }}
      >
        <Box sx={{ maxWidth: 680, position: 'relative', zIndex: 1 }}>
          <Chip
            label={session.tenant?.name ?? 'Universitas'}
            size="small"
            sx={{ color: 'primary.light', bgcolor: 'rgba(142, 164, 255, 0.12)' }}
          />
          <Typography variant="h2" sx={{ mt: 2 }}>
            Selamat datang, {session.user.name.split(' ')[0]}.
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'grey.400', maxWidth: 560 }}>
            Kelola agenda kampus, pantau alur peserta, dan jaga setiap proses event tetap rapi dari
            satu workspace.
          </Typography>
          <Button
            component="a"
            href={paths.dashboard.events}
            variant="contained"
            sx={{ mt: 3 }}
          >
            Buka modul event
          </Button>
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            width: 280,
            height: 280,
            right: -60,
            bottom: -130,
            position: 'absolute',
            border: '48px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
            opacity: 0.55,
          }}
        />
      </Paper>

      <Box>
        <Typography variant="h4">Mulai bekerja</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Modul yang tersedia untuk peran {session.user.role}.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { md: '1.2fr 0.8fr' } }}>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
          <Iconify icon="solar:calendar-mark-outline" width={28} sx={{ color: 'primary.main' }} />
          <Typography variant="h4" sx={{ mt: 2 }}>
            Manajemen event
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
            Siapkan informasi, jadwal, kuota, pembicara, benefit, dan status publikasi event.
          </Typography>
          <Button
            component="a"
            href={paths.dashboard.events}
            variant="outlined"
            sx={{ mt: 3 }}
          >
            Kelola event
          </Button>
        </Paper>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.neutral' }}>
          <Typography variant="overline" color="primary.main">
            Konteks akses
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {session.is_super_admin ? 'Pengawasan universitas' : 'Workspace fakultas'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Data dan tindakan mengikuti tenant aktif serta izin yang melekat pada akun Anda.
          </Typography>
        </Paper>
      </Box>
    </Stack>
  );
}
