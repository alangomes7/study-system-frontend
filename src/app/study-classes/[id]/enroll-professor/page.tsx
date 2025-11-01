'use client';

import { useEnrollProfessor } from '@/hooks/useStudyClasses';
import Link from 'next/link';
import { use } from 'react';

export default function EnrollProfessorPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);

  const {
    professors,
    studyClass,
    selectedProfessor,
    setSelectedProfessor,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  } = useEnrollProfessor(id);

  if (isLoading) {
    return <div className='text-center mt-8 text-foreground'>Loading...</div>;
  }

  if (error && !isSubmitting) {
    return <p className='text-center mt-8 text-red-500'>Error: {error}</p>;
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        Enroll Professor in {studyClass?.classCode || 'Class'}
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div className='mb-4'>
          <label
            htmlFor='professor'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Professor
          </label>
          <select
            id='professor'
            value={selectedProfessor}
            onChange={e => setSelectedProfessor(e.target.value)}
            className='input'
            required
          >
            <option value='' disabled>
              Select a professor
            </option>
            {professors.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

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
