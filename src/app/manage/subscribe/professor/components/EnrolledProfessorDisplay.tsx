'use client';

import { SpinLoader } from '@/components';
import React from 'react';
import { useGetStudyClass } from '@/hooks';
import { useSubscribeProfessorStore } from '@/stores';
import Link from 'next/link';

export function EnrolledProfessorDisplay() {
  const { selectedStudyClassId } = useSubscribeProfessorStore();

  const {
    data: studyClass,
    isLoading,
    error,
    isFetching,
  } = useGetStudyClass(selectedStudyClassId || 0);

  if (!selectedStudyClassId) {
    return (
      <div className='card text-center p-6'>
        <p className='text-foreground/70'>
          Please select a study class to see the enrolled professor.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='card p-6 text-center'>
        <SpinLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='card p-6 text-center'>
        <p className='text-error'>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='card p-6 space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-foreground'>
          Current Professor for {studyClass?.classCode}
        </h2>
        {isFetching && <SpinLoader className='w-5 h-5' />}
      </div>

      {studyClass?.professorId ? (
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-lg text-foreground'>
              {studyClass.professorName}
            </p>
            <p className='text-sm text-muted-foreground'>
              ID: {studyClass.professorId}
            </p>
          </div>
          <Link
            href={`/professors/${studyClass.professorId}`}
            className='btn border border-border hover:bg-foreground/5'
          >
            View Details
          </Link>
        </div>
      ) : (
        <p className='text-muted-foreground italic'>
          No professor is currently assigned to this class.
        </p>
      )}
    </div>
  );
}
