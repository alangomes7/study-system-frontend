'use client';

import { UserForm, SpinLoaderAnimation } from '@/components';
import { useGetProfessor } from '@/hooks';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function UpdateProfessorClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const professorId = Number(id);

  const { data: professor, isLoading, error } = useGetProfessor(professorId);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoaderAnimation />
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

  if (!professor) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-foreground/80'>Professor not found.</p>
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
      userType='Professor'
      title='Edit Professor'
      user={professor}
      submitLabel={`Update Professor ${professor.name}`}
    />
  );
}
