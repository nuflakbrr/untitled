import type { PublicEvent } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function Stats({ events }: { events: PublicEvent[] }) {
  const capacity = events.reduce((total, event) => total + event.quota, 0);
  const stats = [
    [events.length, 'Event Aktif'],
    [capacity, 'Total Kapasitas'],
    [new Set(events.map((event) => event.category?.id).filter(Boolean)).size, 'Kategori Event'],
  ];
  return (
    <Box
      component="section"
      sx={{ py: { xs: 7, md: 9 }, borderBlock: '1px solid', borderColor: 'divider' }}
    >
      <Container>
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: { sm: 'repeat(3, 1fr)' },
            textAlign: 'center',
          }}
        >
          {stats.map(([value, label]) => (
            <Box key={label as string}>
              <Typography variant="h1" color="primary.main">
                {value}
              </Typography>
              <Typography variant="overline" color="text.secondary">
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
