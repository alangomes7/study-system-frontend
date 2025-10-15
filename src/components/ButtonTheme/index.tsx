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

  // State to hold the current theme. Defaults to 'light'.
  const [theme, setTheme] = useState<Theme>('light');

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

  // Helper function to render the correct icon based on the current theme
  const renderIcon = () => {
    if (theme === 'light') return <MoonIcon />;
    if (theme === 'dark') return <SunIcon />;
    return <ContrastIcon />; // For 'off-white' theme
  };

  return (
    <button
      onClick={handleThemeSwitch}
      className='p-2 rounded-full text-gray-800 dark:text-yellow-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
      aria-label='Toggle theme'
    >
      {renderIcon()}
    </button>
  );
}
