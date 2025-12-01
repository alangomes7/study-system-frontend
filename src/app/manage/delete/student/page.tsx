import { Metadata } from 'next';
import DeleteStudentClientPage from './DeleteStudentClientPage';

export const metadata: Metadata = {
  title: 'Delete Student',
};

export default function DeleteStudentPage() {
  return <DeleteStudentClientPage />;
}
