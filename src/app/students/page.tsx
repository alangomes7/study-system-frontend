'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllStudents } from '@/lib/api_query';

export default function StudentsPage() {
  const {
    data: students = [], // Default to empty array
    isLoading,
    error,
  } = useGetAllStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const router = useRouter();

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading students...
      </div>
    );
  }

  if (error) {
    return (
      <p className='text-center mt-8 text-red-500'>Error: {error.message}</p>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold md:text-3xl text-foreground'>
          Students
        </h1>
        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <select
            id='pagination-length'
            value={paginationLength}
            onChange={handlePaginationLengthChange}
            className='input w-full sm:w-auto'
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
          <input
            type='text'
            placeholder='Search by student name...'
            className='input w-full sm:w-auto'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className='hidden md:block overflow-x-auto bg-card-background rounded-lg border border-border shadow'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='py-3 px-4 text-left text-foreground/80'>ID</th>
                  <th className='py-3 px-4 text-left text-foreground/80'>
                    Name
                  </th>
                  <th className='py-3 px-4 text-left text-foreground/80'>
                    Phone
                  </th>
                  <th className='py-3 px-4 text-left text-foreground/80'>
                    E-mail
                  </th>
                  <th className='py-3 px-4 text-left text-foreground/80'>
                    CPF
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Use currentStudents (paginated) */}
                {currentStudents.map(student => (
                  <tr
                    key={student.id}
                    className='hover:bg-foreground/5 border-b border-border cursor-pointer'
                    onClick={() => handleRowClick(student.id)}
                  >
                    <td className='py-3 px-4 text-foreground'>{student.id}</td>
                    <td className='py-3 px-4 text-foreground'>
                      {student.name}
                    </td>
                    <td className='py-3 px-4 text-foreground'>
                      {student.phone}
                    </td>
                    <td className='py-3 px-4 text-foreground'>
                      {student.email}
                    </td>
                    <td className='py-3 px-4 text-foreground'>
                      {student.register}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='grid grid-cols-1 gap-4 md:hidden'>
            {/* Use currentStudents (paginated) */}
            {currentStudents.map(student => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className='card'
              >
                <div className='font-bold text-lg text-primary'>
                  {student.name}
                </div>
                <div className='text-sm text-foreground/80 mt-2 space-y-1'>
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
              className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
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
                  className={`btn mx-1 ${
                    currentPage === i + 1
                      ? 'btn-primary'
                      : 'border border-border bg-card-background hover:bg-foreground/5'
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
              className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <div className='card text-center p-6'>
          <p className='text-foreground/70'>No students found.</p>
        </div>
      )}
    </div>
  );
}
