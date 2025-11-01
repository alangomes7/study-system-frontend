'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import {
  useGetAllStudyClasses,
  useGetStudentsByStudyClass,
} from '@/lib/api_query';
import { StudyClass } from '@/types';

export default function StudyClassesPage() {
  // 3. Setup local state for UI
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studyClassSearchTerm, setStudyClassSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);

  // 4. Setup React Query for data fetching
  const { data: studyClasses = [], isLoading: isClassesLoading } =
    useGetAllStudyClasses();

  const { data: students = [], isLoading: isStudentsLoading } =
    useGetStudentsByStudyClass(selectedStudyClass?.id || null);

  const filteredStudyClasses = useMemo(() => {
    if (studyClassSearchTerm.trim() === '') {
      return [];
    }
    return studyClasses.filter(sc =>
      sc.classCode
        .toLowerCase()
        .includes(studyClassSearchTerm.toLowerCase().trim()),
    );
  }, [studyClasses, studyClassSearchTerm]);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
    );
  }, [students, studentSearchTerm]);

  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  const handleStudyClassClick = (studyClass: StudyClass) => {
    if (selectedStudyClass?.id === studyClass.id) return;
    setSelectedStudyClass(studyClass);
    setStudentSearchTerm('');
    setCurrentPage(1);
  };

  const handleStudyClassDeselect = () => {
    setSelectedStudyClass(null);
    setStudentSearchTerm('');
    setCurrentPage(1);
  };

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // --- Render Logic ---

  if (isClassesLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading study classes...
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold md:text-3xl text-foreground'>
          Study Classes
        </h1>
        <Link href='/study-classes/create' className='btn btn-primary'>
          Create New Class
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <h2 className='text-xl md:text-2xl font-bold mb-4 text-foreground'>
            Class List
          </h2>
          <input
            type='text'
            placeholder='Search by class code...'
            className='input mb-4'
            value={studyClassSearchTerm}
            onChange={e => setStudyClassSearchTerm(e.target.value)}
          />
          <div className='overflow-x-auto bg-card-background rounded-lg border border-border'>
            {filteredStudyClasses.length > 0 ? (
              <table className='min-w-full'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b border-border text-foreground/80'>
                      Class Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudyClasses.map(sc => (
                    <tr
                      key={sc.id}
                      className={clsx('hover:bg-foreground/5 cursor-pointer', {
                        'bg-primary/20 text-primary-foreground':
                          selectedStudyClass?.id === sc.id,
                      })}
                      onClick={() => handleStudyClassClick(sc)}
                      onDoubleClick={handleStudyClassDeselect}
                    >
                      <td className='py-2 px-4 border-b border-border text-center text-foreground'>
                        {sc.classCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='text-center p-4 card'>
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
              <h2 className='text-xl md:text-2xl font-bold mb-4 text-foreground'>
                Class Details
              </h2>
              <div className='card p-6 mb-8'>
                <p className='text-foreground'>
                  <strong>Course:</strong> {selectedStudyClass.courseName}
                </p>
                <p className='text-foreground'>
                  <strong>Year/Semester:</strong> {selectedStudyClass.year}/
                  {selectedStudyClass.semester}
                </p>
                <p className='text-foreground'>
                  <strong>Professor:</strong>{' '}
                  {selectedStudyClass.professorName || 'Not Assigned'}
                </p>
              </div>

              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <h2 className='text-xl md:text-2xl font-semibold text-foreground'>
                  Students
                </h2>
                <div className='flex items-center gap-4 w-full md:w-auto'>
                  <select
                    value={paginationLength}
                    onChange={handlePaginationLengthChange}
                    className='input'
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                  <input
                    type='text'
                    placeholder='Search by student name'
                    className='input w-full sm:w-auto'
                    value={studentSearchTerm}
                    onChange={e => setStudentSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isStudentsLoading ? (
                <div className='text-center p-6 text-foreground'>
                  Loading students...
                </div>
              ) : filteredStudents.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className='hidden md:block overflow-x-auto bg-card-background rounded-lg border border-border'>
                    <table className='min-w-full'>
                      <thead>
                        <tr className='border-b border-border'>
                          <th className='py-2 px-4 border-b border-border text-left text-foreground/80'>
                            ID
                          </th>
                          <th className='py-2 px-4 border-b border-border text-left text-foreground/80'>
                            Name
                          </th>
                          <th className='py-2 px-4 border-b border-border text-left text-foreground/80'>
                            Phone
                          </th>
                          <th className='py-2 px-4 border-b border-border text-left text-foreground/80'>
                            Register
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudents.map(student => (
                          <tr
                            key={student.id}
                            className='hover:bg-foreground/5 border-b border-border'
                          >
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link
                                href={`/students/${student.id}`}
                                className='block w-full h-full'
                              >
                                {student.id}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link
                                href={`/students/${student.id}`}
                                className='block w-full h-full'
                              >
                                {student.name}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link
                                href={`/students/${student.id}`}
                                className='block w-full h-full'
                              >
                                {student.phone}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
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
                        className='card'
                      >
                        <div className='font-bold text-primary'>
                          {student.name}
                        </div>
                        <div className='text-sm text-foreground/80 mt-2'>
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
                      className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
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
                <div className='card p-6 text-center'>
                  <p className='text-foreground/80'>
                    No students found for this class.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className='card text-center p-4'>
              Select a study class to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
