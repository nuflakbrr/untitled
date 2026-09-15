import { Tag, Mic2, Code2, Laptop, MonitorPlay, MessageSquare } from 'lucide-react';

export const getCategoryConfig = (slug: string) => {
  const normalizedSlug = slug.toLowerCase();

  if (normalizedSlug.includes('seminar')) return { icon: Mic2 };
  if (normalizedSlug.includes('workshop')) return { icon: Laptop };
  if (normalizedSlug.includes('webinar')) return { icon: MonitorPlay };
  if (normalizedSlug.includes('bootcamp')) return { icon: Code2 };
  if (
    normalizedSlug.includes('talk') ||
    normalizedSlug.includes('show') ||
    normalizedSlug.includes('wicara')
  ) {
    return { icon: MessageSquare };
  }

  return { icon: Tag };
};
