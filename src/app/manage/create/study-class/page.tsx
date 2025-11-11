import type { Metadata } from 'next';
import CreateStudyClassClientPage from './createStudyClassClientPage';

export const metadata: Metadata = {
  title: 'Create Study Class',
};

export default function CreateStudyClassPage() {
  return <CreateStudyClassClientPage />;
}
