'use client';

import {
  useGetProfessors,
  useGetStudyClass,
  useEnrollProfessor,
} from '@/lib/api/api_query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EnrollProfessorPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // State for the form - changed to number | null
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(
    null,
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const {
    data: professors = [],
    isLoading: isLoadingProfessors,
    error: professorsError,
  } = useGetProfessors();

  const {
    data: studyClass,
    isLoading: isLoadingClass,
    error: classError,
  } = useGetStudyClass(id);

  const {
    mutate: enrollProfessor,
    isPending: isSubmitting,
    error: mutationError,
  } = useEnrollProfessor();

  // --- Event Handlers ---

  const handleProfessorSelect = (professorId: number) => {
    setSelectedProfessor(professorId);
    setOpenDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessor) return;

    enrollProfessor(
      {
        studyClassId: id,
        professorId: selectedProfessor,
      },
      {
        onSuccess: () => {
          router.push(`/study-classes/${id}`);
        },
      },
    );
  };

  // --- Derived State & Loading/Error Handling ---

  // Updated logic to find by number
  const selectedProfessorName =
    professors.find(p => p.id === selectedProfessor)?.name ||
    'Select a professor';

  const isLoading = isLoadingProfessors || isLoadingClass;
  const queryError = professorsError || classError;
  const error = queryError || mutationError;

  if (isLoading) {
    return <div className='text-center mt-8 text-foreground'>Loading...</div>;
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
        Enroll Professor in {studyClass?.classCode || 'Class'}
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div>
          <label
            htmlFor='professor-button'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Professor
          </label>
          <div className='relative'>
            <button
              type='button'
              id='professor-button'
              onClick={() =>
                setOpenDropdown(
                  openDropdown === 'professor' ? null : 'professor',
                )
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
              disabled={isSubmitting}
            >
              <span
                className={
                  selectedProfessor !== null
                    ? 'text-foreground'
                    : 'text-muted-foreground italic'
                }
              >
                {selectedProfessorName}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'professor'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>

            {openDropdown === 'professor' && (
              <ul className='absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
                {professors.map(professor => (
                  <li
                    key={professor.id}
                    // Pass professor.id (number) directly
                    onClick={() => handleProfessorSelect(professor.id)}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                      // Compare numbers
                      selectedProfessor === professor.id
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {professor.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
