'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React from 'react';
import { Student, DropdownType } from '../types';

interface Course {
  id: number;
  name: string;
}

interface StudyClass {
  id: number;
  classCode: string;
}

interface ComponentData {
  courses: Course[];
  studyClasses: StudyClass[];
  allStudents: Student[];
  filteredStudentsForDropdown: Student[];
  openDropdown: DropdownType;
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedStudentId: number | null;
  studentSearchTerm: string;
  isSubmitting: boolean;
  enrolledStudents: Student[];
}

interface ComponentHandlers {
  handleSelectCourse: (courseId: number) => void;
  handleSelectStudyClass: (studyClassId: number) => void;
  handleSelectStudent: (studentId: number) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    studentId: number | null,
    studyClassId: number | null,
  ) => Promise<void>;
  setStudentSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setOpenDropdown: React.Dispatch<React.SetStateAction<DropdownType>>;
}

type EnrollmentFormProps = {
  data: ComponentData;
  handlers: ComponentHandlers;
  error: { message: string } | null;
};

export function EnrollmentForm({ data, handlers, error }: EnrollmentFormProps) {
  const {
    courses,
    studyClasses,
    allStudents,
    filteredStudentsForDropdown,
    openDropdown,
    selectedCourseId,
    selectedStudyClassId,
    selectedStudentId,
    studentSearchTerm,
    isSubmitting,
    enrolledStudents,
  } = data;

  const {
    handleSelectCourse,
    handleSelectStudyClass,
    handleSelectStudent,
    handleSubmit,
    setStudentSearchTerm,
    setOpenDropdown,
  } = handlers;

  const selectedCourseName =
    courses.find((course: Course) => course.id === selectedCourseId)?.name ||
    '-- Select a course --';
  const selectedStudyClassName =
    studyClasses.find(
      (studyClass: StudyClass) => studyClass.id === selectedStudyClassId,
    )?.classCode || '-- Select a study class --';
  const selectedStudentName =
    allStudents.find((student: Student) => student.id === selectedStudentId)
      ?.name || '-- Select a student --';

  return (
    <form
      onSubmit={e => handleSubmit(e, selectedStudentId, selectedStudyClassId)}
      className='card p-6 space-y-4'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Course Dropdown */}
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
            disabled={isSubmitting}
            onClick={() =>
              setOpenDropdown(openDropdown === 'course' ? null : 'course')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
          >
            <span
              className={clsx(
                selectedCourseId
                  ? 'text-foreground'
                  : 'text-muted-foreground italic',
              )}
            >
              {selectedCourseName}
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
              {courses.map((course: Course) => (
                <li
                  key={course.id}
                  onClick={() => handleSelectCourse(course.id)}
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
        </div>

        {/* Study Class Dropdown */}
        <div className='relative'>
          <label
            htmlFor='studyclass-button'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Study Class
          </label>
          <button
            type='button'
            id='studyclass-button'
            disabled={!selectedCourseId || isSubmitting}
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'studyClass' ? null : 'studyClass',
              )
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
          >
            <span
              className={clsx(
                selectedStudyClassId
                  ? 'text-foreground'
                  : 'text-muted-foreground italic',
              )}
            >
              {selectedStudyClassName}
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
                studyClasses.map((studyClass: StudyClass) => (
                  <li
                    key={studyClass.id}
                    onClick={() => handleSelectStudyClass(studyClass.id)}
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
                  No classes for this course.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
        {/* Student Dropdown */}
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
            disabled={isSubmitting}
            onClick={() =>
              setOpenDropdown(openDropdown === 'student' ? null : 'student')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
          >
            <span
              className={clsx(
                selectedStudentId
                  ? 'text-foreground'
                  : 'text-muted-foreground italic',
              )}
            >
              {selectedStudentName}
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
                {filteredStudentsForDropdown.map((student: Student) => (
                  <li
                    key={student.id}
                    onClick={() => handleSelectStudent(student.id)}
                    className={clsx(
                      'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                      selectedStudentId === student.id
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {student.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Student Count */}
        <div className='text-sm text-muted-foreground'>
          <span className='font-medium text-foreground'>
            {isSubmitting ? '...' : enrolledStudents.length}
          </span>{' '}
          students enrolled in this class.
        </div>
      </div>

      {error && <p className='text-red-500 text-sm'>Error: {error.message}</p>}

      <button
        type='submit'
        className='btn btn-primary'
        disabled={!selectedStudentId || !selectedStudyClassId || isSubmitting}
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe Student to Study Class'}
      </button>
    </form>
  );
}
