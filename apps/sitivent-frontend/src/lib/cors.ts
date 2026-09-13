import type { Headers } from 'undici';

export const addCorsHeaders = (
  headers: Headers,
  origin: string | null,
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE']
): void => {
  const whitelist = (process.env.CORS_ORIGIN?.split(',') ?? ['*']).map((value) => value.trim());
  if (!origin) return;

  const allowed = whitelist.some((value) =>
    new RegExp(`^${value.replace(/\*/g, '.*')}$`).test(origin)
  );
  if (!allowed) return;

  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', methods.join(', '));
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400');
};
