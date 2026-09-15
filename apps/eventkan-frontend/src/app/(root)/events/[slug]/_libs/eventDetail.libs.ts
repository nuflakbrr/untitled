import { icons, Sparkles } from 'lucide-react';

export function getBenefitIcon(iconName?: string | null) {
  if (!iconName) return Sparkles;

  const pascalName = iconName
    .trim()
    .replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());

  return icons[pascalName as keyof typeof icons] || icons[iconName as keyof typeof icons] || Sparkles;
}

export function sanitizeEventDescription(description: string) {
  return description.replace(
    /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi,
    (match: string, href: string) => {
      const trimmed = href.trim();
      const formattedHref = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      let tag = match.replace(href, formattedHref);

      if (!/target=/i.test(tag)) {
        tag = tag.replace(/<a\b/i, '<a target="_blank" rel="noopener noreferrer"');
      }

      return tag;
    }
  );
}
