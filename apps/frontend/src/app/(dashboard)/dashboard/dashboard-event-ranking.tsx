'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

type Event = {
  id: string;
  title: string;
  registrations: number;
  tenant_name: string;
  tenant_type: string;
};

export function DashboardEventRanking({
  title,
  subtitle,
  events,
}: {
  title: string;
  subtitle: string;
  events: Event[];
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const items = events.slice((page - 1) * pageSize, page * pageSize);
  const maximum = events[0]?.registrations ?? 0;
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h5">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        {subtitle}
      </Typography>
      {events.length ? (
        <Stack spacing={1.5}>
          {items.map((event, index) => {
            const rank = (page - 1) * pageSize + index;
            return (
              <Box key={event.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {rank < 3 ? (
                    <Iconify
                      icon="carbon:trophy"
                      width={28}
                      sx={{ flexShrink: 0, color: ['#D4AF37', '#A7A7A7', '#B87333'][rank] }}
                    />
                  ) : (
                    <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700 }}>
                      {rank + 1}
                    </Typography>
                  )}
                  <Typography sx={{ flex: 1, minWidth: 0 }} noWrap>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.registrations} pendaftar
                  </Typography>
                </Box>
                <Chip
                  label={event.tenant_type === 'ROOT' ? 'Event universitas' : event.tenant_name}
                  size="small"
                  sx={{ ml: 5.5, mt: 0.5, height: 20, fontSize: 10, textTransform: 'uppercase' }}
                />
                <LinearProgress
                  variant="determinate"
                  value={maximum ? (event.registrations / maximum) * 100 : 0}
                  sx={{ ml: 5.5, mt: 0.75, height: 5, borderRadius: 1 }}
                />
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Typography color="text.secondary">Belum ada event.</Typography>
      )}
      {events.length > pageSize ? (
        <Pagination
          page={page}
          count={Math.ceil(events.length / pageSize)}
          onChange={(_, value) => setPage(value)}
          sx={{ pt: 2 }}
        />
      ) : null}
    </Paper>
  );
}
