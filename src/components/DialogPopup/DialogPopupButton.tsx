import clsx from 'clsx';
import React from 'react';

type DialogPopupButtonProps = {
  icon: React.ReactNode;
  color?: 'green' | 'red';
} & React.ComponentProps<'button'>;

export default function DialogPopupButton({
  icon,
  color = 'green',
  className,
  ...props
}: DialogPopupButtonProps) {
  const colorVariants = {
    green: 'bg-success text-white hover:bg-success/90 focus:ring-success',
    red: 'bg-error text-white hover:bg-error/90 focus:ring-error',
  };

  return (
    <button className={clsx('btn', colorVariants[color], className)} {...props}>
      {icon}
    </button>
  );
}
