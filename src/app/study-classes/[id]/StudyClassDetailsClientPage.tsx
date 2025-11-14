'use client';

import Link from 'next/link';
import { useGetSubscriptionsByStudyClass } from '@/hooks';
import { StudyClass } from '@/types';
import { SpinLoader } from '@/components';

export default function StudyClassDetailsClientPage({
  studyClass,
}: {
  studyClass: StudyClass;
}) {
  const {
    data: subscriptions = [],
    isLoading: isSubscriptionsLoading,
    error: subscriptionsError,
  } = useGetSubscriptionsByStudyClass(studyClass.id);

  const isLoading = isSubscriptionsLoading;
  const error = subscriptionsError;

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoaderAnimationq>
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center mt-8 text-red-500'>
        Error loading subscriptions: {error.message}
      </p>
    );
  }

  if (!studyClass) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Class not found.
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='card p-6 mb-8'>
        <h1 className='text-3xl font-bold mb-2 text-foreground'>
          {studyClass.classCode}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
          <p className='text-foreground'>
            <strong>Course:</strong> {studyClass.courseName}
          </p>
          <p className='text-foreground'>
            <strong>Professor:</strong>{' '}
            {studyClass.professorName || 'Not Assigned'}
          </p>
          <p className='text-foreground'>
            <strong>Year:</strong> {studyClass.year}
          </p>
          <p className='text-foreground'>
            <strong>Semester:</strong> {studyClass.semester}
          </p>
        </div>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-foreground'>
          Enrolled Students
        </h2>
        <div className='flex gap-4'>
          <Link
            href={`/study-classes/${studyClass.id}/enroll-student`}
            className='btn btn-primary'
          >
            Enroll Student
          </Link>
          <Link
            href={`/study-classes/${studyClass.id}/enroll-professor`}
            className='btn border border-border bg-card-background hover:bg-foreground/5'
          >
            Enroll Professor
          </Link>
        </div>
      </div>

      {subscriptions.length > 0 ? (
        <div className='overflow-x-auto bg-card-background rounded-lg border border-border'>
          <table className='min-w-full'>
            <thead>
              <tr className='border-b border-border'>
                <th className='py-2 px-4 border-b border-border text-center text-foreground/80'>
                  Student Name
                </th>
                <th className='py-2 px-4 border-b border-border text-center text-foreground/80'>
                  Subscription Date
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(subscription => (
                <tr
                  key={subscription.id}
                  className='hover:bg-foreground/5 border-b border-border'
                >
                  <td className='py-2 px-4 border-b text-center text-foreground'>
                    {subscription.studentName}
                  </td>
                  <td className='py-2 px-4 border-b text-center text-foreground'>
                    {new Date(subscription.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='card p-6 text-center'>
          <p className='text-foreground/80'>
            No students enrolled in this class.
          </p>
        </div>
      )}
    </div>
  );
}
