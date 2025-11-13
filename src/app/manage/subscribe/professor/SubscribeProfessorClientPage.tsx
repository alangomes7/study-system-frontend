'use client';

import { ProfessorEnrollmentForm } from './components/ProfessorEnrollmentForm';
import { EnrolledProfessorDisplay } from './components/EnrolledProfessorDisplay';

export default function SubscribeProfessorClientPage() {
  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl font-bold text-foreground'>Enroll Professor</h1>

      {/* --- Enrollment Form --- */}
      <ProfessorEnrollmentForm />

      {/* --- Display for Currently Enrolled Professor --- */}
      <EnrolledProfessorDisplay />
    </div>
  );
}
