import type { PublicEvent } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { Meta, formatDate } from './home-meta';

export function EventCard({ event }: { event: PublicEvent }) {
  return (
    <Box
      component="article"
      sx={{
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
      }}
    >
      {event.banner && (
        <Box
          component="img"
          src={event.banner}
          alt=""
          sx={{ width: '100%', height: 210, display: 'block', objectFit: 'cover' }}
        />
      )}
      <Box sx={{ p: 2.5 }}>
        <Chip
          size="small"
          color="primary"
          variant="soft"
          label={event.category?.name ?? event.event_type}
        />
        <Typography variant="h5" sx={{ mt: 1.5 }}>
          {event.title}
        </Typography>
        <Meta
          icon="solar:calendar-date-linear"
          value={formatDate(event.start_date)}
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  );
}
