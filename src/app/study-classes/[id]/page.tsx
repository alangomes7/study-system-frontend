import type { Metadata } from 'next';
import StudyClassDetailsClientPage from './StudyClassDetailsClientPage';
import { getStudyClass } from '@/lib/api';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const studyClass = await getStudyClass(Number(id));

  return {
    title: `Study Classes | ${studyClass.courseName}`,
  };
}

export default async function StudyClassDetailsPage({ params }: Props) {
  const { id } = await params;

  const studyClass = await getStudyClass(Number(id));
  return <StudyClassDetailsClientPage studyClass={studyClass} />;
}
