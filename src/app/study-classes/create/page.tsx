'use client';

import { Course } from '@/types/course';
import { Professor } from '@/types/professor';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function getCourses(): Promise<Course[]> {
  const response = await fetch('http://localhost:8080/courses', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

async function getProfessors(): Promise<Professor[]> {
  const response = await fetch('http://localhost:8080/professors', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch professors');
  }
  return response.json();
}

export default function CreateStudyClassPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [classCode, setClassCode] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>('');
  const [professorId, setProfessorId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, professorsData] = await Promise.all([
          getCourses(),
          getProfessors(),
        ]);
        setCourses(coursesData);
        setProfessors(professorsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/study-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classCode,
          year,
          semester,
          courseId,
          professorId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create study class');
      }
      router.push('/study-classes');
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
      <h1 className='text-3xl font-bold mb-6'>Create Study Class</h1>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        <div className='mb-4'>
          <label
            htmlFor='classCode'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Class Code
          </label>
          <input
            type='text'
            id='classCode'
            value={classCode}
            onChange={e => setClassCode(e.target.value)}
            className='border rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='year'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Year
          </label>
          <input
            type='number'
            id='year'
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className='border rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='semester'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Semester
          </label>
          <input
            type='number'
            id='semester'
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
            className='border rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='course'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Course
          </label>
          <select
            id='course'
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className='border rounded-lg p-2 w-full bg-white dark:bg-gray-700'
          >
            <option value=''>Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label
            htmlFor='professor'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Professor
          </label>
          <select
            id='professor'
            value={professorId}
            onChange={e => setProfessorId(e.target.value)}
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
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          Create
        </button>
      </form>
    </div>
  );
}
