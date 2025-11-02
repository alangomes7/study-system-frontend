'use client';

import { useState } from 'react';
import {
  useGetAllStudents,
  useGetAllStudyClasses,
  useCreateSubscription,
} from '@/lib/api_query';
import { ChevronDown } from 'lucide-react';

export default function EnrollStudentPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudyClass, setSelectedStudyClass] = useState<string>('');
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
      studentId: Number(selectedStudent),
      studyClassId: Number(selectedStudyClass),
    });
  };

  // --- Handlers for custom dropdowns ---
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setOpenDropdown(null);
  };

  const handleStudyClassSelect = (classId: string) => {
    setSelectedStudyClass(classId);
    setOpenDropdown(null);
  };

  // --- Display values for dropdowns ---
  const selectedStudentName =
    students.find(s => s.id === Number(selectedStudent))?.name ||
    'Select a student';

  const selectedStudyClassName =
    studyClasses.find(sc => sc.id === Number(selectedStudyClass))?.classCode ||
    'Select a study class';

  if (isLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading students and study classes...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Enroll Student
      </h1>
      {error && (
        <p className='text-center mb-4 text-red-500'>{error.message}</p>
      )}
      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        {/* Student Dropdown */}
        <div className='relative'>
          <label
            htmlFor='student-button'
            className='block text-foreground font-bold mb-2'
          >
            Student
          </label>
          <button
            type='button'
            id='student-button'
            onClick={() =>
              setOpenDropdown(openDropdown === 'student' ? null : 'student')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            disabled={isSubmitting}
            aria-required='true'
          >
            <span
              className={
                selectedStudent
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {selectedStudentName}
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
            <ul className='absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
              {students.map(student => (
                <li
                  key={student.id}
                  onClick={() => handleStudentSelect(String(student.id))}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedStudent === String(student.id)
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
          <label
            htmlFor='studyClass-button'
            className='block text-foreground font-bold mb-2'
          >
            Study Class
          </label>
          <button
            type='button'
            id='studyClass-button'
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'studyClass' ? null : 'studyClass',
              )
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            disabled={isSubmitting}
            aria-required='true'
          >
            <span
              className={
                selectedStudyClass
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {selectedStudyClassName}
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
            <ul className='absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
              {studyClasses.map(studyClass => (
                <li
                  key={studyClass.id}
                  onClick={() => handleStudyClassSelect(String(studyClass.id))}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedStudyClass === String(studyClass.id)
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

        <button
          type='submit'
          className='btn btn-primary disabled:opacity-50'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enrolling...' : 'Enroll'}
        </button>
      </form>
    </div>
  );
}
