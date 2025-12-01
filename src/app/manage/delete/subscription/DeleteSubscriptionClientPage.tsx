'use client';

import { CourseDropdown } from './components/CourseDropdown';
import { StudyClassDropdown } from './components/StudyClassDropdown';
import { SubscriptionDropdown } from './components/SubscriptionDropdown';
import { useDeleteSubscriptionData } from './hooks/useDeleteSubscriptionData';
import { useDeleteSubscriptionHandlers } from './hooks/useDeleteSubscriptionHandlers';
import { DotsAnimation } from '@/components';

export default function DeleteSubscriptionClientPage() {
  const { selectedSubscription } = useDeleteSubscriptionData();
  const { handleDelete, isDeleting } = useDeleteSubscriptionHandlers();

  return (
    <div className='container mx-auto px-4 py-8 max-w-xl'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Delete Subscription
      </h1>

      <div className='card p-6 space-y-4'>
        <p className='text-muted-foreground mb-4'>
          Select a class to remove a student from.
        </p>

        <CourseDropdown />
        <StudyClassDropdown />
        <SubscriptionDropdown />

        <button
          onClick={handleDelete}
          disabled={!selectedSubscription || isDeleting}
          className='btn bg-error text-white hover:bg-red-700 w-full mt-4 disabled:opacity-50'
        >
          {isDeleting ? (
            <span className='flex items-center justify-center gap-2'>
              <DotsAnimation className='w-4 h-4 text-white' /> Removing...
            </span>
          ) : (
            'Remove Student from Class'
          )}
        </button>
      </div>
    </div>
  );
}
