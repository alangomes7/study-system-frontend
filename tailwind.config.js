/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // This line is essential for the theme toggle to work.
  // It tells Tailwind to apply dark mode styles when the 'dark' class is present on the html tag.
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
