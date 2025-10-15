/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Use a data attribute for theming and specify the selector for dark mode
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Define colors that will be controlled by CSS variables
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
};
