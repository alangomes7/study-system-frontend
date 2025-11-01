'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  useGetAllStudents,
  useGetStudyClass,
  useCreateSubscription,
} from '@/lib/api_query';

export default function EnrollStudentPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const {
    data: students = [],
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useGetAllStudents();
  const {
    data: studyClass,
    isLoading: isLoadingClass,
    error: classError,
  } = useGetStudyClass(id);

  const {
    mutate: createSubscription,
    isPending: isSubmitting,
    error: submissionError,
  } = useCreateSubscription();

  const isLoading = isLoadingStudents || isLoadingClass;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    createSubscription({
      studyClassId: id,
      studentId: Number(selectedStudent),
    });
  };

  if (isLoading) {
    return <div className='text-center mt-8 text-foreground'>Loading...</div>;
  }

  const queryError = studentsError || classError;
  if (queryError) {
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
        <div className='mb-4'>
          <label
            htmlFor='student'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Student
          </label>
          <select
            id='student'
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className='input'
            disabled={isSubmitting}
            required
          >
            <option value='' disabled>
              Select a student
            </option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submission error - Use type-safe check */}
        {submissionError && (
          <p className='text-red-500 text-sm'>
            {submissionError instanceof Error
              ? submissionError.message
              : 'An unknown error occurred.'}
          </p>
        )}

        <div className='flex items-center gap-4'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll'}
          </button>

          <Link
            href={`/study-classes/${id}`}
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
