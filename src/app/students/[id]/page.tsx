import { getStudent } from '@/lib/api';
import type { Metadata } from 'next';
import StudentDetailsClientPage from './studentDetailsClientPage';

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const student = await getStudent(id);

  if (!student) {
    return {
      title: 'Students',
    };
  }

  return {
    title: `Student | ${student.name}`,
  };
}

export default function CourseDetailsPage({ params }: Props) {
  const idAsNumber = Number(params.id);

  return <StudentDetailsClientPage id={idAsNumber} />;
}
