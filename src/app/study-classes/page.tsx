import type { Metadata } from 'next';
import StudyClassesClientPage from './studyClassesClientPage';

export const metadata: Metadata = {
  title: 'Study Classes',
};

export default function CoursesPage() {
  return <StudyClassesClientPage />;
}
