'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React from 'react';
import { useGetCourses } from '@/hooks';
import { SpinLoaderAnimation } from '@/components';
import { useSubscribeProfessorStore } from '@/stores'; //

export function CourseDropdown() {
  const { data: courses = [], isLoading, error } = useGetCourses();
  const {
    selectedCourseId,
    openDropdown,
    isSubmitting,
    selectCourse,
    setDropdown,
  } = useSubscribeProfessorStore(); //

  const selectedCourseName =
    courses.find(course => course.id === selectedCourseId)?.name ||
    '-- Select a course --';

  const isDisabled = isSubmitting || isLoading;

  return (
    <div className='relative'>
      <label
        htmlFor='course-button'
        className='block text-sm font-medium text-foreground/80 mb-1'
      >
        Course
      </label>
      <button
        type='button'
        id='course-button'
        disabled={isDisabled}
        onClick={() => setDropdown(openDropdown === 'course' ? null : 'course')}
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span
          className={clsx(
            selectedCourseId
              ? 'text-foreground'
              : 'text-muted-foreground italic',
            'flex items-center',
          )}
        >
          {isLoading ? (
            <SpinLoaderAnimation className='w-4 h-4 mr-2' />
          ) : (
            selectedCourseName
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            openDropdown === 'course'
              ? 'rotate-180 text-primary'
              : 'text-muted-foreground',
          )}
        />
      </button>

      {openDropdown === 'course' && (
        <ul className='absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg'>
          {courses.map(course => (
            <li
              key={course.id}
              onClick={() => selectCourse(course.id)}
              className={clsx(
                'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                selectedCourseId === course.id
                  ? 'bg-primary/20 text-primary-foreground'
                  : 'text-foreground',
              )}
            >
              {course.name}
            </li>
          ))}
        </ul>
      )}
      {error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
    </div>
  );
}
