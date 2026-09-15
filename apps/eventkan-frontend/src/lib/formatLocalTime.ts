import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

export const formatLocalTime = (dateString: string | Date): string => {
  const date = moment(dateString);
  return date.isValid()
    ? date.tz('Asia/Jakarta').locale('id').format('DD/MM/YYYY')
    : 'Invalid Date';
};
