'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Button component to toggle between light and dark themes.
 * Persists selection in localStorage.
 */
export function ButtonTheme() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // --- Initialize theme after mount ---
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

  // --- Apply theme to document root ---
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // --- Toggle between themes ---
  const handleThemeSwitch = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const buttonClasses = `
    p-2 rounded-full bg-card-background text-foreground border border-border
    hover:bg-border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-primary focus:ring-offset-background
  `;

  if (!mounted) {
    return (
      <button aria-label='Toggle theme' className={buttonClasses} disabled>
        <MoonIcon className='h-5 w-5' /> {/* Default icon */}
      </button>
    );
  }

  // --- Show icon for next theme ---
  const renderIcon = () =>
    theme === 'light' ? (
      <MoonIcon className='h-5 w-5' />
    ) : (
      <SunIcon className='h-5 w-5' />
    );

  return (
    <button
      onClick={handleThemeSwitch}
      aria-label='Toggle theme'
      className={buttonClasses}
    >
      {renderIcon()}
    </button>
  );
}
