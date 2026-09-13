import type { LucideIcon } from 'lucide-react';

import type { ApiResponse, PaginatedResponse } from './common';
import type { EventType, EventStatus } from '@/interfaces/enums';

export interface EventSpeaker {
  id?: string;
  name?: string | null;
  title?: string | null;
  company?: string | null;
  companyUrl?: string | null;
  github?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  avatar?: string | null;
  order?: number;
}

export interface EventBenefit {
  id?: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  order?: number;
}

export interface EventCreator {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner?: string | null;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  meetingLink?: string | null;
  eventType: EventType;
  onlineAttendance?: boolean;
  registrationDeadline: Date;
  quota: number;
  price: number;
  status: EventStatus;
  certificateEnabled: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdById?: string | null;
  createdBy?: EventCreator | null;
  categoryId?: string | null;
  category?: EventCategory | null;
  registrationCount: number;
  speakers: EventSpeaker[];
  benefits: EventBenefit[];
  _count?: {
    registrations: number;
  };
}

export type EventResponse = ApiResponse<Event>;
export type EventPaginationResponse = PaginatedResponse<Event>;

export interface EventSearchResult {
  id: string;
  title: string;
  slug: string;
  banner: string | null;
  startDate: string;
  eventType: EventType;
}

export interface EventSearchResponse {
  data: EventSearchResult[];
}

export interface EventsResultsProps {
  events: Event[];
  query?: string;
}

export interface EventDetailPageData {
  event: Event;
  formattedDeadline: string;
  formattedStartDate: string;
  isAuthenticated: boolean;
  isDeadlinePassed: boolean;
  isEmailVerified: boolean;
  isFree: boolean;
  isQuotaFull: boolean;
  isRegistered: boolean;
  registrationStatus: string | null;
  slotsLeft: number;
  totalRegistered: number;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  eventsCount?: number;
  _count?: {
    events: number;
  };
}

export interface CategoryLinksProps {
  categories: EventCategory[];
}

export interface FeaturedEventsProps {
  events: Event[];
  categories: EventCategory[];
}

export interface HeroBannerProps {
  events: Event[];
}

export interface EventCardProps {
  event: Event;
  formattedStartDate: string;
  coverStyle: string;
}

export interface EventSearchProps {
  categories: EventCategory[];
}

export interface EventTestimonialsProps {
  eventId: string;
}

export interface RegisterButtonProps {
  eventId: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isRegistered: boolean;
  registrationStatus?: string | null;
  isDeadlinePassed: boolean;
  isQuotaFull: boolean;
  price: number;
  slug: string;
  userRole?: string | null;
}

export interface RegisterDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  price: number;
}

export interface RegistrationStatusButtonProps {
  className?: string;
  icon: LucideIcon;
  label: string;
}

export interface EventsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export type EventCategoryResponse = ApiResponse<EventCategory>;
export type EventCategoryPaginationResponse = PaginatedResponse<EventCategory>;
