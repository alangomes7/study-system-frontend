'use client';

import AnimatedJson from '@/components/AnimatedJson';
import clsx from 'clsx';
import { AnimationProps } from '../types';

export default function SpinLoaderAnimation({
  className = '',
}: AnimationProps) {
  return (
    <AnimatedJson
      path='/animations/Circle-Loading.json'
      className={clsx(className)}
    />
  );
}
