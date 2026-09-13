import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';

import type { EventsResultsProps } from '@/interfaces/features/events';

import EventCard from './EventCard';
import { getCoverStyles } from '../../_libs/getCoverStyles';

const EventsGrid: FC<Pick<EventsResultsProps, 'events'>> = ({ events }) => {
  const coverStyles = getCoverStyles(events.map((event) => event.id));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          formattedStartDate={moment(event.startDate)
            .tz('Asia/Jakarta')
            .locale('id')
            .format('DD MMMM YYYY')}
          coverStyle={coverStyles[index]}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
