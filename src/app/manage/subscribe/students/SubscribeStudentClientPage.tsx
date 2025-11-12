'use client';

import { SpinLoader } from '@/components';
import { useSubscribeStudentData } from './hooks/useSubscribeStudentData';
import { EnrollmentForm } from './components/EnrollmentForm';
import { EnrolledStudentsTable } from './components/EnrolledStudentsTable';

export default function SubscribeStudentClientPage() {
  const {
    isLoading,
    error,
    selectedStudyClass,
    enrolledStudents,
    handlers,
    computed,
  } = useSubscribeStudentData();

  if (isLoading && !computed.courses.length && !computed.allStudents.length) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoader />
      </div>
    );
  }

  const enrollmentFormData = {
    ...computed,
    enrolledStudents: computed.filteredEnrolledStudents,
  };

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl font-bold text-foreground'>Enroll Student</h1>

      {/* --- Enrollment Form --- */}
      <EnrollmentForm
        data={enrollmentFormData}
        handlers={handlers}
        error={error}
      />

      {/* --- Enrolled Student List --- */}
      <EnrolledStudentsTable
        studyClass={selectedStudyClass}
        enrolledStudents={enrolledStudents}
        handlers={handlers}
        computed={computed}
      />
    </div>
  );
}
