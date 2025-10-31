'use client';

// Import the hook you will create
import { useEnrollStudent } from '@/hooks/useStudyClasses';
import Link from 'next/link';

export default function EnrollStudentPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Get the study class id from params
  const { id } = params;

  // 2. Call the new hook for enrolling students
  const {
    students,
    studyClass,
    selectedStudent,
    setSelectedStudent,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  } = useEnrollStudent(id);

  if (isLoading) {
    return <div className='text-center mt-8 text-foreground'>Loading...</div>;
  }

  // 4. Page-level error (e.g., class not found)
  if (error && !isSubmitting) {
    return <p className='text-center mt-8 text-red-500'>Error: {error}</p>;
  }

  // 5. Render the form
  return (
    <div className='container mx-auto px-4 py-8 max-w-lg'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6 text-foreground'>
        {/* CHANGED: Title text */}
        Enroll Student in {studyClass?.classCode || 'Class'}
      </h1>

      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div className='mb-4'>
          <label
            htmlFor='student'
            className='block text-sm font-medium text-foreground/80 mb-1'
          >
            Student
          </label>
          <select
            id='student'
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className='input'
            required
          >
            <option value='' disabled>
              Select a student
            </option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submission error */}
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <div className='flex items-center gap-4'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll'}
          </button>

          <Link
            href={`/study-classes/${id}`}
            className='btn border border-border hover:bg-foreground/5'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
