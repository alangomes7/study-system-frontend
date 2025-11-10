import { getStudyClass } from '@/lib/api';
import type { Metadata } from 'next';
import EnrollStudentClientPage from './EnrollStudentClientPage';

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);

  const studyClass = await getStudyClass(id);

  return {
    title: `Enroll Student in ${studyClass.classCode}`,
  };
}

export default async function StudyClassDetailsPage({ params }: Props) {
  const id = params.id;

  const studyClass = await getStudyClass(id);
  return <EnrollStudentClientPage studyClass={studyClass} />;
}
