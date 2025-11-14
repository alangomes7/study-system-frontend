'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useGetStudyClassesByCourse } from '@/hooks';
import { SpinLoaderAnimation } from '@/components';
import { useSubscribeProfessorStore } from '@/stores';

export function StudyClassDropdown() {
  const {
    selectedCourseId,
    selectedStudyClassId,
    openDropdown,
    isSubmitting,
    selectStudyClass,
    setDropdown,
  } = useSubscribeProfessorStore(); //

  const {
    data: studyClasses = [],
    isLoading: isLoadingClasses,
    error: classesError,
  } = useGetStudyClassesByCourse(selectedCourseId || 0);

  // Find the selected class to display its code and professor
  const selectedStudyClass = useMemo(
    () => studyClasses.find(sc => sc.id === selectedStudyClassId) || null,
    [studyClasses, selectedStudyClassId],
  );

  const selectedStudyClassName =
    selectedStudyClass?.classCode || '-- Select a study class --';
  const currentProfessorName =
    selectedStudyClass?.professorName || 'Not Assigned';

  const isDisabled = !selectedCourseId || isSubmitting || isLoadingClasses;

  return (
    <div className='relative'>
      {/* Show current professor instead of student count
       */}
      <p className='text-sm text-muted-foreground mb-1'>
        Professor:{' '}
        <span className='font-medium text-foreground'>
          {currentProfessorName}
        </span>
      </p>

      <label
        htmlFor='studyclass-button'
        className='block text-sm font-medium text-foreground/80 mb-1 sr-only'
      >
        Study Class
      </label>
      <button
        type='button'
        id='studyclass-button'
        disabled={isDisabled}
        onClick={() =>
          setDropdown(openDropdown === 'studyClass' ? null : 'studyClass')
        }
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span
          className={clsx(
            selectedStudyClassId
              ? 'text-foreground'
              : 'text-muted-foreground italic',
            'flex items-center',
          )}
        >
          {isLoadingClasses ? (
            <SpinLoaderAnimation className='w-4 h-4 mr-2' />
          ) : (
            selectedStudyClassName
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            openDropdown === 'studyClass'
              ? 'rotate-180 text-primary'
              : 'text-muted-foreground',
          )}
        />
      </button>

      {openDropdown === 'studyClass' && (
        <ul className='absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg'>
          {studyClasses.length > 0 ? (
            studyClasses.map(studyClass => (
              <li
                key={studyClass.id}
                onClick={() => selectStudyClass(studyClass.id)}
                className={clsx(
                  'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                  selectedStudyClassId === studyClass.id
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-foreground',
                )}
              >
                {studyClass.classCode} (
                {studyClass.professorName || 'Not Assigned'})
              </li>
            ))
          ) : (
            <li className='px-3 py-2 text-muted-foreground italic'>
              {selectedCourseId
                ? 'No classes for this course.'
                : 'Select a course first.'}
            </li>
          )}
        </ul>
      )}
      {classesError && (
        <p className='text-red-500 text-sm mt-1'>{classesError.message}</p>
      )}
    </div>
  );
}
