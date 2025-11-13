import type { Metadata } from 'next';
import SubscribeProfessorClientPage from './SubscribeProfessorClientPage';

export const metadata: Metadata = {
  title: 'Enroll Professor',
};

export default function SubscribeProfessorPage() {
  return <SubscribeProfessorClientPage />;
}
