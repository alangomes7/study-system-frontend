'use client';

import {
  useGetCourse,
  useGetStudyClassesByCourse,
  useGetStudentsByStudyClass,
} from '@/hooks';
import { StudyClass } from '@/types';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CourseDetailsClientPage({ id }: { id: number }) {
  // --- Local UI State ---
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [studyClassSearchTerm, setStudyClassSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // --- Data Fetching with React Query ---
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourse(id);

  const {
    data: studyClasses = [],
    isLoading: isStudyClassesLoading,
    error: studyClassesError,
  } = useGetStudyClassesByCourse(id);

  const { data: students = [], isLoading: isStudentsLoading } =
    useGetStudentsByStudyClass(selectedStudyClass?.id || null);

  // --- Memoized Filtering (Client-side) ---
  const filteredStudyClasses = useMemo(() => {
    return studyClasses.filter(studyClass =>
      studyClass.classCode
        .toLowerCase()
        .includes(studyClassSearchTerm.toLowerCase()),
    );
  }, [studyClasses, studyClassSearchTerm]);

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  // --- Memoized Pagination (Client-side) ---
  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  // --- Event Handlers ---
  const handleStudyClassClick = (studyClass: StudyClass) => {
    if (selectedStudyClass?.id === studyClass.id) return;
    setSelectedStudyClass(studyClass);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleStudyClassDeselect = () => {
    setSelectedStudyClass(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePaginationLengthChange = (length: number) => {
    setPaginationLength(length);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Loading and Error States ---
  if (isCourseLoading || isStudyClassesLoading) {
    return (
      <div className='text-center mt-8 text-foreground'>
        Loading course details...
      </div>
    );
  }

  const error = courseError || studyClassesError;
  if (error) {
    return <div className='text-center mt-8 text-red-500'>{error.message}</div>;
  }

  if (!course) {
    return (
      <div className='text-center mt-8 text-foreground/80'>
        Course not found.
      </div>
    );
  }

  // --- Render Logic ---
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold md:text-3xl mb-2 text-foreground'>
        {course?.name}
      </h1>
      <p className='text-foreground/80 mb-6'>{course?.description}</p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* --- Study Classes List --- */}
        <div className='md:col-span-1'>
          <h2 className='text-xl md:text-2xl font-bold mb-4 text-foreground'>
            Study Classes
          </h2>
          <input
            type='text'
            placeholder='Search by class code...'
            className='input w-full mb-4'
            value={studyClassSearchTerm}
            onChange={e => setStudyClassSearchTerm(e.target.value)}
          />
          <div className='overflow-x-auto'>
            {filteredStudyClasses.length > 0 ? (
              <table className='min-w-full bg-card-background border border-border rounded-lg shadow-sm'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b border-border text-foreground/80 font-semibold'>
                      Study Class
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudyClasses.map(studyClass => (
                    <tr
                      key={studyClass.id}
                      className={clsx('hover:bg-foreground/10 cursor-pointer', {
                        'bg-primary/20':
                          selectedStudyClass?.id === studyClass.id,
                      })}
                      onClick={() => handleStudyClassClick(studyClass)}
                      onDoubleClick={handleStudyClassDeselect}
                    >
                      <td className='py-2 px-4 border-b border-border text-center text-foreground'>
                        {studyClass.classCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='card text-center text-foreground/80'>
                No study classes found.
              </div>
            )}
          </div>
        </div>

        {/* --- Students + Details Column --- */}
        <div className='md:col-span-2'>
          {selectedStudyClass ? (
            <div>
              <h2 className='text-xl md:text-2xl font-bold mb-4 text-foreground'>
                Study Class Details
              </h2>
              <div className='bg-card-background border border-border shadow-md rounded-lg p-6 mb-8 text-foreground'>
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

              {/* --- Students --- */}
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <h2 className='text-xl md:text-2xl font-semibold text-foreground'>
                  Students
                </h2>
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
                  {/* Custom Dropdown for Pagination */}
                  <div className='relative w-full sm:w-auto'>
                    <button
                      type='button'
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === 'pagination' ? null : 'pagination',
                        )
                      }
                      className='bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center w-full sm:w-36 shadow-sm hover:border-primary transition-colors'
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
                      <ul className='absolute z-20 mt-1 w-full sm:w-36 bg-card-background border border-border rounded-lg shadow-lg overflow-hidden'>
                        {[5, 10, 20].map(length => (
                          <li
                            key={length}
                            onClick={() => handlePaginationLengthChange(length)}
                            className={clsx(
                              'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                              {
                                'bg-primary/20 text-primary-foreground':
                                  paginationLength === length,
                              },
                            )}
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
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* --- Students Table / Cards --- */}
              {isStudentsLoading ? (
                <div className='text-center mt-8 text-foreground'>
                  Loading students...
                </div>
              ) : filteredStudents.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className='hidden md:block overflow-x-auto'>
                    <table className='min-w-full bg-card-background border border-border rounded-lg shadow-sm'>
                      <thead>
                        <tr>
                          {['ID', 'Name', 'Phone Number', 'E-mail', 'CPF'].map(
                            header => (
                              <th
                                key={header}
                                className='py-2 px-4 border-b border-border text-foreground/80 font-semibold'
                              >
                                {header}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudents.map(student => (
                          <tr
                            key={student.id}
                            className='hover:bg-foreground/10'
                          >
                            {[
                              student.id,
                              student.name,
                              student.phone,
                              student.email,
                              student.register,
                            ].map((value, i) => (
                              <td
                                key={i}
                                className='py-2 px-4 border-b border-border text-center'
                              >
                                <Link
                                  href={`/students/${student.id}`}
                                  className='block w-full h-full text-foreground hover:text-primary'
                                >
                                  {value}
                                </Link>
                              </td>
                            ))}
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
                        className='card block'
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

                  {/* Pagination */}
                  <div className='flex justify-center mt-4'>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='btn bg-foreground/10 text-foreground hover:bg-foreground/20 disabled:opacity-50 mx-1'
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
                              : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
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
                      className='btn bg-foreground/10 text-foreground hover:bg-foreground/20 disabled:opacity-50 mx-1'
                    >
                      &gt;
                    </button>
                  </div>
                </>
              ) : (
                <div className='bg-card-background border border-border shadow-md rounded-lg p-6 text-center'>
                  <p className='text-foreground/80'>
                    No students found for this class.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className='card text-center text-foreground/80'>
              Select a study class to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
