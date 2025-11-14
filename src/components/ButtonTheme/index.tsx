'use client';

import { useThemeData } from './hooks/data/useThemeData';
import { useThemeHandlers } from './hooks/handlers/useThemeHandlers';
import { ThemeIcon } from './subcomponents/ThemeIcon';

/**
 * Button to toggle between light and dark themes.
 * Persists theme in localStorage and updates the document root attribute.
 */
export default function ButtonTheme() {
  const { theme, setTheme, mounted } = useThemeData();
  const { handleThemeSwitch } = useThemeHandlers(setTheme);

  const buttonClasses = `
    p-2 rounded-full bg-card-background text-foreground border border-border
    hover:bg-border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-primary focus:ring-offset-background
  `;

  if (!mounted) {
    return (
      <button aria-label='Toggle theme' className={buttonClasses} disabled>
        <ThemeIcon theme='light' />
      </button>
    );
  }

  return (
    <button
      onClick={handleThemeSwitch}
      aria-label='Toggle theme'
      className={buttonClasses}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

export * from './hooks/data/useThemeData';
export * from './types';
