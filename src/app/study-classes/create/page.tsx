'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useGetCourses,
  useGetProfessors,
  useCreateStudyClass,
} from '@/lib/api_query';

export default function CreateStudyClassPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>('');
  const [professorId, setProfessorId] = useState<string>('');

  const { data: courses = [], isLoading: isLoadingCourses } = useGetCourses();
  const { data: professors = [], isLoading: isLoadingProfessors } =
    useGetProfessors();

  const {
    mutate: createStudyClass,
    isPending: isSubmitting,
    error,
  } = useCreateStudyClass();

  const isLoading = isLoadingCourses || isLoadingProfessors;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    createStudyClass({
      year,
      semester,
      courseId: Number(courseId),
      professorId: professorId ? Number(professorId) : null, // Handle optional prof.
    });
  };

  if (isLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading courses and professors...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        Create Study Class
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='year'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Year
            </label>
            <input
              type='number'
              id='year'
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className='input'
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label
              htmlFor='semester'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Semester
            </label>
            <input
              type='number'
              id='semester'
              value={semester}
              onChange={e => setSemester(Number(e.target.value))}
              className='input'
              disabled={isSubmitting}
              required
              min='1'
              max='2'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='course'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Course
          </label>
          <select
            id='course'
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className='input'
            disabled={isSubmitting}
            required
          >
            <option value='' disabled>
              Select a course
            </option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='professor'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Professor (Optional)
          </label>
          <select
            id='professor'
            value={professorId}
            onChange={e => setProfessorId(e.target.value)}
            className='input'
            disabled={isSubmitting}
          >
            <option value=''>Not Assigned</option>
            {professors.map(professor => (
              <option key={professor.id} value={professor.id}>
                {professor.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className='text-red-500 text-sm'>{error.message}</p>}

        <div className='flex items-center gap-4 pt-2'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Class'}
          </button>
          <Link
            href='/study-classes'
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
