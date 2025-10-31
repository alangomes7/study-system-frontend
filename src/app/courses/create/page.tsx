'use client';

import { createCourse } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCoursePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createCourse({ name, description });
      router.push('/courses');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>Create Course</h1>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

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
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Create
        </button>
      </form>
    </div>
  );
}
