'use client';

import { SpinLoader } from '@/components';
import { useGetProfessor } from '@/hooks';
import Link from 'next/link';
import { use } from 'react';

export default function ProfessorDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id: professorId } = use(params);

  const { data: professor, isLoading, error } = useGetProfessor(professorId);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoader />
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center mt-8 text-red-500'>Error: {error.message}</p>
    );
  }

  if (!professor) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Professor not found.
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='flex justify-end mb-4 gap-2'>
        <Link
          href={`/manage/update/professor/${professorId}`}
          className='btn border border-border hover:bg-foreground/5'
        >
          Update
        </Link>
        <Link
          href='/professors'
          className='btn border border-border hover:bg-foreground/5'
        >
          Back to List
        </Link>
      </div>

      <div className='card p-6'>
        <h1 className='text-3xl font-bold mb-4 text-foreground'>
          {professor.name}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
          <p className='text-foreground'>
            <strong>Email:</strong> {professor.email}
          </p>
          <p className='text-foreground'>
            <strong>CPF:</strong> {professor.register}
          </p>
          <p className='text-foreground'>
            <strong>Phone Number:</strong> {professor.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
