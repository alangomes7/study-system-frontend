import { CreateCourseForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Course',
};

export default function CreateCourseClientPage() {
  return <CreateCourseForm />;
}
