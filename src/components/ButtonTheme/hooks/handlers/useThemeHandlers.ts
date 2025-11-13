import { Theme } from '@/components/ButtonTheme/types';

export interface ThemeHandlers {
  /** Toggles between 'light' and 'dark' themes */
  handleThemeSwitch: () => void;
}

/**
 * Provides handler functions for theme-related actions.
 */
export function useThemeHandlers(
  setTheme: React.Dispatch<React.SetStateAction<Theme>>,
): ThemeHandlers {
  const handleThemeSwitch = (): void => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { handleThemeSwitch };
}
