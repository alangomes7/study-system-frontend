'use client';

import { UserForm, SpinLoader } from '@/components';
import { useGetStudent } from '@/hooks';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function EditStudentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = use(params);
  const studentId = Number(id);

  const { data: student, isLoading, error } = useGetStudent(studentId);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-red-500'>Error: {error.message}</p>
        <button
          onClick={() => router.back()}
          className='btn border border-border hover:bg-foreground/5 mt-4'
        >
          Back
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-foreground/80'>Student not found.</p>
        <button
          onClick={() => router.back()}
          className='btn border border-border hover:bg-foreground/5 mt-4'
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <UserForm
      userType='student'
      title='Edit Student'
      user={student}
      submitLabel='Update Student'
    />
  );
}
