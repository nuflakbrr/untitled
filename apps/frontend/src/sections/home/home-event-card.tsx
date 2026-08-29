import type { PublicEvent } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

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
        <Link href={paths.event.details(event.slug)} underline="hover" color="inherit">
          <Typography variant="h5" sx={{ mt: 1.5 }}>
            {event.title}
          </Typography>
        </Link>
        <Meta
          icon="solar:calendar-date-linear"
          value={formatDate(event.start_date)}
          sx={{ mt: 2 }}
        />
        <Box
          sx={{
            mt: 2,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            bgcolor: 'primary.lighter',
            color: 'primary.darker',
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.75 }}>
            Harga tiket
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {event.price > 0 ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Gratis'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
