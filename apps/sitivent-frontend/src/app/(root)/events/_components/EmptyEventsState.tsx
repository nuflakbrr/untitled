import type { FC } from 'react';

import { CalendarX2 } from 'lucide-react';

import EmptyState from '../../_components/EmptyState';

interface EmptyEventsStateProps {
  query?: string;
}

const EmptyEventsState: FC<EmptyEventsStateProps> = ({ query }) => (
  <EmptyState
    icon={CalendarX2}
    title="Event tidak ditemukan"
    description={
      query
        ? `Tidak ada event aktif yang cocok dengan kata kunci "${query}".`
        : 'Saat ini belum ada event aktif yang tersedia.'
    }
    action={query ? { href: '/events', label: 'Lihat semua event' } : undefined}
  />
);

export default EmptyEventsState;
