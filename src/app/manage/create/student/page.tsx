import { UserForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Student',
};

export default function CreateStudentPage() {
  return <UserForm userType='Student' title='Create Student' />;
}
