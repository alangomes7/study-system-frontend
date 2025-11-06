import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components';
import { QueryProvider } from '@/providers';

export const metadata: Metadata = {
  title: {
    default: 'Study System Dashboard',

    // The "%s" will be replaced by the title set in page.tsx files
    template: '%s | Study System',
  },
  description: 'Manage students, professors, and courses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <QueryProvider>
          <NavBar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
