import type { Metadata } from 'next';
import EnrollStudentPage from './enrollStudentPage';

export const metadata: Metadata = {
  title: 'Enroll Student',
};

export default function StudentsPage() {
  return <EnrollStudentPage />;
}
