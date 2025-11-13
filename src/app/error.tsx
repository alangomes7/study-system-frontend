'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorLayout from '@/components/ErrorLayout';
import clsx from 'clsx';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <title>Something went wrong</title>
      <ErrorLayout
        title='Oops!'
        subtitle='Something went wrong while loading this page.'
        message={error.message || 'Unknown error occurred.'}
        tone='destructive'
        animationSrc='/animations/Error-animation.json'
        actions={
          <>
            <button
              onClick={reset}
              className={clsx('btn', 'btn-primary', 'inline-block')}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className={clsx('btn', 'btn-outline', 'inline-block')}
            >
              Go Home
            </button>
          </>
        }
      />
    </>
  );
}
