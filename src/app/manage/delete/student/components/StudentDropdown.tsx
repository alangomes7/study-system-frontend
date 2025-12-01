'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useDeleteStudentData } from '../hooks/useDeleteStudentData';
import { useDeleteStudentHandlers } from '../hooks/useDeleteStudentHandlers';
import { DotsAnimation } from '@/components';

export function StudentDropdown() {
  const {
    filteredStudents,
    selectedStudent,
    searchTerm,
    isDropdownOpen,
    isLoading,
  } = useDeleteStudentData();
  const { handleSelect, toggleDropdown, handleSearch } =
    useDeleteStudentHandlers();

  return (
    <div className='relative'>
      <label className='labelForm'>Select Student to Delete</label>
      <button
        type='button'
        onClick={toggleDropdown}
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
      >
        <span
          className={clsx(
            selectedStudent
              ? 'text-foreground'
              : 'text-muted-foreground italic',
          )}
        >
          {isLoading ? (
            <DotsAnimation className='w-4 h-4' />
          ) : (
            selectedStudent?.name || '-- Select Student --'
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform',
            isDropdownOpen && 'rotate-180 text-primary',
          )}
        />
      </button>

      {isDropdownOpen && (
        <div className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg'>
          <input
            type='text'
            placeholder='Search student...'
            className='input w-full rounded-b-none border-x-0 border-t-0'
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          <ul className='max-h-60 overflow-y-auto'>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <li
                  key={student.id}
                  onClick={() => handleSelect(student.id)}
                  className='px-3 py-2 cursor-pointer hover:bg-error/10 hover:text-error transition-colors'
                >
                  {student.name}
                </li>
              ))
            ) : (
              <li className='px-3 py-2 text-muted-foreground italic'>
                No students found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
