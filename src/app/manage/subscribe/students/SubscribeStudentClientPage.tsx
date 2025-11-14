'use client';

import { SpinLoaderAnimation } from '@/components';
import { useSubscribeStudentData } from './hooks/useSubscribeStudentData';
import { EnrollmentForm } from './components/EnrollmentForm';
import { EnrolledStudentsTable } from './components/EnrolledStudentsTable';

export default function SubscribeStudentClientPage() {
  const {
    isLoading,
    // error is no longer needed here, as sub-components handle their own
    selectedStudyClass,
    enrolledStudents,
    handlers,
    computed,
  } = useSubscribeStudentData();

  // This check is still valid for the initial page load
  if (isLoading && !computed.courses.length && !computed.allStudents.length) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoaderAnimation />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl font-bold text-foreground'>Enroll Student</h1>

      {/* --- Enrollment Form (Refactored) --- */}
      {/* No longer needs data or handlers props */}
      <EnrollmentForm />

      {/* --- Enrolled Student List (Unchanged) --- */}
      {/* Still gets its props from the page's hook */}
      <EnrolledStudentsTable
        studyClass={selectedStudyClass}
        enrolledStudents={enrolledStudents}
        handlers={handlers}
        computed={computed}
      />
    </div>
  );
}
