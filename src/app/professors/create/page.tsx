'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProfessor } from '@/lib/api';

export default function CreateProfessorPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createProfessor(name);

      router.push('/professors');
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
      <h1 className='text-3xl font-bold mb-6'>Create Professor</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='border rounded-lg p-2 w-full'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          Create
        </button>
      </form>
    </div>
  );
}
