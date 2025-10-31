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
      <div className='text-center mt-8 text-foreground'>
        Loading students and study classes...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Enroll Student
      </h1>
      {error && <p className='text-center mb-4 text-red-500'>{error}</p>}
      <form onSubmit={handleSubmit} className='card p-6'>
        <div className='mb-4'>
          <label
            htmlFor='student'
            className='block text-foreground font-bold mb-2'
          >
            Student
          </label>
          <select
            id='student'
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className='input'
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
            className='block text-foreground font-bold mb-2'
          >
            Study Class
          </label>
          <select
            id='studyClass'
            value={selectedStudyClass}
            onChange={e => setSelectedStudyClass(e.target.value)}
            className='input'
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
          className='btn btn-primary disabled:opacity-50'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enrolling...' : 'Enroll'}
        </button>
      </form>
    </div>
  );
}
