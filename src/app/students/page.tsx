import type { Metadata } from 'next';
import StudentsClientPage from './studentsClientPage';

export const metadata: Metadata = {
  title: 'Students',
};

export default function StudentsPage() {
  return <StudentsClientPage />;
}
