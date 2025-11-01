'use client';

import React, { useState, useMemo } from 'react';
import {
  useGetAllStudyClasses,
  useGetStudentsByStudyClass,
} from '@/lib/api_query';
import clsx from 'clsx';
import { useStudentGroup } from '@/hooks/useStudents';

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

  // Hook into our local storage manager, passing the classCode
  const { addStudent, removeStudent, isStudentInGroup } = useStudentGroup(
    selectedClass?.classCode || null,
  );

  // --- Render Functions ---

  const renderClassSelector = () => {
    if (isClassesLoading) return <p>Loading classes...</p>;
    if (classesError) {
      return (
        <p className='text-error'>
          Error loading classes: {classesError.message}
        </p>
      );
    }

    return (
      <div className='mb-4'>
        <label
          htmlFor='class-select'
          className='block text-sm font-medium text-muted-foreground mb-1'
        >
          Study Class
        </label>
        <select
          id='class-select'
          className='input max-w-xs'
          value={selectedClassId || ''}
          onChange={e => setSelectedClassId(Number(e.target.value) || null)}
        >
          <option value=''>-- Select a class --</option>
          {classes.map(studyClass => (
            <option key={studyClass.id} value={studyClass.id}>
              {studyClass.classCode} - {studyClass.courseName}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderStudentTable = () => {
    if (!selectedClassId) {
      return (
        <p className='text-muted-foreground'>
          Please select a class to see students.
        </p>
      );
    }

    if (isStudentsLoading) {
      return <p>Loading students...</p>;
    }

    if (studentsError) {
      return (
        <p className='text-error'>
          Error loading students: {studentsError.message}
        </p>
      );
    }

    if (!students || students.length === 0) {
      return <p>No students found for this class.</p>;
    }

    return (
      <div className='overflow-x-auto'>
        <table>
          <thead>
            <tr>
              <th className='text-left'>ID</th>
              <th className='text-left'>Name</th>
              <th className='text-left'>Email</th>
              <th className='text-center'>Group</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const inGroup = isStudentInGroup(student.id);
              return (
                <tr key={student.id}>
                  <td className='text-left'>{student.id}</td>
                  <td className='text-left'>{student.name}</td>
                  <td className='text-left'>{student.email}</td>
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
