'use client';

import { SpinLoaderAnimation } from '@/components';
import { useGetCourses } from '@/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function CoursesClientPage() {
  const { data: courses = [], isLoading, error } = useGetCourses();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(
    () =>
      courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, courses],
  );

  if (isLoading) {
    return (
      <SpinLoaderAnimation
        className={clsx('flex h-60 items-center justify-center')}
      />
    );
  }

  if (error) {
    throw new Error(error.message || 'Failed to fetch courses');
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Search Bar */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
        <h1 className='text-3xl font-bold text-foreground'>Courses</h1>
        <input
          type='text'
          id='course-search'
          name='course-search'
          placeholder='Search by course name...'
          className={clsx('input w-full md:w-1/3', 'input-search')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
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
