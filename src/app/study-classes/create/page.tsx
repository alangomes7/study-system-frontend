'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  useGetCourses,
  useGetProfessors,
  useCreateStudyClass,
} from '@/lib/api/api_query';

export default function CreateStudyClassPage() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(1);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [professorId, setProfessorId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<
    'course' | 'professor' | null
  >(null);

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
      courseId,
      professorId,
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
        {/* Year & Semester */}
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

        {/* Course Dropdown */}
        <div className='relative'>
          <label className='block text-sm font-medium text-foreground/80 mb-1'>
            Course
          </label>
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(openDropdown === 'course' ? null : 'course')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
          >
            <span
              className={
                courseId ? 'text-foreground' : 'text-muted-foreground italic'
              }
            >
              {courseId
                ? courses.find(c => c.id === courseId)?.name
                : '-- Select a course --'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === 'course'
                  ? 'rotate-180 text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>

          {openDropdown === 'course' && (
            <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
              {courses.map(course => (
                <li
                  key={course.id}
                  onClick={() => {
                    setCourseId(course.id);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    courseId === course.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {course.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Professor Dropdown */}
        <div className='relative'>
          <label className='block text-sm font-medium text-foreground/80 mb-1'>
            Professor (Optional)
          </label>
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(openDropdown === 'professor' ? null : 'professor')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
          >
            <span
              className={
                professorId ? 'text-foreground' : 'text-muted-foreground italic'
              }
            >
              {professorId
                ? professors.find(p => p.id === professorId)?.name
                : 'Not Assigned'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === 'professor'
                  ? 'rotate-180 text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>

          {openDropdown === 'professor' && (
            <ul className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
              <li
                onClick={() => {
                  setProfessorId(null);
                  setOpenDropdown(null);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                  !professorId
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-foreground'
                }`}
              >
                Not Assigned
              </li>

              {professors.map(professor => (
                <li
                  key={professor.id}
                  onClick={() => {
                    setProfessorId(professor.id);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    professorId === professor.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {professor.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className='text-red-500 text-sm'>{error.message}</p>}

        {/* Buttons */}
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
