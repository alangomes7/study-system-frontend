import { Metadata } from 'next';
import DeleteSubscriptionClientPage from './DeleteSubscriptionClientPage';

export const metadata: Metadata = {
  title: 'Delete Subscription',
};

export default function DeleteSubscriptionPage() {
  return <DeleteSubscriptionClientPage />;
}
