'use client';

import { Theme } from '@/components/ButtonTheme/types';
import { MoonIcon, SunIcon } from 'lucide-react';

export interface ThemeIconProps {
  /** Current theme used to decide which icon to show */
  theme: Theme;
}

/**
 * Displays a moon icon for light theme, and a sun icon for dark theme.
 */
export function ThemeIcon({ theme }: ThemeIconProps) {
  return theme === 'light' ? (
    <MoonIcon className='h-5 w-5' />
  ) : (
    <SunIcon className='h-5 w-5' />
  );
}
