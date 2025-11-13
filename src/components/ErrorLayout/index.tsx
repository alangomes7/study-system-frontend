'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false },
);

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm?: string;
  layers: unknown[];
  [key: string]: unknown;
}

interface ErrorLayoutProps {
  title: string;
  subtitle: string;
  message?: string;
  actions?: React.ReactNode;
  tone?: 'default' | 'destructive';
  illustrationSrc?: string;
  animationSrc?: string;
}

export default function ErrorLayout({
  title,
  subtitle,
  message,
  actions,
  tone = 'default',
  illustrationSrc,
  animationSrc,
}: ErrorLayoutProps) {
  const [animationData, setAnimationData] = useState<LottieAnimation | null>(
    null,
  );

  useEffect(() => {
    if (animationSrc) {
      fetch(animationSrc)
        .then(res => res.json())
        .then((data: LottieAnimation) => setAnimationData(data))
        .catch(err => console.error('Failed to load animation:', err));
    }
  }, [animationSrc]);

  return (
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
        {/* Lottie animation (preferred) */}
        {animationData ? (
          <Player
            autoplay
            loop
            src={animationData}
            style={{ height: '200px', width: '200px', marginBottom: '1rem' }}
          />
        ) : illustrationSrc ? (
          <div className='relative w-48 h-48 mb-6'>
            <Image
              src={illustrationSrc}
              alt='Error illustration'
              fill
              sizes='192px'
              priority
              className='object-contain'
            />
          </div>
        ) : null}

        <h1
          className={clsx(
            'text-6xl/tight mb-4 font-extrabold',
            tone === 'destructive' ? 'text-destructive' : 'text-primary',
          )}
        >
          {title}
        </h1>

        <p className='text-foreground/80 text-lg max-w-xl mx-auto'>
          {subtitle}
          {message && (
            <span className='block text-sm text-muted-foreground mt-2'>
              {message}
            </span>
          )}
        </p>

        {actions && <div className='flex gap-4 mt-8'>{actions}</div>}
      </div>
    </div>
  );
}
