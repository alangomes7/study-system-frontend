'use client';

import { StudentDropdown } from './components/StudentDropdown';
import { useDeleteStudentData } from './hooks/useDeleteStudentData';
import { useDeleteStudentHandlers } from './hooks/useDeleteStudentHandlers';
import { DotsAnimation } from '@/components';

export default function DeleteStudentClientPage() {
  const { selectedStudent } = useDeleteStudentData();
  const { handleDelete, isDeleting } = useDeleteStudentHandlers();

  return (
    <div className='container mx-auto px-4 py-8 max-w-xl'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Delete Student
      </h1>

      <div className='card p-6 space-y-6'>
        <div className='bg-warning/10 border border-warning text-warning-dark p-4 rounded-md text-sm'>
          Warning: Deleting a student will permanently remove their data and
          unenroll them from all classes.
        </div>

        <StudentDropdown />

        {selectedStudent && (
          <div className='p-4 bg-background border border-border rounded-md space-y-2'>
            <p>
              <strong>Name:</strong> {selectedStudent.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p>
              <strong>CPF:</strong> {selectedStudent.register}
            </p>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={!selectedStudent || isDeleting}
          className='btn bg-error text-white hover:bg-red-700 w-full disabled:opacity-50'
        >
          {isDeleting ? (
            <span className='flex items-center justify-center gap-2'>
              <DotsAnimation className='w-4 h-4 text-white' /> Deleting...
            </span>
          ) : (
            'Delete Student'
          )}
        </button>
      </div>
    </div>
  );
}
