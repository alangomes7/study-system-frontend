'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface ErrorLayoutProps {
  title: string;
  subtitle: string;
  message?: string;
  actions?: ReactNode;
  animation?: ReactNode;
  animationSize?: { width: number; height: number };
  tone?: 'default' | 'destructive';
}

export default function ErrorLayout({
  title,
  subtitle,
  message,
  actions,
  animation,
  animationSize,
  tone = 'default',
}: ErrorLayoutProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-4xl p-12 rounded-xl shadow-xl border bg-card-background text-center'>
        {animationSize && (
          <div
            className='mx-auto mb-6 flex items-center justify-center'
            style={{
              width: animationSize.width,
              height: animationSize.height,
            }}
          >
            {animation}
          </div>
        )}

        <h1
          className={clsx(
            'text-6xl mb-4 font-extrabold',
            tone === 'destructive' ? 'text-error' : 'text-primary',
          )}
        >
          {title}
        </h1>

        <p className='text-foreground/80 text-lg max-w-xl mx-auto'>
          {subtitle}

          {message && (
            <span
              className={clsx(
                'block text-sm mt-2',
                tone === 'destructive' ? 'text-error' : 'text-muted-foreground',
              )}
            >
              {message}
            </span>
          )}
        </p>

        {actions && (
          <div className='flex gap-4 mt-8 justify-center'>{actions}</div>
        )}
      </div>
    </div>
  );
}
