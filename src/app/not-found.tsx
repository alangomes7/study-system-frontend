import clsx from 'clsx';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <title>Página não encontrada</title>
      <div
        className={clsx(
          'min-h-80 mb-16 p-8',
          'flex items-center justify-center text-center',
          'card animate-fade-in',
        )}
      >
        <div>
          <h1
            className={clsx('text-7xl/tight mb-4 font-extrabold text-primary')}
          >
            404
          </h1>
          <p className='text-foreground/80'>
            Error 404 — The page you are trying to access does not exist on this
            website.
          </p>

          <Link href='/' className={clsx('btn btn-primary mt-6 inline-block')}>
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
}
