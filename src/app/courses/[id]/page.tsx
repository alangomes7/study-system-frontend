import { getCourse } from '@/lib/api';
import type { Metadata } from 'next';
import CourseDetailsClientPage from './courseDetailsClientPage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const course = await getCourse(Number(id));

  if (!course) {
    return { title: 'Course Not Found' };
  }

  return {
    title: `Course | ${course.name}`,
  };
}

export default async function CourseDetailsPage({ params }: Props) {
  const { id } = await params;

  return <CourseDetailsClientPage id={Number(id)} />;
}
