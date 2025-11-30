'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorLayout, ErrorAnimation } from '@/components';
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
        // Fix: Correctly check for error.message existence
        message={
          error.message ? `Error: ${error.message}` : 'Unknown error occurred.'
        }
        animation={<ErrorAnimation />}
        animationSize={{ width: 256, height: 256 }}
        tone='destructive'
        actions={
          <>
            <button
              onClick={reset}
              className={clsx('btn', 'btn-primary', 'inline-block')}
            >
              Try again
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
