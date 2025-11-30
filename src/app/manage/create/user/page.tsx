import type { Metadata } from 'next';
import CreateUserClientPage from './CreateUserClientPage';

export const metadata: Metadata = {
  title: 'Create New USER',
};

export default function CreateUserPage() {
  return <CreateUserClientPage />;
}
