'use client';

import { useGetStudent } from '@/hooks';
import Link from 'next/link';
import { use } from 'react';

export default function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id: studentId } = use(params);

  const { data: student, isLoading, error } = useGetStudent(studentId);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Loading student details...
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center mt-8 text-red-500'>Error: {error.message}</p>
    );
  }

  if (!student) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Student not found.
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='flex justify-end mb-4'>
        <Link
          href='/students'
          className='btn border border-border hover:bg-foreground/5'
        >
          Back to List
        </Link>
      </div>

      <div className='card p-6'>
        <h1 className='text-3xl font-bold mb-4 text-foreground'>
          {student.name}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
          <p className='text-foreground'>
            <strong>Email:</strong> {student.email}
          </p>
          <p className='text-foreground'>
            <strong>CPF:</strong> {student.register}
          </p>
          <p className='text-foreground'>
            <strong>Phone Number:</strong> {student.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
