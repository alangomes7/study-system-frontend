'use client';

import { useGetCourses } from '@/hooks';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function CoursesPage() {
  const { data: courses = [], isLoading, error } = useGetCourses();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, courses]);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center mt-8 text-red-500'>Error: {error.message}</p>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
        <h1 className='text-3xl font-bold text-foreground'>Courses</h1>
        <input
          type='text'
          placeholder='Search by course name...'
          className='input w-full md:w-1/3'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredCourses.map(course => (
          <Link
            href={`/courses/${course.id}`}
            key={course.id}
            className='card block'
          >
            <h2 className='text-xl font-semibold mb-2 text-foreground'>
              {course.name}
            </h2>
            <p className='text-foreground/80'>{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
