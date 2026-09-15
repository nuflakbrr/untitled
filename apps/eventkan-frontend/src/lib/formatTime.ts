import 'moment-timezone';

import moment from 'moment';

export const formatTime = (timeStr?: string | Date): string => {
  if (!timeStr) return '';

  const date = moment(timeStr);
  return date.isValid() ? date.tz('Asia/Jakarta').format('HH:mm:ss [WIB]') : '';
};
