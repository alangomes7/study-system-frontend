import { getStudent } from '@/lib/api';
import type { Metadata } from 'next';
import StudentDetailsClientPage from './studentDetailsClientPage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const student = await getStudent(Number(id));

    return {
      title: `Student | ${student.name}`,
    };
  } catch {
    return {
      title: 'Student Details',
    };
  }
}

export default async function StudentDetailsPage({ params }: Props) {
  const { id } = await params;
  return <StudentDetailsClientPage id={Number(id)} />;
}
