import type { Metadata } from 'next';
import CoursesClientPage from './CoursesClientPage';

export const metadata: Metadata = {
  title: 'Courses',
};

export default function CoursesPage() {
  return <CoursesClientPage />;
}
