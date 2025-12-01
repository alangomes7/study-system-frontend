'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useDeleteSubscriptionData } from '../hooks/useDeleteSubscriptionData';
import { useDeleteSubscriptionHandlers } from '../hooks/useDeleteSubscriptionHandlers';

export function StudyClassDropdown() {
  const {
    studyClasses,
    selectedClass,
    selectedCourseId,
    openDropdown,
    isLoading,
  } = useDeleteSubscriptionData();
  const { handleSelectClass, toggleDropdown } = useDeleteSubscriptionHandlers();

  const isDisabled = !selectedCourseId || isLoading;

  return (
    <div className='relative'>
      <label className='labelForm'>Study Class</label>
      <button
        type='button'
        onClick={() => toggleDropdown('class')}
        disabled={isDisabled}
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span>{selectedClass?.classCode || '-- Select Class --'}</span>
        <ChevronDown
          className={clsx('w-4 h-4', openDropdown === 'class' && 'rotate-180')}
        />
      </button>

      {openDropdown === 'class' && (
        <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {studyClasses.length > 0 ? (
            studyClasses.map(sc => (
              <li
                key={sc.id}
                onClick={() => handleSelectClass(sc.id)}
                className='px-3 py-2 cursor-pointer hover:bg-primary/10 transition-colors'
              >
                {sc.classCode} ({sc.year}/{sc.semester})
              </li>
            ))
          ) : (
            <li className='px-3 py-2 text-muted-foreground italic'>
              No classes found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
