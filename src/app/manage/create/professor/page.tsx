import { UserForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Professor',
};

export default function CreateProfessorPage() {
  return <UserForm userType='Professor' title='Create Professor' />;
}
