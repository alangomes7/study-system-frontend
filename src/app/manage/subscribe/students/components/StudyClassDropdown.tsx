'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React from 'react';
import {
  useGetStudyClassesByCourse,
  useGetStudentsByStudyClass,
} from '@/hooks';
import { SpinLoader } from '@/components';
import { useSubscribeFormStore } from '@/stores';

export function StudyClassDropdown() {
  const {
    selectedCourseId,
    selectedStudyClassId,
    openDropdown,
    isSubmitting,
    selectStudyClass,
    setDropdown,
  } = useSubscribeFormStore();

  const {
    data: studyClasses = [],
    isLoading: isLoadingClasses,
    error: classesError,
  } = useGetStudyClassesByCourse(selectedCourseId || 0);

  const { data: enrolledStudents = [], isLoading: isLoadingEnrolled } =
    useGetStudentsByStudyClass(selectedStudyClassId);

  const selectedStudyClassName =
    studyClasses.find(sc => sc.id === selectedStudyClassId)?.classCode ||
    '-- Select a study class --';

  const isDisabled = !selectedCourseId || isSubmitting || isLoadingClasses;

  return (
    <div className='relative'>
      <p className='text-sm text-muted-foreground mb-1'>
        <span className='font-medium text-foreground'>
          {isLoadingEnrolled ? '...' : enrolledStudents.length}
        </span>{' '}
        students enrolled in this class.
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
            <SpinLoader className='w-4 h-4 mr-2' />
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
                {studyClass.classCode}
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
