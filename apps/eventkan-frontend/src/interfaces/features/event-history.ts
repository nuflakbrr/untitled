import type { ParticipantRegistration } from './registrations';

export interface EventHistoryStatsProps {
  registrations: ParticipantRegistration[];
}

export interface EventHistoryStatusConfig {
  label: string;
  className: string;
}
