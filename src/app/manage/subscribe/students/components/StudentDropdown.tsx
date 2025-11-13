'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useGetAllStudents, useGetStudentsByStudyClass } from '@/hooks';
import { SpinLoader } from '@/components';
import { useSubscribeFormStore } from '@/stores';

export function StudentDropdown() {
  const {
    selectedStudyClassId,
    selectedStudentId,
    openDropdown,
    studentSearchTerm,
    isSubmitting,
    selectStudent,
    setDropdown,
    setStudentSearchTerm,
  } = useSubscribeFormStore();

  const {
    data: allStudents = [],
    isLoading: isLoadingAll,
    error: allStudentsError,
  } = useGetAllStudents();
  const { data: enrolledStudents = [], isLoading: isLoadingEnrolled } =
    useGetStudentsByStudyClass(selectedStudyClassId);

  const enrolledStudentIds = useMemo(
    () => new Set(enrolledStudents.map(s => s.id)),
    [enrolledStudents],
  );

  const filteredStudentsForDropdown = useMemo(
    () =>
      allStudents.filter(
        student =>
          !enrolledStudentIds.has(student.id) &&
          student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
      ),
    [allStudents, studentSearchTerm, enrolledStudentIds],
  );

  const selectedStudentName =
    allStudents.find(student => student.id === selectedStudentId)?.name ||
    '-- Select a student --';

  const isDisabled =
    isSubmitting || !selectedStudyClassId || isLoadingAll || isLoadingEnrolled;

  return (
    <div className='relative'>
      <label
        htmlFor='student-button'
        className='block text-sm font-medium text-foreground/80 mb-1'
      >
        Student
      </label>
      <button
        type='button'
        id='student-button'
        disabled={isDisabled}
        onClick={() =>
          setDropdown(openDropdown === 'student' ? null : 'student')
        }
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span
          className={clsx(
            selectedStudentId
              ? 'text-foreground'
              : 'text-muted-foreground italic',
            'flex items-center',
          )}
        >
          {isLoadingAll || isLoadingEnrolled ? (
            <SpinLoader className='w-4 h-4 mr-2' />
          ) : (
            selectedStudentName
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            openDropdown === 'student'
              ? 'rotate-180 text-primary'
              : 'text-muted-foreground',
          )}
        />
      </button>

      {openDropdown === 'student' && (
        <div className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg'>
          <input
            type='text'
            placeholder='Search students...'
            className='input w-full rounded-b-none border-x-0 border-t-0'
            value={studentSearchTerm}
            onChange={e => setStudentSearchTerm(e.target.value)}
          />
          <ul className='max-h-60 overflow-y-auto'>
            {filteredStudentsForDropdown.length > 0 ? (
              filteredStudentsForDropdown.map(student => (
                <li
                  key={student.id}
                  onClick={() => selectStudent(student.id)}
                  className={clsx(
                    'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                    selectedStudentId === student.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground',
                  )}
                >
                  {student.name}
                </li>
              ))
            ) : (
              <li className='px-3 py-2 text-muted-foreground italic'>
                {isLoadingAll
                  ? 'Loading...'
                  : 'No students found or all are enrolled.'}
              </li>
            )}
          </ul>
        </div>
      )}
      {allStudentsError && (
        <p className='text-red-500 text-sm mt-1'>{allStudentsError.message}</p>
      )}
    </div>
  );
}
