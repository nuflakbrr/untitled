import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { requireSession } from 'src/auth/server';

export const metadata: Metadata = { title: 'Event' };

export default async function EventsPage() {
  await requireSession('admin.access');

  return (
    <Box>
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: 3,
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography variant="h3">Manajemen event</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Susun dan publikasikan agenda untuk tenant aktif.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled
          startIcon={<Iconify icon="solar:calendar-add-outline" />}
        >
          Buat event
        </Button>
      </Box>
      <Paper
        variant="outlined"
        sx={{ minHeight: 440, display: 'grid', placeItems: 'center', p: 4, textAlign: 'center' }}
      >
        <Box sx={{ maxWidth: 460 }}>
          <Chip label="Sprint 7.2" color="primary" variant="soft" />
          <Box
            sx={{
              width: 72,
              height: 72,
              display: 'grid',
              placeItems: 'center',
              mx: 'auto',
              mt: 3,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              borderRadius: 2,
            }}
          >
            <Iconify icon="solar:calendar-mark-outline" width={34} />
          </Box>
          <Typography variant="h4" sx={{ mt: 2.5 }}>
            Workspace event sudah siap
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Tabel, filter, formulir, dan aksi lifecycle akan dihubungkan ke endpoint event pada
            lanjutan Sprint 7.2.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
