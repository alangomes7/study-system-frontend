import type { Metadata } from 'next';
import StudyClassDetailsClientPage from './StudyClassDetailsClientPage';
import { getStudyClass } from '@/lib/api';

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);

  const studyClass = await getStudyClass(id);

  return {
    title: `Study Classes | ${studyClass.courseName}`,
  };
}

export default async function StudyClassDetailsPage({ params }: Props) {
  const id = params.id;

  const studyClass = await getStudyClass(id);
  return <StudyClassDetailsClientPage studyClass={studyClass} />;
}
