import type { Config } from 'tailwindcss';

/**
 * 🎨 Custom Color Palette
 * Defined as a constant for better organization.
 * These are linked to CSS variables in your global stylesheet
 * (e.g., global.css or index.css).
 */
const customColors = {
  /* 🌍 Base Tokens */
  background: 'hsl(var(--background) / <alpha-value>)',
  foreground: 'hsl(var(--foreground) / <alpha-value>)',
  card: 'hsl(var(--card-background) / <alpha-value>)',
  border: 'hsl(var(--border) / <alpha-value>)',

  /* 📝 Text */
  'text-default': 'hsl(var(--text-default) / <alpha-value>)',
  'text-muted': 'hsl(var(--text-muted) / <alpha-value>)',
  'text-disabled': 'hsl(var(--text-disabled) / <alpha-value>)',

  /* 💡 Functional */
  primary: 'hsl(var(--primary) / <alpha-value>)',
  'primary-light': 'hsl(var(--primary-light) / <alpha-value>)',
  'primary-dark': 'hsl(var(--primary-dark) / <alpha-value>)',

  success: 'hsl(var(--success) / <alpha-value>)',
  warning: 'hsl(var(--warning) / <alpha-value>)',
  error: 'hsl(var(--error) / <alpha-value>)',
  info: 'hsl(var(--info) / <alpha-value>)',

  link: 'hsl(var(--link-color) / <alpha-value>)',
  'link-hover': 'hsl(var(--link-hover) / <alpha-value>)',

  disabled: 'hsl(var(--disabled) / <alpha-value>)',

  /* 🎨 Support for text-over colors */
  'over-primary': 'hsl(var(--text-over-primary) / <alpha-value>)',
  'over-success': 'hsl(var(--text-over-success) / <alpha-value>)',
  'over-warning': 'hsl(var(--text-over-warning) / <alpha-value>)',
  'over-error': 'hsl(var(--text-over-error) / <alpha-value>)',
  'over-info': 'hsl(var(--text-over-info) / <alpha-value>)',
};

/**
 * 📐 Custom Border Radius
 * Overriding default Tailwind values.
 */
const customBorderRadius = {
  DEFAULT: '0.5rem', // Overrides 'rounded'
  lg: '0.75rem', // Overrides 'rounded-lg'
  xl: '1rem', // Overrides 'rounded-xl'
};

/**
 * 💨 Custom Transitions
 * A utility class for theme-aware transitions.
 * Usage: `transition-theme`
 */
const customTransitions = {
  theme: 'background, color, border-color, fill, stroke',
};

// --- Main Tailwind Config ---

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],

  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: customColors,
      borderRadius: customBorderRadius,
      transitionProperty: customTransitions,
    },
  },

  plugins: [],
};

export default config;
