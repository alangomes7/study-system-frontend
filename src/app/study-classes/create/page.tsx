'use client';

import { useCreateStudyClass } from '@/hooks/useStudyClasses';

export default function CreateStudyClassPage() {
  const {
    courses,
    professors,
    classCode,
    setClassCode,
    year,
    setYear,
    semester,
    setSemester,
    courseId,
    setCourseId,
    professorId,
    setProfessorId,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  } = useCreateStudyClass();

  if (isLoading) {
    return (
      <div className='text-center mt-8'>Loading courses and professors...</div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Create Study Class</h1>
      {/* 👈 4. Show submit error */}
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        {/* Class Code Input (Added back from original file) */}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            required
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
            Professor (Optional)
          </label>
          <select
            id='professor'
            value={professorId}
            onChange={e => setProfessorId(e.target.value)}
            className='border rounded-lg p-2 w-full bg-white dark:bg-gray-700'
            disabled={isSubmitting}
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
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
          disabled={isSubmitting} // 👈 Disable button on submit
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
