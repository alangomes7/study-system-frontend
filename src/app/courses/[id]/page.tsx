import { getCourse } from '@/lib/api';
import type { Metadata } from 'next';
import CourseDetailsClientPage from './courseDetailsClientPage';

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const course = await getCourse(id);

  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: `Course | ${course.name}`,
  };
}

export default function CourseDetailsPage({ params }: Props) {
  const idAsNumber = Number(params.id);

  return <CourseDetailsClientPage id={idAsNumber} />;
}
