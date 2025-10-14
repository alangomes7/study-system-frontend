'use client';

import { Course } from '@/types/course';
import { StudyClass } from '@/types/study-class';
import { Subscription } from '@/types/subscription';
import { Student } from '@/types/student';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';

// API Fetching Functions

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

async function getStudent(id: number): Promise<Student> {
  const response = await fetch(`http://localhost:8080/students/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch student with id ${id}`);
  }
  return response.json();
}

async function getStudentsInBatches(
  subscriptions: Subscription[],
  batchSize = 20,
) {
  const studentIds = [
    ...new Set(
      subscriptions
        .filter(sub => sub && sub.studentId)
        .map(sub => sub.studentId),
    ),
  ];

  const allStudents: Student[] = [];

  for (let i = 0; i < studentIds.length; i += batchSize) {
    const batchIds = studentIds.slice(i, i + batchSize);
    const studentPromises = batchIds.map(id => getStudent(id));
    const studentsInBatch = await Promise.all(studentPromises);
    allStudents.push(...studentsInBatch);
  }

  return allStudents;
}

// Main Component

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);

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
        const studentData = await getStudentsInBatches(subscriptions);
        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
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

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastStudent = currentPage * paginationLength;
  const indexOfFirstStudent = indexOfLastStudent - paginationLength;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* ✨ CHANGE: Responsive font sizes for the main header. */}
      <h1 className='text-2xl font-bold md:text-3xl mb-2'>{course?.name}</h1>
      <p className='text-gray-600 dark:text-gray-400 mb-6'>
        {course?.description}
      </p>

      {/* This grid layout already stacks into a single column on mobile, which is great. */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Study Classes Column */}
        <div className='md:col-span-1'>
          <h2 className='text-xl md:text-2xl font-bold mb-4'>Study Classes</h2>
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

        {/* Details and Students Column */}
        <div className='md:col-span-2'>
          {selectedStudyClass && (
            <div>
              <h2 className='text-xl md:text-2xl font-bold mb-4'>
                Study Class Details
              </h2>
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

              {/* ✨ CHANGE: Student controls now stack on mobile and are aligned properly. */}
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <h2 className='text-xl md:text-2xl font-semibold'>Students</h2>
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
                  <select
                    id='pagination-length'
                    value={paginationLength}
                    onChange={handlePaginationLengthChange}
                    className='border rounded-lg p-2 bg-white dark:bg-gray-700 w-full sm:w-auto'
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                  <input
                    type='text'
                    placeholder='Search by student name'
                    className='border rounded-lg p-2 w-full sm:w-auto'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* ✨ CHANGE: Desktop table view. Hidden on screens smaller than 'md'. */}
              <div className='hidden md:block overflow-x-auto'>
                <table className='min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 border-b'>ID</th>
                      <th className='py-2 px-4 border-b'>Name</th>
                      <th className='py-2 px-4 border-b'>Phone Number</th>
                      <th className='py-2 px-4 border-b'>E-mail</th>
                      <th className='py-2 px-4 border-b'>CPF</th>
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
                          <Link
                            href={`/students/${student.id}`}
                            className='block w-full h-full'
                          >
                            {student.phone}
                          </Link>
                        </td>
                        <td className='py-2 px-4 border-b text-center'>
                          <Link
                            href={`/students/${student.id}`}
                            className='block w-full h-full'
                          >
                            {student.email}
                          </Link>
                        </td>
                        {/* ✨ FIX: The Link for CPF must be inside a <td> element. */}
                        <td className='py-2 px-4 border-b text-center'>
                          <Link
                            href={`/students/${student.id}`}
                            className='block w-full h-full'
                          >
                            {student.register}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✨ CHANGE: Mobile card view. Only visible on screens smaller than 'md'. */}
              <div className='grid grid-cols-1 gap-4 md:hidden'>
                {currentStudents.map(student => (
                  <Link
                    key={student.id}
                    href={`/students/${student.id}`}
                    className='block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700'
                  >
                    <div className='font-bold text-lg text-blue-500'>
                      {student.name}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1'>
                      <p>
                        <strong>ID:</strong> {student.id}
                      </p>
                      <p>
                        <strong>Phone:</strong> {student.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {student.email}
                      </p>
                      <p>
                        <strong>CPF:</strong> {student.register}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className='flex justify-center mt-4'>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50'
                >
                  &lt;
                </button>
                {Array.from(
                  {
                    length: Math.ceil(
                      filteredStudents.length / paginationLength,
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
                    Math.ceil(filteredStudents.length / paginationLength)
                  }
                  className='px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50'
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
