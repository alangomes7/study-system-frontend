import { UserForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Account',
};

export default function CreateNewUserAccountPage() {
  return <UserForm userType='User' title='Create New User Account' />;
}
