// src/app/study-classes/page.tsx (Updated)
'use client';

import { Student } from '@/types/student';
import clsx from 'clsx';
import Link from 'next/link';
import { useStudyClasses } from '@/hooks/useStudyClasses';

export default function StudyClassesPage() {
  const {
    isLoading,
    isStudentsLoading,
    selectedStudyClass,
    filteredStudyClasses,
    currentStudents,
    studentSearchTerm,
    setStudentSearchTerm,
    studyClassSearchTerm,
    setStudyClassSearchTerm,
    currentPage,
    paginationLength,
    filteredStudents,
    handleStudyClassClick,
    handleStudyClassDeselect,
    handlePaginationLengthChange,
    paginate,
  } = useStudyClasses();

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
