'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '@/types/student';
import { StudyClass } from '@/types/study-class';
import {
  createSubscription,
  getAllStudents,
  getAllStudyClasses,
} from '@/lib/api';

export function useEnrollStudent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudyClass, setSelectedStudyClass] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For initial data
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submit
  const router = useRouter();

  // Fetch data for dropdowns
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch in parallel
        const [studentsData, studyClassesData] = await Promise.all([
          getAllStudents(),
          getAllStudyClasses(),
        ]);
        setStudents(studentsData);
        setStudyClasses(studyClassesData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedStudyClass) {
      setError('Please select both a student and a study class.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createSubscription({
        studentId: Number(selectedStudent),
        studyClassId: Number(selectedStudyClass),
      });
      router.push(`/study-classes/${selectedStudyClass}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
