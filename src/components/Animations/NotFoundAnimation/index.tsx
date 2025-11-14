'use client';

import AnimatedJson from '@/components/AnimatedJson';
import clsx from 'clsx';
import { AnimationProps } from '../types';

export default function NotFoundAnimation({ className = '' }: AnimationProps) {
  return (
    <AnimatedJson
      path='/animations/Error-Fail-animation.json'
      className={clsx(className)}
    />
  );
}
