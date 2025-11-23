'use client';

import AnimatedJson from '@/components/AnimatedJson';
import clsx from 'clsx';
import { AnimationProps } from '../types';

export default function DotsAnimation({ className = '' }: AnimationProps) {
  return (
    <AnimatedJson
      path='/animations/Dots-Loading.json'
      className={clsx(className)}
    />
  );
}
