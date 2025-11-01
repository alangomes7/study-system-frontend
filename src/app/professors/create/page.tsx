'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateProfessor } from '@/lib/api_query';
import Link from 'next/link';

export default function CreateProfessorPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const {
    mutate: createProfessor,
    isPending: isSubmitting,
    error,
  } = useCreateProfessor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createProfessor(name);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        Create Professor
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='input'
            disabled={isSubmitting}
            required
          />
        </div>

        {/* 5. Display the error from the hook */}
        {error && <p className='text-red-500 text-sm'>{error.message}</p>}

        <div className='flex items-center gap-4 pt-2'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>

          <Link
            href='/professors'
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
