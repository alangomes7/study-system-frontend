import type { Metadata } from 'next';
import SubscribeStudentClientPage from './SubscribeStudentClientPage';

export const metadata: Metadata = {
  title: 'Subscribe Student',
};

export default function SubscribeStudentPage() {
  return <SubscribeStudentClientPage />;
}
