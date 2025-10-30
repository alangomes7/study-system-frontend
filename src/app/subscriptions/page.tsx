'use client';

import { useEnrollStudent } from '@/hooks/useSubscriptions';

export default function EnrollStudentPage() {
  const {
    students,
    studyClasses,
    selectedStudent,
    setSelectedStudent,
    selectedStudyClass,
    setSelectedStudyClass,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  } = useEnrollStudent();

  if (isLoading) {
    return (
      <div className='text-center mt-8'>
        Loading students and study classes...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Enroll Student</h1>
      {/* 👈 4. Show submission error */}
      {error && <p className='text-center mb-4 text-red-500'>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6'
      >
        <div className='mb-4'>
          <label
            htmlFor='student'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Student
          </label>
          <select
            id='student'
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className='border rounded-lg p-2 w-full bg-white dark:bg-gray-700'
            disabled={isSubmitting}
            required
          >
            <option value=''>Select a student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label
            htmlFor='studyClass'
            className='block text-gray-700 dark:text-gray-300 font-bold mb-2'
          >
            Study Class
          </label>
          <select
            id='studyClass'
            value={selectedStudyClass}
            onChange={e => setSelectedStudyClass(e.target.value)}
            className='border rounded-lg p-2 w-full bg-white dark:bg-gray-700'
            disabled={isSubmitting}
            required
          >
            <option value=''>Select a study class</option>
            {studyClasses.map(studyClass => (
              <option key={studyClass.id} value={studyClass.id}>
                {studyClass.classCode}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enrolling...' : 'Enroll'}
        </button>
      </form>
    </div>
  );
}
