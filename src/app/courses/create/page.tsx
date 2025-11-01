'use client';

import { useCreateCourse } from '@/lib/api_query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCoursePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const createCourseMutation = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          router.push('/courses');
        },
      },
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>Create Course</h1>

      {createCourseMutation.error && (
        <p className='text-red-500 mb-4'>
          {createCourseMutation.error.message}
        </p>
      )}

      <form onSubmit={handleSubmit} className='card p-6'>
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-foreground font-bold mb-2'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='input'
            required
            disabled={createCourseMutation.isPending}
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-foreground font-bold mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='input min-h-[100px]'
            required
            disabled={createCourseMutation.isPending}
          />
        </div>

        <button
          type='submit'
          className='btn btn-primary'
          disabled={createCourseMutation.isPending}
        >
          {createCourseMutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
