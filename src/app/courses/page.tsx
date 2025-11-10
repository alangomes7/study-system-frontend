import type { Metadata } from 'next';
import CoursesClientPage from './courses-client';

export const metadata: Metadata = {
  title: 'Courses',
};

export default function CoursesPage() {
  return <CoursesClientPage />;
}
