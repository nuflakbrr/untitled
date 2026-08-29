import type { PublicEvent } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { EventCard } from './home-event-card';
import { EmptyState } from './home-empty-state';

export function FeaturedEvents({ events }: { events: PublicEvent[] }) {
  return (
    <Box id="events" component="section" sx={{ py: { xs: 9, md: 13 }, scrollMarginTop: 90 }}>
      <Container>
        <Typography variant="overline" color="primary.main">
          Event unggulan
        </Typography>
        <Typography variant="h2" sx={{ mt: 1 }}>
          Event Unggulan
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 5 }}>
          Event terpilih yang dibuka untuk umum
        </Typography>
        {events.length ? (
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: 'repeat(3, 1fr)' } }}>
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Box>
        ) : (
          <EmptyState />
        )}
      </Container>
    </Box>
  );
}
