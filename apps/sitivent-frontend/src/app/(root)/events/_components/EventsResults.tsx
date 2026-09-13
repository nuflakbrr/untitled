import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import type { EventsResultsProps } from '@/interfaces/features/events';

import EventsGrid from './EventsGrid';
import EmptyEventsState from './EmptyEventsState';

const EventsResults: FC<EventsResultsProps> = ({ events, query }) => {
  if (events.length === 0) {
    return <EmptyEventsState query={query} />;
  }

  return <EventsGrid events={events} />;
};

export default EventsResults;
