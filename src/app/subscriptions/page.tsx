'use client';

import { Student } from '@/types/student';
import { StudyClass } from '@/types/study-class';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function getStudents(): Promise<Student[]> {
  const response = await fetch('http://localhost:8080/students', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

async function getStudyClasses(): Promise<StudyClass[]> {
  const response = await fetch('http://localhost:8080/study-classes', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch study classes');
  }
  return response.json();
}

export default function EnrollStudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudyClass, setSelectedStudyClass] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsData, studyClassesData] = await Promise.all([
          getStudents(),
          getStudyClasses(),
        ]);
        setStudents(studentsData);
        setStudyClasses(studyClassesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          studyClassId: selectedStudyClass,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to enroll student');
      }
      router.push(`/study-classes/${selectedStudyClass}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (error) {
    return <p className='text-center mt-8 text-red-500'>Error: {error}</p>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Enroll Student</h1>
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
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          Enroll
        </button>
      </form>
    </div>
  );
}
