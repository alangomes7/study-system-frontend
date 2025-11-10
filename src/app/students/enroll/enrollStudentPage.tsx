'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  useGetAllStudents,
  useGetAllStudyClasses,
  useCreateSubscription,
} from '@/hooks';

export default function EnrollStudentPage() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedStudyClass, setSelectedStudyClass] = useState<number | null>(
    null,
  );
  const [openDropdown, setOpenDropdown] = useState<
    'student' | 'studyClass' | null
  >(null);

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
        Loading students and study classes...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        Enroll Student
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        {/* Student Dropdown */}
        <div className='relative'>
          <label className='block text-sm font-medium text-foreground/80 mb-1'>
            Student
          </label>
          <button
            type='button'
            onClick={() => {
              setOpenDropdown(openDropdown === 'student' ? null : 'student');
            }}
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            disabled={isSubmitting}
          >
            <span
              className={
                selectedStudent
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {selectedStudent
                ? students.find(s => s.id === selectedStudent)?.name
                : '-- Select a student --'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === 'student'
                  ? 'rotate-180 text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
          {openDropdown === 'student' && (
            <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto'>
              {students.map(student => (
                <li
                  key={student.id}
                  onClick={studyClasses => {
                    setSelectedStudent(student.id);
                    setOpenDropdown(null);
                    console.log(studyClasses);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedStudent === student.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {student.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Study Class Dropdown */}
        <div className='relative'>
          <label className='block text-sm font-medium text-foreground/80 mb-1'>
            Study Class
          </label>
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'studyClass' ? null : 'studyClass',
              )
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            disabled={isSubmitting}
          >
            <span
              className={
                selectedStudyClass
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {selectedStudyClass
                ? studyClasses.find(sc => sc.id === selectedStudyClass)
                    ?.classCode
                : '-- Select a study class --'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === 'studyClass'
                  ? 'rotate-180 text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>

          {openDropdown === 'studyClass' && (
            <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto'>
              {studyClasses.map(studyClass => (
                <li
                  key={studyClass.id}
                  onClick={() => {
                    setSelectedStudyClass(studyClass.id);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedStudyClass === studyClass.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {studyClass.classCode}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className='text-red-500 text-sm'>{error.message}</p>}

        {/* Submit Button */}
        <div className='pt-2'>
          <button
            type='submit'
            className='btn btn-primary disabled:opacity-50'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
