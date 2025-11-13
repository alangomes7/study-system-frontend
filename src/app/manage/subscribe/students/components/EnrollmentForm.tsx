'use client';

import React, { useEffect } from 'react';
import { useCreateSubscription } from '@/hooks';
import { CourseDropdown } from './CourseDropdown';
import { StudyClassDropdown } from './StudyClassDropdown';
import { StudentDropdown } from './StudentDropdown';

export function EnrollmentForm() {
  // Get state and actions needed for the form submission logic
  const {
    selectedStudentId,
    selectedStudyClassId,
    resetStudentSelection,
    setSortConfig,
    setIsSubmitting,
    isSubmitting,
  } = useSubscribeStudentStore();

  const {
    mutateAsync: createSubscriptionMutate,
    isPending,
    error: mutationError,
  } = useCreateSubscription({
    onSuccess: () => {
      resetStudentSelection();
      setSortConfig({ key: 'id', direction: 'descending' });
    },
  });

  useEffect(() => {
    setIsSubmitting(isPending);
  }, [isPending, setIsSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStudentId && selectedStudyClassId) {
      await createSubscriptionMutate({
        studentId: selectedStudentId,
        studyClassId: selectedStudyClassId,
      });
    }
  };

  const isDisabled =
    !selectedStudentId || !selectedStudyClassId || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
        <CourseDropdown />
        <StudyClassDropdown />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
        <StudentDropdown />
      </div>

      {mutationError && (
        <p className='text-red-500 text-sm'>Error: {mutationError.message}</p>
      )}

      <button type='submit' className='btn btn-primary' disabled={isDisabled}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe Student to Study Class'}
      </button>
    </form>
  );
}
