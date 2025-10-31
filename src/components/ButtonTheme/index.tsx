'use client';

import { ContrastIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

// Define the available theme types
type Theme = 'light' | 'dark' | 'off-white';

/**
 * A button component that allows users to cycle between light, dark, and off-white themes.
 * The selected theme is persisted in localStorage to remember the user's choice.
 */
export function ButtonTheme() {
  // State to prevent SSR hydration errors by ensuring rendering only happens on the client
  const [mounted, setMounted] = useState(false);

  // State to hold the current theme. Defaults to 'off-white'.
  const [theme, setTheme] = useState<Theme>('off-white');

  // Effect to run only on the client after the component mounts
  useEffect(() => {
    setMounted(true);
    // Retrieve the saved theme from localStorage or detect the user's system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Effect to apply the theme to the document and save it to localStorage
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      // Use data-theme attribute for easier CSS targeting
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  // Handler to cycle through the available themes
  const handleThemeSwitch = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'off-white';
      return 'light'; // Cycles back to light from off-white
    });
  };

  // Don't render the button on the server to avoid theme mismatch on the client
  if (!mounted) {
    return null;
  }

  // Helper function to render the correct icon based on the *next* theme
  const renderIcon = () => {
    // Current: light -> Next: dark
    if (theme === 'light') return <MoonIcon className='h-5 w-5' />;
    // Current: dark -> Next: off-white
    if (theme === 'dark') return <ContrastIcon className='h-5 w-5' />;
    // Current: off-white -> Next: light
    return <SunIcon className='h-5 w-5' />;
  };

  return (
    <button
      onClick={handleThemeSwitch}
      className='p-2 rounded-full bg-card-background text-foreground border border-border 
                 hover:bg-border transition-all duration-300 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-primary focus:ring-offset-background'
      aria-label='Toggle theme'
    >
      {renderIcon()}
    </button>
  );
}
