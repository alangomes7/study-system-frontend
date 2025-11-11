import type { Metadata } from 'next';
import StudentGroupClientPage from './studentGroupPage';

export const metadata: Metadata = {
  title: 'Student Group',
};

export default function CoursesPage() {
  return <StudentGroupClientPage />;
}
