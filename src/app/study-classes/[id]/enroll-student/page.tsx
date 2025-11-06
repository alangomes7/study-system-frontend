'use client';

import {
  useGetAllStudents,
  useGetStudyClass,
  useCreateSubscription,
} from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EnrollStudentPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id: studyClassId } = use(params);
  const router = useRouter();

  // --- Component State ---
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [openDropdown, setOpenDropdown] = useState<'student' | null>(null);

  // --- Data Fetching ---
  const {
    data: studyClass,
    isLoading: isLoadingClass,
    error: classError,
  } = useGetStudyClass(studyClassId);

  const {
    data: students = [],
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useGetAllStudents();

  const {
    mutate: createSubscription,
    isPending: isSubmitting,
    error: mutationError,
  } = useCreateSubscription();

  // --- Event Handlers ---

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudentId(studentId);
    setOpenDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    createSubscription(
      {
        studentId: selectedStudentId,
        studyClassId: studyClassId,
      },
      {
        onSuccess: () => {
          // On success, redirect back to the class details page
          router.push(`/study-classes/${studyClassId}`);
        },
      },
    );
  };

  // --- Derived State & Loading/Error Handling ---

  const selectedStudentName =
    students.find(s => s.id === selectedStudentId)?.name || 'Select a student';

  const isLoading = isLoadingStudents || isLoadingClass;
  const queryError = studentsError || classError;
  const error = queryError || mutationError;

  if (isLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading class and student data...
      </div>
    );
  }

  if (queryError && !isSubmitting) {
    return (
      <p className='text-center mt-8 text-red-500'>
        Error: {queryError.message}
      </p>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        Enroll Student in {studyClass?.classCode || 'Class'}
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
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
            onClick={() =>
              setOpenDropdown(openDropdown === 'student' ? null : 'student')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            disabled={isSubmitting}
          >
            <span
              className={
                selectedStudentId !== null
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
                  onClick={() => handleStudentSelect(student.id)}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedStudentId === student.id
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

        {error && (
          <p className='text-red-500 text-sm'>
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        )}

        <div className='flex items-center gap-4 pt-2'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting || !selectedStudentId}
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
          </button>

          <Link
            href={`/study-classes/${studyClassId}`}
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
