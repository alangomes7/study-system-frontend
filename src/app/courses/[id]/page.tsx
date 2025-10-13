'use client';

import { useEffect, useState, use } from 'react';
import { Course } from '@/types/course';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`http://localhost:8080/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  if (loading) {
    return <p className='text-center mt-8'>Loading...</p>;
  }

  if (error) {
    return <p className='text-center mt-8 text-red-500'>Error: {error}</p>;
  }

  if (!course) {
    return <p className='text-center mt-8'>Course not found.</p>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-2'>{course.name}</h1>
      <p className='text-lg text-gray-600 dark:text-gray-400 mb-6'>
        {course.description}
      </p>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>Study Class</th>
              <th className='py-2 px-4 border-b'>Students</th>
              <th className='py-2 px-4 border-b'>Professors</th>
            </tr>
          </thead>
          <tbody>
            {course.studyClasses &&
              course.studyClasses.map(studyClass => (
                <tr key={studyClass.id}>
                  <td className='py-2 px-4 border-b text-center'>
                    {studyClass.code}
                  </td>
                  <td className='py-2 px-4 border-b text-center'>
                    {studyClass.students}
                  </td>
                  <td className='py-2 px-4 border-b text-center'>
                    {studyClass.professors}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
