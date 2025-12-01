'use client';

import { UserForm, SpinLoaderAnimation } from '@/components';
import { useGetStudent } from '@/hooks';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const studentId = Number(id);

  const { data: student, isLoading, error } = useGetStudent(studentId);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoaderAnimation
          className={clsx('flex h-60 items-center justify-center')}
        />
      </div>
    );
  }

  if (error) {
    throw new Error(error.message);
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
      userType='Student'
      title='Edit Student'
      user={student}
      submitLabel={`Update Student ${student.name}`}
    />
  );
}
