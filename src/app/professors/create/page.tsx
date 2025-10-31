'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProfessor } from '@/lib/api';
import Link from 'next/link';

export default function CreateProfessorPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createProfessor(name);
      router.push('/professors');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      {/* --- THEME CSS: Updated text --- */}
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
          {/* --- THEME CSS: Use 'input' class --- */}
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='input'
            disabled={isSubmitting} // <-- Added
            required
          />
        </div>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        {/* --- THEME CSS: Button container --- */}
        <div className='flex items-center gap-4 pt-2'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting} // <-- Added
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
