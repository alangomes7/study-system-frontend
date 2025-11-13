'use client';

import React, { useEffect } from 'react';
import { useEnrollProfessor } from '@/hooks';
import { CourseDropdown } from './CourseDropdown';
import { StudyClassDropdown } from './StudyClassDropdown';
import { ProfessorDropdown } from './ProfessorDropdown';
import { useSubscribeProfessorStore } from '@/stores';
import { toast } from 'react-toastify';

export function ProfessorEnrollmentForm() {
  // Get state and actions from the form store
  const {
    selectedProfessorId,
    selectedStudyClassId,
    resetProfessorSelection,
    setIsSubmitting,
    isSubmitting,
  } = useSubscribeProfessorStore();

  const {
    mutateAsync: enrollProfessorMutate,
    isPending,
    error: mutationError,
  } = useEnrollProfessor();

  useEffect(() => {
    setIsSubmitting(isPending);
  }, [isPending, setIsSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedProfessorId && selectedStudyClassId) {
      await enrollProfessorMutate(
        {
          studyClassId: selectedStudyClassId,
          professorId: selectedProfessorId,
        },
        {
          onSuccess: data => {
            toast.success(
              `Professor ${data.professorName} enrolled in ${data.classCode}!`,
            );
            resetProfessorSelection();
          },
          onError: error => {
            toast.error(`Error: ${error.message}`);
          },
        },
      );
    }
  };

  const isDisabled =
    !selectedProfessorId || !selectedStudyClassId || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
        <CourseDropdown />
        <StudyClassDropdown />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
        <ProfessorDropdown />
      </div>

      {mutationError && (
        <p className='text-red-500 text-sm'>Error: {mutationError.message}</p>
      )}

      <button type='submit' className='btn btn-primary' disabled={isDisabled}>
        {isSubmitting ? 'Enrolling...' : 'Enroll Professor in Study Class'}
      </button>
    </form>
  );
}
