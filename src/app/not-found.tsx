'use client';
import { useRouter } from 'next/navigation';
import ErrorLayout from '@/components/ErrorLayout';
import clsx from 'clsx';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <title>Page not found</title>
      <ErrorLayout
        title='404'
        subtitle='The page you are trying to access does not exist on this website.'
        animationSrc='/animations/Error-fail-animation.json'
        actions={
          <button
            onClick={() => router.back()}
            className={clsx('btn btn-primary', 'inline-block')}
          >
            Go Back
          </button>
        }
      />
    </>
  );
}
