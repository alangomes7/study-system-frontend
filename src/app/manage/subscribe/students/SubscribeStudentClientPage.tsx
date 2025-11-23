'use client';

import { SpinLoaderAnimation } from '@/components';
import { useSubscribeStudentData } from './hooks/useSubscribeStudentData';
import { EnrollmentForm } from './components/EnrollmentForm';
import { EnrolledStudentsTable } from './components/EnrolledStudentsTable';
import clsx from 'clsx';

export default function SubscribeStudentClientPage() {
  const {
    isLoading,
    selectedStudyClass,
    enrolledStudents,
    handlers,
    computed,
  } = useSubscribeStudentData();

  if (isLoading && !computed.courses.length && !computed.allStudents.length) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoaderAnimation
          className={clsx('flex h-60 items-center justify-center')}
        />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl font-bold text-foreground'>Enroll Student</h1>

      {/* --- Enrollment Form --- */}
      <EnrollmentForm />

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
