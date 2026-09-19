import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import { User, Clock, QrCode, Calendar } from 'lucide-react';

type Props = {
  name?: string;
  email?: string;
  number?: string;
  event?: string;
  time?: string;
};

export const SuccessResultCard: FC<Props> = ({ name, email, number, event, time }) => (
  <div className="space-y-4 rounded-2xl border border-eventkan-ink/10 bg-eventkan-surface/70 p-5 text-left text-sm">
    <div className="flex items-start gap-3">
      <User className="mt-0.5 h-4.5 w-4.5 shrink-0 text-eventkan-green-ink" />
      <div>
        <p className="text-eventkan-muted text-[10px] font-bold uppercase tracking-wider">
          Peserta
        </p>
        <p className="mt-0.5 font-semibold text-eventkan-ink">{name}</p>
        <p className="text-xs text-eventkan-muted">{email}</p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <QrCode className="mt-0.5 h-4.5 w-4.5 shrink-0 text-eventkan-green-ink" />
      <div>
        <p className="text-eventkan-muted text-[10px] font-bold uppercase tracking-wider">
          No. Registrasi
        </p>
        <p className="mt-0.5 font-mono text-xs font-bold text-eventkan-ink">{number}</p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <Calendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-eventkan-green-ink" />
      <div>
        <p className="text-eventkan-muted text-[10px] font-bold uppercase tracking-wider">
          Event
        </p>
        <p className="mt-0.5 line-clamp-2 font-semibold leading-snug text-eventkan-ink">
          {event}
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <Clock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-eventkan-green-ink" />
      <div>
        <p className="text-eventkan-muted text-[10px] font-bold uppercase tracking-wider">
          Waktu Kehadiran
        </p>
        <p className="mt-0.5 font-semibold text-eventkan-ink">
          {time
            ? moment(time).clone().locale('id').tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm:ss') +
              ' WIB'
            : '-'}
        </p>
      </div>
    </div>
  </div>
);
