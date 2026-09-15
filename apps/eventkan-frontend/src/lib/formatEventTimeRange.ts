import 'moment-timezone';

import moment from 'moment';

const EVENT_TIMEZONE = 'Asia/Jakarta';
const EVENT_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

export function formatEventTimeRange(
  eventDate: Date | string,
  startTime: string,
  endTime: string
): string {
  if (!startTime || !endTime) return '';

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || EVENT_TIMEZONE;
  const eventDateInSourceTimezone = moment(eventDate).tz(EVENT_TIMEZONE).format('YYYY-MM-DD');
  const start = moment
    .tz(`${eventDateInSourceTimezone} ${startTime}`, EVENT_TIME_FORMAT, EVENT_TIMEZONE)
    .tz(userTimezone);
  const end = moment
    .tz(`${eventDateInSourceTimezone} ${endTime}`, EVENT_TIME_FORMAT, EVENT_TIMEZONE)
    .tz(userTimezone);

  if (!start.isValid() || !end.isValid()) return '';

  const startZone = start.format('z');
  const endZone = end.format('z');
  const timezoneLabel = startZone === endZone ? startZone : `${startZone} / ${endZone}`;

  return `${start.format('HH:mm')} - ${end.format('HH:mm')} ${timezoneLabel}`;
}
