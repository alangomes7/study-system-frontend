import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components';
import { QueryProvider } from '@/providers';

export const metadata: Metadata = {
  title: {
    default: 'Study System Dashboard',
    template: 'Study System | %s',
  },
  description: 'Manage students, professors, and courses.',
};

/**
 * This script runs before React hydrates to prevent FOUC (Flash of Unstyled Content)
 * by setting the data-theme attribute on the <html> element immediately.
 */
const ThemeScript = () => {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (!theme && prefersDark)) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          // Default to 'light' if 'light' is saved or if no preference
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {
        // Fallback to light mode if something goes wrong
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        {/* Run the theme script immediately */}
        <ThemeScript />

        <QueryProvider>
          <NavBar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
