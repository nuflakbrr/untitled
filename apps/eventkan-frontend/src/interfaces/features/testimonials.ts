export interface Testimonial {
  id: string;
  registrationId: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    name: string | null;
    image: string | null;
    email?: string;
  };
  event?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface ExistingTestimonial {
  id?: string;
  rating?: number;
  comment?: string;
}

export interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export interface EventTestimonialsSummaryProps {
  averageRating: number;
  totalCount: number;
}

export interface EventTestimonialCardProps {
  testimonial: Testimonial;
}

export interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  eventTitle: string;
  existingTestimonial?: ExistingTestimonial | null;
}

export interface TestimonialRatingProps {
  rating: number;
  hoverRating: number;
  onRatingChange: (rating: number) => void;
  onHoverChange: (rating: number) => void;
}

export interface CreateTestimonialInput {
  registrationId: string;
  rating: number;
  comment: string;
}

export interface UpdateTestimonialInput {
  id: string;
  rating: number;
  comment: string;
}

export interface TestimonialResponse {
  success: boolean;
  message?: string;
  data?: Testimonial | null;
}

export interface TestimoniesPaginationResponse {
  success: boolean;
  data: Testimonial[];
  meta: {
    page: number;
    limit: number;
    total: number;
    lastPage: number;
  };
}
