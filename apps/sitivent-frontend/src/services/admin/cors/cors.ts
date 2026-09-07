import type { Headers } from 'undici'; // Node v22 compatible

export const addCorsHeaders = (
  headers: Headers,
  origin: string | null,
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE']
): void => {
  // whitelist dari env, contoh: https://example.com,*.mydomain.com
  const whitelist = (process.env.CORS_ORIGIN?.split(',') ?? ['*']).map((s) => s.trim());
  if (!origin) return;
  const allowed = whitelist.some((w) =>
    new RegExp('^' + w.replace(/\*/g, '.*') + '$').test(origin)
  );
  if (!allowed) return;
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', methods.join(', '));
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400');
};
