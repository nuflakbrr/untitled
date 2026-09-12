export const sanitizeCallbackUrl = (url: string | null): string => {
  if (!url) return '/admin/dashboard';
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
    return url;
  }
  return '/admin/dashboard';
};
