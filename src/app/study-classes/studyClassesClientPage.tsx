'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

import { useGetAllStudyClasses, useGetStudentsByStudyClass } from '@/hooks';
import { StudyClass } from '@/types';

export default function StudyClassesClientPage() {
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studyClassSearchTerm, setStudyClassSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<'pagination' | null>(null);

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

  const handlePaginationLengthChange = (length: number) => {
    setPaginationLength(length);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        {/* Class List */}
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

        {/* Details & Students */}
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

              {/* Filters */}
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <h2 className='text-xl md:text-2xl font-semibold text-foreground'>
                  Students
                </h2>

                <div className='flex items-center gap-4 w-full md:w-auto'>
                  {/* Custom Dropdown */}
                  <div className='relative'>
                    <button
                      type='button'
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === 'pagination' ? null : 'pagination',
                        )
                      }
                      className='bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center w-36 shadow-sm hover:border-primary transition-colors'
                    >
                      <span>{paginationLength} per page</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === 'pagination'
                            ? 'rotate-180 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>

                    {openDropdown === 'pagination' && (
                      <ul className='absolute z-20 mt-1 w-36 bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
                        {[5, 10, 20].map(length => (
                          <li
                            key={length}
                            onClick={() => handlePaginationLengthChange(length)}
                            className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                              paginationLength === length
                                ? 'bg-primary/20 text-primary-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            {length} per page
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <input
                    type='text'
                    placeholder='Search by student name'
                    className='input w-full sm:w-auto'
                    value={studentSearchTerm}
                    onChange={e => setStudentSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Students Table */}
              {isStudentsLoading ? (
                <div className='text-center p-6 text-foreground'>
                  Loading students...
                </div>
              ) : filteredStudents.length > 0 ? (
                <>
                  <div className='hidden md:block overflow-x-auto bg-card-background rounded-lg border border-border'>
                    <table className='min-w-full'>
                      <thead>
                        <tr className='border-b border-border'>
                          {['ID', 'Name', 'Phone', 'Register'].map(h => (
                            <th
                              key={h}
                              className='py-2 px-4 text-left text-foreground/80 border-b border-border'
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudents.map(student => (
                          <tr
                            key={student.id}
                            className='hover:bg-foreground/5 border-b border-border'
                          >
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link href={`/students/${student.id}`}>
                                {student.id}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link href={`/students/${student.id}`}>
                                {student.name}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link href={`/students/${student.id}`}>
                                {student.phone}
                              </Link>
                            </td>
                            <td className='py-2 px-4 text-center text-foreground'>
                              <Link href={`/students/${student.id}`}>
                                {student.register}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
