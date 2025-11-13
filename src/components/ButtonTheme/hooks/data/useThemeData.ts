'use client';

import { Theme } from '@/components/ButtonTheme/types';
import { useState, useEffect } from 'react';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mounted: boolean;
}

/**
 * Hook to manage theme state. It synchronizes with the 'data-theme'
 * attribute set by the inline script in RootLayout and handles
 * theme changes triggered by the user.
 */
export function useThemeData(): UseThemeReturn {
  const [mounted, setMounted] = useState(false);

  // Default to 'light' for server-side rendering.
  // The client-side 'useEffect' will correct this on mount.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setMounted(true);

    // On mount, read the theme that the inline script already set
    const currentTheme = document.documentElement.getAttribute(
      'data-theme',
    ) as Theme | null;

    if (currentTheme === 'light' || currentTheme === 'dark') {
      // Synchronize React state with the DOM
      setTheme(currentTheme);
    } else {
      // Fallback if the inline script somehow failed
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      const fallbackTheme = prefersDark ? 'dark' : 'light';
      setTheme(fallbackTheme);
      document.documentElement.setAttribute('data-theme', fallbackTheme);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // This effect runs *after* mount and whenever the theme state changes
    // (e.g., when the user clicks the toggle button).
    if (!mounted) return;

    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]); // Re-runs when theme or mounted status changes

  return { theme, setTheme, mounted };
}
