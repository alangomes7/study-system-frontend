'use client';

import clsx from 'clsx';
import React from 'react';

type ToastActionButtonProps = {
  icon: React.ReactNode;
  variant?: 'confirm' | 'cancel';
} & React.ComponentProps<'button'>;

export default function ToastActionButton({
  icon,
  variant = 'confirm',
  className,
  ...props
}: ToastActionButtonProps) {
  const variants = {
    confirm:
      'bg-success text-primary-foreground hover:bg-success/90 focus:ring-success shadow-sm mb-2',
    cancel:
      'bg-error text-primary-foreground hover:bg-error/90 focus:ring-error shadow-sm mb-2',
  };

  return (
    <button
      type='button'
      className={clsx('btn px-3', variants[variant], className)}
      {...props}
    >
      {icon}
    </button>
  );
}
