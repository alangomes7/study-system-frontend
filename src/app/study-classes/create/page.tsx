'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useStudyClassForm } from '@/hooks';

export default function CreateStudyClassPage() {
  const {
    formData,
    setFormField,
    errors,
    isSubmitting,
    apiError,
    isLoading,
    courses,
    professors,
    openDropdown,
    setOpenDropdown,
    availableYears,
    availableSemesters,
    handleSubmit,
  } = useStudyClassForm();

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
        {/* Year & Semester Dropdowns */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Year Dropdown */}
          <div className='relative'>
            <label className='block text-sm font-medium text-foreground/80 mb-1'>
              Year
            </label>
            <button
              type='button'
              onClick={() =>
                setOpenDropdown(openDropdown === 'year' ? null : 'year')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span className='text-foreground'>{formData.year}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'year'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
            {openDropdown === 'year' && (
              <ul className='absolute z-30 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
                {availableYears.map(year => (
                  <li
                    key={year}
                    onClick={() => {
                      setFormField('year', year);
                      setOpenDropdown(null);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                      formData.year === year
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
            {errors.year && (
              <p className='text-red-500 text-sm mt-1'>{errors.year[0]}</p>
            )}
          </div>

          {/* Semester Dropdown */}
          <div className='relative'>
            <label className='block text-sm font-medium text-foreground/80 mb-1'>
              Semester
            </label>
            <button
              type='button'
              onClick={() =>
                setOpenDropdown(openDropdown === 'semester' ? null : 'semester')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span className='text-foreground'>{formData.semester}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'semester'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
            {openDropdown === 'semester' && (
              <ul className='absolute z-30 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
                {availableSemesters.map(semester => (
                  <li
                    key={semester}
                    onClick={() => {
                      setFormField('semester', semester);
                      setOpenDropdown(null);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                      formData.semester === semester
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {semester}
                  </li>
                ))}
              </ul>
            )}
            {errors.semester && (
              <p className='text-red-500 text-sm mt-1'>{errors.semester[0]}</p>
            )}
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
                formData.courseId
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {formData.courseId
                ? courses.find(c => c.id === formData.courseId)?.name
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
                    setFormField('courseId', course.id);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    formData.courseId === course.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {course.name}
                </li>
              ))}
            </ul>
          )}
          {errors.courseId && (
            <p className='text-red-500 text-sm mt-1'>{errors.courseId[0]}</p>
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
                formData.professorId
                  ? 'text-foreground'
                  : 'text-muted-foreground italic'
              }
            >
              {formData.professorId
                ? professors.find(p => p.id === formData.professorId)?.name
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
                  setFormField('professorId', null);
                  setOpenDropdown(null);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                  !formData.professorId
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
                    setFormField('professorId', professor.id);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    formData.professorId === professor.id
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

        {/* Display API Error */}
        {apiError && <p className='text-red-500 text-sm'>{apiError.message}</p>}

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
