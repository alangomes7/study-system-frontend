'use client';

import { useRouter } from 'next/navigation';
import ErrorLayout from '@/components/ErrorLayout';
import clsx from 'clsx';
import { NotFoundAnimation } from '@/components';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <ErrorLayout
      title='404'
      subtitle='The page you are trying to access does not exist on this website.'
      animation={<NotFoundAnimation />}
      animationSize={{ width: 256, height: 256 }}
      actions={
        <>
          <button
            onClick={() => router.back()}
            className={clsx('btn', 'btn-primary', 'inline-block')}
          >
            Go Back
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
  );
}
