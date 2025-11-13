'use client';

import { Theme } from '@/components/ButtonTheme/types';
import { useState, useEffect } from 'react';

export interface UseThemeReturn {
  /** Current selected theme */
  theme: Theme;
  /** Setter for the theme */
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  /** Whether the component has mounted */
  mounted: boolean;
}

/**
 * Hook to manage theme state, initialize from localStorage or system preference,
 * and synchronize changes with the DOM and localStorage.
 */
export function useThemeData(): UseThemeReturn {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  return { theme, setTheme, mounted };
}
