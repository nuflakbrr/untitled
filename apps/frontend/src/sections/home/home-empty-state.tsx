import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function EmptyState() {
  return (
    <Box
      sx={{
        maxWidth: 640,
        mx: 'auto',
        py: 8,
        px: 3,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Iconify icon="solar:calendar-date-linear" width={28} />
      <Typography variant="h5" sx={{ mt: 2.5 }}>
        Belum Ada Event Unggulan
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Saat ini belum ada event unggulan yang tersedia.
      </Typography>
    </Box>
  );
}
