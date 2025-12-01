'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useDeleteSubscriptionData } from '../hooks/useDeleteSubscriptionData';
import { useDeleteSubscriptionHandlers } from '../hooks/useDeleteSubscriptionHandlers';

export function CourseDropdown() {
  const { courses, selectedCourse, openDropdown, isLoading } =
    useDeleteSubscriptionData();
  const { handleSelectCourse, toggleDropdown } =
    useDeleteSubscriptionHandlers();

  return (
    <div className='relative'>
      <label className='labelForm'>Course</label>
      <button
        type='button'
        onClick={() => toggleDropdown('course')}
        disabled={isLoading}
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
      >
        <span>{selectedCourse?.name || '-- Select Course --'}</span>
        <ChevronDown
          className={clsx('w-4 h-4', openDropdown === 'course' && 'rotate-180')}
        />
      </button>

      {openDropdown === 'course' && (
        <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {courses.map(course => (
            <li
              key={course.id}
              onClick={() => handleSelectCourse(course.id)}
              className='px-3 py-2 cursor-pointer hover:bg-primary/10 transition-colors'
            >
              {course.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
