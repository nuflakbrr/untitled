import type { Metadata } from 'next';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4">Dashboard SITIVENT</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Pilih modul dari navigasi untuk mulai mengelola kegiatan.
      </Typography>
    </Paper>
  );
}
