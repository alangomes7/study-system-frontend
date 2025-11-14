'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useStudyClassForm } from '@/hooks';
import { SpinLoaderAnimation } from '@/components';

export default function CreateStudyClassClientPage() {
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
        <SpinLoaderAnimation />
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
          {/* Year Dropdown */}
          <div className='relative'>
            <label
              htmlFor='year-input'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Year
            </label>
            <input
              type='hidden'
              id='year-input'
              name='year'
              value={formData.year}
              readOnly
            />
            <button
              type='button'
              onClick={() =>
                setOpenDropdown(openDropdown === 'year' ? null : 'year')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
              role='combobox'
              aria-haspopup='listbox'
              aria-expanded={openDropdown === 'year'}
              aria-controls='year-listbox'
              aria-labelledby='year-input'
              aria-describedby={errors.year ? 'year-error' : undefined}
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
              <ul
                id='year-listbox'
                role='listbox'
                aria-labelledby='year-input'
                className='absolute z-30 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'
              >
                {availableYears.map(year => (
                  <li
                    key={year}
                    role='option'
                    aria-selected={formData.year === year}
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
              <p id='year-error' className='text-red-500 text-sm mt-1'>
                {errors.year[0]}
              </p>
            )}
          </div>

          {/* Semester Dropdown */}
          <div className='relative'>
            <label
              htmlFor='semester-input'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Semester
            </label>
            <input
              type='hidden'
              id='semester-input'
              name='semester'
              value={formData.semester}
              readOnly
            />
            <button
              type='button'
              onClick={() =>
                setOpenDropdown(openDropdown === 'semester' ? null : 'semester')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
              role='combobox'
              aria-haspopup='listbox'
              aria-expanded={openDropdown === 'semester'}
              aria-controls='semester-listbox'
              aria-labelledby='semester-input'
              aria-describedby={errors.semester ? 'semester-error' : undefined}
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
              <ul
                id='semester-listbox'
                role='listbox'
                aria-labelledby='semester-input'
                className='absolute z-30 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'
              >
                {availableSemesters.map(semester => (
                  <li
                    key={semester}
                    role='option'
                    aria-selected={formData.semester === semester}
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
              <p id='semester-error' className='text-red-500 text-sm mt-1'>
                {errors.semester[0]}
              </p>
            )}
          </div>
        </div>

        {/* Course Dropdown */}
        <div className='relative'>
          <label
            htmlFor='course-input'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Course
          </label>
          <input
            type='hidden'
            id='course-input'
            name='courseId'
            value={formData.courseId || ''}
            readOnly
          />
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(openDropdown === 'course' ? null : 'course')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            role='combobox'
            aria-haspopup='listbox'
            aria-expanded={openDropdown === 'course'}
            aria-controls='course-listbox'
            aria-labelledby='course-input'
            aria-describedby={errors.courseId ? 'course-error' : undefined}
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
            <ul
              id='course-listbox'
              role='listbox'
              aria-labelledby='course-input'
              className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'
            >
              {courses.map(course => (
                <li
                  key={course.id}
                  role='option'
                  aria-selected={formData.courseId === course.id}
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
            <p id='course-error' className='text-red-500 text-sm mt-1'>
              {errors.courseId[0]}
            </p>
          )}
        </div>

        {/* Professor Dropdown */}
        <div className='relative'>
          <label
            htmlFor='professor-input'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Professor (Optional)
          </label>
          <input
            type='hidden'
            id='professor-input'
            name='professorId'
            value={formData.professorId || ''}
            readOnly
          />
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(openDropdown === 'professor' ? null : 'professor')
            }
            className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            role='combobox'
            aria-haspopup='listbox'
            aria-expanded={openDropdown === 'professor'}
            aria-controls='professor-listbox'
            aria-labelledby='professor-input'
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
            <ul
              id='professor-listbox'
              role='listbox'
              aria-labelledby='professor-input'
              className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'
            >
              <li
                role='option'
                aria-selected={!formData.professorId}
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
                  role='option'
                  aria-selected={formData.professorId === professor.id}
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

        {/* API Error */}
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
