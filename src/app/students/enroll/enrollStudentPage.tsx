'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  useGetAllStudents,
  useGetAllStudyClasses,
  useCreateSubscription,
} from '@/hooks';
import { SpinLoader } from '@/components';
import clsx from 'clsx';

export default function EnrollStudentPage() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStudyClass, setSelectedStudyClass] = useState<number | null>(
    null,
  );
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  const { data: students = [], isLoading: isLoadingStudents } =
    useGetAllStudents();
  const { data: studyClasses = [], isLoading: isLoadingStudyClasses } =
    useGetAllStudyClasses();

  const {
    mutate: createSubscription,
    isPending: isSubmitting,
    error,
  } = useCreateSubscription();

  const isLoading = isLoadingStudents || isLoadingStudyClasses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStudyClass) return;
    createSubscription({
      studentId: selectedStudent,
      studyClassId: selectedStudyClass,
    });
  };

  if (isLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        <SpinLoader />
      </div>
    );
  }

  const selectedStudentObj = students.find(s => s.id === selectedStudent);
  const selectedClassObj = studyClasses.find(c => c.id === selectedStudyClass);

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='card p-6 bg-card-background border border-border rounded-xl shadow-md'>
        <h1 className='text-2xl md:text-3xl font-semibold mb-6 text-foreground'>
          Enroll Student
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* ─────── Student Selector ─────── */}
          <div className='relative'>
            <label
              htmlFor='student-select'
              className='block text-sm font-medium text-muted-foreground mb-1'
            >
              Student
            </label>

            <button
              id='student-select'
              type='button'
              disabled={isSubmitting}
              onClick={() => {
                setStudentDropdownOpen(prev => !prev);
                setClassDropdownOpen(false);
              }}
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span
                className={
                  selectedStudentObj
                    ? 'text-foreground'
                    : 'text-muted-foreground italic'
                }
              >
                {selectedStudentObj
                  ? `${selectedStudentObj.name}`
                  : '-- Select a student --'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  studentDropdownOpen
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>

            {studentDropdownOpen && (
              <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto'>
                {students.map(student => (
                  <li
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setStudentDropdownOpen(false);
                    }}
                    className={clsx(
                      'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                      selectedStudent === student.id
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {student.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ─────── Study Class Selector ─────── */}
          <div className='relative'>
            <label
              htmlFor='study-class-select'
              className='block text-sm font-medium text-muted-foreground mb-1'
            >
              Study Class
            </label>

            <button
              id='study-class-select'
              type='button'
              disabled={isSubmitting}
              onClick={() => {
                setClassDropdownOpen(prev => !prev);
                setStudentDropdownOpen(false);
              }}
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span
                className={
                  selectedClassObj
                    ? 'text-foreground'
                    : 'text-muted-foreground italic'
                }
              >
                {selectedClassObj
                  ? `${selectedClassObj.classCode} - ${selectedClassObj.courseName}`
                  : '-- Select a study class --'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  classDropdownOpen
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>

            {classDropdownOpen && (
              <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto'>
                {studyClasses.map(studyClass => (
                  <li
                    key={studyClass.id}
                    onClick={() => {
                      setSelectedStudyClass(studyClass.id);
                      setClassDropdownOpen(false);
                    }}
                    className={clsx(
                      'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                      selectedStudyClass === studyClass.id
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {studyClass.classCode} - {studyClass.courseName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ─────── Error Message ─────── */}
          {error && (
            <p className='text-error text-sm' role='alert'>
              {error.message}
            </p>
          )}

          {/* ─────── Submit Button ─────── */}
          <div className='pt-2'>
            <button
              type='submit'
              className='btn btn-primary w-full disabled:opacity-50'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
