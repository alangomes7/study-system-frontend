'use client';

import { StudyClass } from '@/types/study-class';
import { Subscription } from '@/types/subscription';
import { Student } from '@/types/student';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// API Functions
async function getAllStudyClasses(): Promise<StudyClass[]> {
  const response = await fetch('http://localhost:8080/study-classes', {
    cache: 'no-store',
  });
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
): Promise<Student[]> {
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
export default function StudyClassesPage() {
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studyClassSearchTerm, setStudyClassSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);

  // Effect to fetch all study classes on initial load
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const studyClassesData = await getAllStudyClasses();
        setStudyClasses(studyClassesData);
      } catch (error) {
        console.error('Failed to fetch study classes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Only show classes if a search term is entered
  const filteredStudyClasses =
    studyClassSearchTerm.trim() === ''
      ? []
      : studyClasses.filter(sc =>
          sc.classCode
            .toLowerCase()
            .includes(studyClassSearchTerm.toLowerCase().trim()),
        );

  // Effect to fetch students when a study class is selected
  useEffect(() => {
    if (!selectedStudyClass) {
      setStudents([]);
      return;
    }

    async function fetchStudents() {
      setIsStudentsLoading(true);
      try {
        const subscriptions = await getSubscriptions(selectedStudyClass!.id);
        const studentData = await getStudentsInBatches(subscriptions);
        setStudents(studentData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      } finally {
        setIsStudentsLoading(false);
      }
    }

    fetchStudents();
  }, [selectedStudyClass]);

  // Effect to filter students based on search term
  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
    );
    setFilteredStudents(results);
    setCurrentPage(1);
  }, [studentSearchTerm, students]);

  const handleStudyClassClick = (studyClass: StudyClass) => {
    // Prevent refetch if clicking the same class
    if (selectedStudyClass?.id === studyClass.id) return;

    setSelectedStudyClass(studyClass);
    // Reset student search and pagination when new class is clicked
    setStudentSearchTerm('');
    setCurrentPage(1);
  };

  // MODIFICATION: Add handler to deselect class
  const handleStudyClassDeselect = () => {
    setSelectedStudyClass(null);
    setStudentSearchTerm('');
    setCurrentPage(1);
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

  if (isLoading) {
    return <div className='text-center mt-8'>Loading study classes...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold md:text-3xl mb-6'>Study Classes</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Study Classes Column */}
        <div className='md:col-span-1'>
          <h2 className='text-xl md:text-2xl font-bold mb-4'>Class List</h2>
          <input
            type='text'
            placeholder='Search by class code...'
            className='border rounded-lg p-2 w-full mb-4'
            value={studyClassSearchTerm}
            onChange={e => setStudyClassSearchTerm(e.target.value)}
          />
          <div className='overflow-x-auto'>
            {filteredStudyClasses.length > 0 ? (
              <table className='min-w-full bg-white dark:bg-gray-800 border'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b'>Class Code</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudyClasses.map(sc => (
                    <tr
                      key={sc.id}
                      className={clsx(
                        'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
                        {
                          'bg-blue-200 dark:bg-blue-800':
                            selectedStudyClass?.id === sc.id,
                        },
                      )}
                      onClick={() => handleStudyClassClick(sc)}
                      // MODIFICATION: Add double-click handler
                      onDoubleClick={handleStudyClassDeselect}
                    >
                      <td className='py-2 px-4 border-b text-center'>
                        {sc.classCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow'>
                {studyClassSearchTerm.trim() === ''
                  ? 'Please enter a class code to search.'
                  : 'No study classes found.'}
              </div>
            )}
          </div>
        </div>

        {/* Details and Students Column */}
        <div className='md:col-span-2'>
          {selectedStudyClass ? (
            <div>
              <h2 className='text-xl md:text-2xl font-bold mb-4'>
                Class Details
              </h2>
              <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8'>
                <p>
                  <strong>Course:</strong> {selectedStudyClass.courseName}
                </p>
                <p>
                  <strong>Year/Semester:</strong> {selectedStudyClass.year}/
                  {selectedStudyClass.semester}
                </p>
                <p>
                  <strong>Professor:</strong>{' '}
                  {selectedStudyClass.professorName || 'Not Assigned'}
                </p>
              </div>

              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <h2 className='text-xl md:text-2xl font-semibold'>Students</h2>
                <div className='flex items-center gap-4 w-full md:w-auto'>
                  <select
                    value={paginationLength}
                    onChange={handlePaginationLengthChange}
                    className='border rounded-lg p-2 bg-white dark:bg-gray-700'
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                  <input
                    type='text'
                    placeholder='Search by student name'
                    className='border rounded-lg p-2 w-full sm:w-auto'
                    value={studentSearchTerm}
                    onChange={e => setStudentSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isStudentsLoading ? (
                <div className='text-center p-6'>Loading students...</div>
              ) : filteredStudents.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className='hidden md:block overflow-x-auto'>
                    <table className='min-w-full bg-white dark:bg-gray-800 border'>
                      <thead>
                        <tr>
                          <th className='py-2 px-4 border-b'>ID</th>
                          <th className='py-2 px-4 border-b'>Name</th>
                          <th className='py-2 px-4 border-b'>Phone</th>
                          <th className='py-2 px-4 border-b'>E-mail</th>
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
                                {student.register}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className='grid grid-cols-1 gap-4 md:hidden'>
                    {currentStudents.map(student => (
                      <Link
                        key={student.id}
                        href={`/students/${student.id}`}
                        className='block bg-white dark:bg-gray-800 p-4 rounded-lg shadow'
                      >
                        <div className='font-bold text-blue-500'>
                          {student.name}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                          <p>ID: {student.id}</p>
                          <p>Phone: {student.phone}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className='flex justify-center mt-4'>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='px-4 py-2 mx-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50'
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
                          className={`px-4 py-2 mx-1 rounded ${
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
                      className='px-4 py-2 mx-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50'
                    >
                      &gt;
                    </button>
                  </div>
                </>
              ) : (
                <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center'>
                  <p>No students found for this class.</p>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow'>
              Select a study class to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
