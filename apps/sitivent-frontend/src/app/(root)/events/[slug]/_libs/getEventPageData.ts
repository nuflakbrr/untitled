import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

import type { EventDetailPageData } from '@/interfaces/features/events';

import { auth } from '@/lib/auth';
import { getPublicEventBySlug } from '@/services/public/events';
import { getEventRegistrationStatus } from '@/services/participant/registrations';

export async function getEventPageData(slug: string): Promise<EventDetailPageData | null> {
  const event = await getPublicEventBySlug(slug);

  if (!event) return null;

  const session = await auth.api.getSession();
  const isAuthenticated = !!session?.user;
  let isRegistered = false;
  let registrationStatus: string | null = null;

  if (isAuthenticated && session.user.id) {
    const registration = await getEventRegistrationStatus(event.id);

    if (registration) {
      isRegistered = true;
      registrationStatus = registration.status;
    }
  }

  const totalRegistered = event.registrationCount;
  const slotsLeft = Math.max(0, event.quota - totalRegistered);

  return {
    event,
    formattedDeadline: moment(event.registrationDeadline)
      .tz('Asia/Jakarta')
      .locale('id')
      .format('DD MMMM YYYY, HH:mm'),
    formattedStartDate: moment(event.startDate)
      .tz('Asia/Jakarta')
      .locale('id')
      .format('DD MMMM YYYY'),
    isAuthenticated,
    isDeadlinePassed: new Date() > new Date(event.registrationDeadline),
    isEmailVerified: !!session?.user?.emailVerified,
    isFree: event.price === 0,
    isQuotaFull: slotsLeft <= 0,
    isRegistered,
    registrationStatus,
    slotsLeft,
    totalRegistered,
  };
}
