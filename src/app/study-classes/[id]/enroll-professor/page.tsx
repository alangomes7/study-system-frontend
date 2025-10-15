'use client';

import { Professor } from '@/types/professor';
import { StudyClass } from '@/types/study-class';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

async function getProfessors(): Promise<Professor[]> {
  const response = await fetch('http://localhost:8080/professors', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch professors');
  }
  return response.json();
}

async function getStudyClass(id: string): Promise<StudyClass> {
  const response = await fetch(`http://localhost:8080/study-classes/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch study class details');
  }
  return response.json();
}

export default function EnrollProfessorPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = use(params);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [studyClass, setStudyClass] = useState<StudyClass | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [professorsData, studyClassData] = await Promise.all([
          getProfessors(),
          getStudyClass(id),
        ]);
        setProfessors(professorsData);
        setStudyClass(studyClassData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/study-classes/${id}/enroll-professor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            professorId: selectedProfessor,
          }),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to enroll professor');
      }
      router.push(`/study-classes/${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (error) {
    return <p className='text-center mt-8 text-red-500'>Error: {error}</p>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>
        Enroll Professor in {studyClass?.classCode}
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        <div className='mb-4'>
          <label
            htmlFor='professor'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Professor
          </label>
          <select
            id='professor'
            value={selectedProfessor}
            onChange={e => setSelectedProfessor(e.target.value)}
            className='border rounded-lg p-2 w-full bg-white dark:bg-gray-700'
          >
            <option value=''>Select a professor</option>
            {professors.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
        >
          Enroll
        </button>
      </form>
    </div>
  );
}
