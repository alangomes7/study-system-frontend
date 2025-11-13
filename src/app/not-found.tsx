'use client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <title>Page not found</title>
      <div
        className={clsx(
          'min-h-screen flex items-center justify-center',
          'bg-background p-4 sm:p-6 md:p-8',
        )}
      >
        <div
          className={clsx(
            'w-full h-full max-w-6xl max-h-[90vh]',
            'p-12 rounded-2xl shadow-xl border',
            'bg-card-background border-border',
            'text-center animate-fade-in',
            'flex flex-col items-center justify-center',
          )}
        >
          <h1 className='text-8xl/tight mb-4 font-extrabold text-primary'>
            404
          </h1>
          <p className='text-foreground/80 text-lg max-w-xl mx-auto'>
            Error 404 — The page you are trying to access does not exist on this
            website.
          </p>

          <button
            onClick={() => router.back()}
            className='btn btn-primary mt-8 inline-block'
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}
