'use client';

import type { RequestError } from '@/interfaces/error';

import { useEffect } from 'react';
import ErrorState from '@/components/Common/ErrorState';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reqError = error as RequestError;
  const statusCode = reqError.status || reqError.statusCode || 500;

  return <ErrorState code={statusCode} error={error} />;
}
