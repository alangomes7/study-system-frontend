'use client';

import { Student } from '@/types/student';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from 'react';

// API Function
async function getAllStudents(): Promise<Student[]> {
  const response = await fetch('http://localhost:8080/students', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

// Main Component
export default function StudentsPage() {
  const router = useRouter(); // Initialize the router
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch all students on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Effect to filter students when search term changes
  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(results);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleRowClick = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * paginationLength;
  const indexOfFirstStudent = indexOfLastStudent - paginationLength;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className='text-center mt-8'>Loading students...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold md:text-3xl'>Students</h1>
        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <select
            id='pagination-length'
            value={paginationLength}
            onChange={handlePaginationLengthChange}
            className='border rounded-lg p-2 bg-white dark:bg-gray-700 w-full sm:w-auto'
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <input
            type='text'
            placeholder='Search by student name...'
            className='border rounded-lg p-2 w-full sm:w-auto'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className='hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='py-3 px-4 text-left'>ID</th>
                  <th className='py-3 px-4 text-left'>Name</th>
                  <th className='py-3 px-4 text-left'>Phone</th>
                  <th className='py-3 px-4 text-left'>E-mail</th>
                  <th className='py-3 px-4 text-left'>CPF</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map(student => (
                  <tr
                    key={student.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 cursor-pointer'
                    onClick={() => handleRowClick(student.id)} // ✨ Add onClick to the row
                  >
                    <td className='py-3 px-4'>{student.id}</td>
                    <td className='py-3 px-4'>{student.name}</td>
                    <td className='py-3 px-4'>{student.phone}</td>
                    <td className='py-3 px-4'>{student.email}</td>
                    <td className='py-3 px-4'>{student.register}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='grid grid-cols-1 gap-4 md:hidden'>
            {currentStudents.map(student => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className='block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                {/* ✨ FIX: Removed nested Link component */}
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
          <div className='flex justify-center mt-6'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50'
            >
              &lt;
            </button>
            {Array.from(
              {
                length: Math.ceil(filteredStudents.length / paginationLength),
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
        </>
      ) : (
        <div className='text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow'>
          <p className='text-gray-500 dark:text-gray-400'>No students found.</p>
        </div>
      )}
    </div>
  );
}
