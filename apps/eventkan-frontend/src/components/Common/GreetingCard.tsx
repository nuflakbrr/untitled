'use client';

import 'moment-timezone';

import moment from 'moment';
import { type FC, useState, useEffect } from 'react';

import { TIME_OF_DAY_CONFIG } from './_constants/greeting.constants';
import { getTimeOfDay, type TimeOfDay } from './_libs/getTimeOfDay.libs';

const GreetingCard: FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  useEffect(() => {
    const update = () => {
      const now = moment().tz('Asia/Jakarta');
      setCurrentTime(now.format('HH:mm:ss [WIB]'));
      setTimeOfDay(getTimeOfDay(now.hour()));
    };

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const { greeting, icon: GreetingIcon, iconClass, panelClass } = TIME_OF_DAY_CONFIG[timeOfDay];

  return (
    <div className="grid border gap-6 rounded-[22px] bg-eventkan-surface p-6 shadow-[0_18px_50px_rgba(17,35,63,.06)] lg:grid-cols-[1fr_380px] lg:items-center">
      <div>
        <h1 className="font-display mt-2 text-[clamp(28px,3vw,34px)] font-extrabold leading-none tracking-[-.04em] text-eventkan-ink">
          {greeting}!
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-eventkan-muted">
          Terimakasih sudah mengelola semua data dengan baik. Kamu sangat luar biasa!
        </p>
        {currentTime && (
          <p className="mt-3 text-[11px] text-eventkan-muted">Sekarang pukul {currentTime}</p>
        )}
      </div>
      <div
        className={`grid h-20 w-20 place-items-center justify-self-end rounded-[18px] sm:h-16 sm:w-16 ${panelClass}`}
      >
        <GreetingIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconClass}`} />
      </div>
    </div>
  );
};

export default GreetingCard;
