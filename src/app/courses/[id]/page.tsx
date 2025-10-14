'use client';

import { Course } from '@/types/course';
import { StudyClass } from '@/types/study-class';
import { Subscription } from '@/types/subscription';
import { Student } from '@/types/student';

import Link from 'next/link';
// ✨ 1. Import 'use' from React
import { useState, useEffect, use } from 'react';

async function getCourse(id: string): Promise<Course> {
  const response = await fetch(`http://localhost:8080/courses/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }
  return response.json();
}

async function getStudyClasses(courseId: string): Promise<StudyClass[]> {
  const response = await fetch(
    `http://localhost:8080/study-classes/course/${courseId}`,
    {
      cache: 'no-store',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch study classes');
  }
  return response.json();
}

async function getSubscriptions(studyClassId: number): Promise<Subscription[]> {
  const response = await fetch(
    `http://localhost:8080/subscriptions?studyClassId=${studyClassId}`,
    {
      cache: 'no-store',
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }
  return response.json();
}

export default function CourseDetailsPage({
  params,
}: {
  // The type of params is now a Promise that resolves to the object
  params: Promise<{ id: string }>;
}) {
  // ✨ 2. Unwrap the promise with use() before destructuring
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const courseData = await getCourse(id);
        setCourse(courseData);
        const studyClassesData = await getStudyClasses(id);
        setStudyClasses(studyClassesData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!selectedStudyClass) {
      setStudents([]);
      setFilteredStudents([]);
      return;
    }

    async function fetchStudents() {
      try {
        const subscriptions = await getSubscriptions(selectedStudyClass!.id);

        const studentData = subscriptions
          .filter(sub => sub && sub.student)
          .map(sub => sub.student);

        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStudents();
  }, [selectedStudyClass]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(results);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const handleStudyClassClick = (studyClass: StudyClass) => {
    setSelectedStudyClass(studyClass);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-2'>{course?.name}</h1>
      <p className='text-lg text-gray-600 dark:text-gray-400 mb-6'>
        {course?.description}
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <h2 className='text-2xl font-bold mb-4'>Study Classes</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
              <thead>
                <tr>
                  <th className='py-2 px-4 border-b'>Study Class</th>
                </tr>
              </thead>
              <tbody>
                {studyClasses.map(studyClass => (
                  <tr
                    key={studyClass.id}
                    className='hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                    onClick={() => handleStudyClassClick(studyClass)}
                  >
                    <td className='py-2 px-4 border-b text-center'>
                      {studyClass.classCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='md:col-span-2'>
          {selectedStudyClass && (
            <div>
              <h2 className='text-2xl font-bold mb-4'>Study Class Details</h2>
              <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8'>
                <p>
                  <strong>Year/Semester:</strong> {selectedStudyClass.year}/
                  {selectedStudyClass.semester}
                </p>
                <p>
                  <strong>Code:</strong> {selectedStudyClass.classCode}
                </p>
                <p>
                  <strong>Professor:</strong>{' '}
                  {selectedStudyClass.professorName || 'Not Assigned'}
                </p>
              </div>

              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-semibold'>Students</h2>
                <input
                  type='text'
                  placeholder='Search by student name'
                  className='border rounded-lg p-2'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 border-b'>ID</th>
                      <th className='py-2 px-4 border-b'>Name</th>
                      <th className='py-2 px-4 border-b'>Email</th>
                      <th className='py-2 px-4 border-b'>CPF</th>
                      <th className='py-2 px-4 border-b'>Phone Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map(student => (
                      <tr
                        key={student.id}
                        className='hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        <td className='py-2 px-4 border-b text-center'>
                          <Link
                            href={`/students/${student.id}`}
                            className='block w-full h-full'
                          >
                            {student.id}
                          </Link>
                        </td>
                        <td className='py-2 px-4 border-b text-center'>
                          <Link
                            href={`/students/${student.id}`}
                            className='block w-full h-full'
                          >
                            {student.name}
                          </Link>
                        </td>
                        <td className='py-2 px-4 border-b text-center'>
                          {student.email}
                        </td>
                        <td className='py-2 px-4 border-b text-center'>
                          {student.cpf}
                        </td>
                        <td className='py-2 px-4 border-b text-center'>
                          {student.phoneNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flex justify-center mt-4'>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700'
                >
                  &lt;
                </button>
                {Array.from(
                  {
                    length: Math.ceil(
                      filteredStudents.length / studentsPerPage,
                    ),
                  },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredStudents.length / studentsPerPage)
                  }
                  className='px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700'
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
