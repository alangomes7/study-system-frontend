'use client';

import AnimatedJson from '@/components/AnimatedJson';
import clsx from 'clsx';
import { AnimationProps } from '../types';

export default function ErrorAnimation({ className = '' }: AnimationProps) {
  return (
    <AnimatedJson
      path='/animations/Error-animation.json'
      className={clsx(className)}
    />
  );
}
