import { MessageSquare } from 'lucide-react';

import EmptyState from '../../../_components/EmptyState';

const EmptyEventTestimonials = () => (
  <EmptyState
    icon={MessageSquare}
    title="Belum ada ulasan"
    description="Event ini belum memiliki ulasan dari peserta. Ulasan dapat diberikan setelah event selesai."
  />
);

export default EmptyEventTestimonials;
