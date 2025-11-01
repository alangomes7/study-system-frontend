import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },

        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        'card-background': 'var(--card-background)',
        'muted-foreground': 'var(--muted-foreground)',

        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        'primary-foreground': 'var(--text-over-primary)',
        'primary-light-foreground': 'var(--text-over-primary-light)',
        'primary-dark-foreground': 'var(--text-over-primary-dark)',

        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        'success-foreground': 'var(--text-over-success)',
        'warning-foreground': 'var(--text-over-warning)',
        'error-foreground': 'var(--text-over-error)',
        'info-foreground': 'var(--text-over-info)',

        link: 'var(--link-color)',
        'link-hover': 'var(--link-hover)',
        disabled: 'var(--disabled)',
        'text-disabled': 'var(--text-disabled)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
