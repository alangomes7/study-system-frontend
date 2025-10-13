import { useState, useEffect } from 'react';

// Using inline SVGs for the icons to remove the dependency on 'phosphor-react'
const SunIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='5'></circle>
    <line x1='12' y1='1' x2='12' y2='3'></line>
    <line x1='12' y1='21' x2='12' y2='23'></line>
    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
    <line x1='1' y1='12' x2='3' y2='12'></line>
    <line x1='21' y1='12' x2='23' y2='12'></line>
    <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
    <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
  </svg>
);

/**
 * A button component that allows users to toggle between light and dark themes.
 * The selected theme is persisted in localStorage.
 */
export function ButtonTheme() {
  // Initialize state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // If no saved theme, check the user's system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Effect to apply the theme to the <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Function to toggle the theme
  const handleThemeSwitch = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={handleThemeSwitch}
      className='p-2 rounded-full text-gray-800 dark:text-yellow-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
