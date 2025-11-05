'use client';

import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import {
  useStudentGroup,
  useGetAllStudyClasses,
  useGetStudentsByStudyClass,
} from '@/hooks';

export default function StudentGroupPage() {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const {
    data: classes = [],
    isLoading: isClassesLoading,
    error: classesError,
  } = useGetAllStudyClasses();

  const selectedClass = useMemo(
    () => classes.find(c => c.id === selectedClassId) || null,
    [classes, selectedClassId],
  );

  const {
    data: students = [],
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useGetStudentsByStudyClass(selectedClassId);

  const { addStudent, removeStudent, isStudentInGroup } = useStudentGroup(
    selectedClass?.classCode || null,
  );

  // ──────────────────────── Class Selector ────────────────────────
  const renderClassSelector = () => {
    if (isClassesLoading) return <p>Loading classes...</p>;
    if (classesError)
      return (
        <p className='text-error'>
          Error loading classes: {classesError.message}
        </p>
      );

    return (
      <div className='mb-4 relative'>
        <label
          htmlFor='class-select'
          className='block text-sm font-medium text-muted-foreground mb-1'
        >
          Study Class
        </label>

        {/* Custom Dropdown Trigger */}
        <button
          id='class-select'
          type='button'
          onClick={() => setDropdownOpen(prev => !prev)}
          className='w-full max-w-xs bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
        >
          <span
            className={
              selectedClass ? 'text-foreground' : 'text-muted-foreground italic'
            }
          >
            {selectedClass
              ? `${selectedClass.classCode} - ${selectedClass.courseName}`
              : '-- Select a class --'}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* Dropdown Drawer */}
        {dropdownOpen && (
          <ul className='absolute z-20 mt-1 w-full max-w-xs bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
            {classes.map(studyClass => (
              <li
                key={studyClass.id}
                onClick={() => {
                  setSelectedClassId(studyClass.id);
                  setDropdownOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                  selectedClassId === studyClass.id
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                {studyClass.classCode} - {studyClass.courseName}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // ──────────────────────── Student Table ────────────────────────
  const renderStudentTable = () => {
    if (!selectedClassId)
      return (
        <p className='text-muted-foreground'>
          Please select a class to see students.
        </p>
      );

    if (isStudentsLoading) return <p>Loading students...</p>;

    if (studentsError)
      return (
        <p className='text-error'>
          Error loading students: {studentsError.message}
        </p>
      );

    if (!students?.length) return <p>No students found for this class.</p>;

    return (
      <div className='overflow-x-auto'>
        <table>
          <thead>
            <tr>
              <th className='text-center'>ID</th>
              <th className='text-center'>Name</th>
              <th className='text-center'>Email</th>
              <th className='text-center'>Group</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const inGroup = isStudentInGroup(student.id);
              return (
                <tr key={student.id}>
                  <td className='text-center'>{student.id}</td>
                  <td className='text-center'>{student.name}</td>
                  <td className='text-center'>{student.email}</td>
                  <td className='text-center'>
                    <button
                      className={clsx(
                        'btn text-xs py-1 px-3',
                        inGroup
                          ? 'bg-error text-white hover:bg-error/80'
                          : 'btn-primary',
                      )}
                      onClick={() =>
                        inGroup
                          ? removeStudent(student.id)
                          : addStudent(student.id)
                      }
                    >
                      {inGroup ? 'Remove' : 'Add'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ──────────────────────── Render Page ────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='card'>
        <h1 className='text-2xl font-semibold text-foreground mb-4'>
          Student Group Manager
        </h1>
        {renderClassSelector()}
        <hr className='my-4' />
        {renderStudentTable()}
      </div>
    </div>
  );
}
