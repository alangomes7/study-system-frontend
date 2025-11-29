import { UserForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New USER',
};

export default function CreateUserPage() {
  return <UserForm userType='User' title='Create New USER Account' />;
}
