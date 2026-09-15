import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

export const formatLongDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  return moment(date).tz('Asia/Jakarta').locale('id').format('D MMMM YYYY');
};
