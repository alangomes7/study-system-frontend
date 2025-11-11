'use client';

import { useState, useMemo } from 'react';
import {
  useGetCourses,
  useGetStudyClassesByCourse,
  useGetAllStudents,
  useGetStudentsByStudyClass,
  useCreateSubscription,
} from '@/hooks';
import { SpinLoader } from '@/components';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';
import { SortConfig, Student } from './types';

export default function SubscribeStudentClientPage() {
  // --- Component State ---
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedStudyClassId, setSelectedStudyClassId] = useState<
    number | null
  >(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const [openDropdown, setOpenDropdown] = useState<
    'course' | 'studyClass' | 'student' | 'pagination' | null
  >(null);

  const [studentSearchTerm, setStudentSearchTerm] = useState(''); // For student dropdown
  const [tableSearchTerm, setTableSearchTerm] = useState(''); // For enrolled students table

  // --- Table State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig<Student> | null>(
    null,
  );

  // --- Data Fetching ---
  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useGetCourses();

  const {
    data: studyClasses = [],
    isLoading: isLoadingStudyClasses,
    error: studyClassesError,
  } = useGetStudyClassesByCourse(selectedCourseId || 0);

  const {
    data: allStudents = [],
    isLoading: isLoadingAllStudents,
    error: allStudentsError,
  } = useGetAllStudents();

  // Fetches students ENROLLED in the selected class
  const {
    data: enrolledStudents = [],
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetStudentsByStudyClass(selectedStudyClassId);

  const {
    mutate: createSubscription,
    isPending: isSubmitting,
    error: mutationError,
  } = useCreateSubscription();

  // --- Loading & Error States ---
  const isLoading =
    isLoadingCourses || isLoadingAllStudents || isLoadingStudyClasses;
  const error =
    coursesError ||
    allStudentsError ||
    studyClassesError ||
    enrolledStudentsError ||
    mutationError;

  // --- Memoized Derived Data ---

  // Find the full study class object
  const selectedStudyClass = useMemo(
    () => studyClasses.find(sc => sc.id === selectedStudyClassId) || null,
    [studyClasses, selectedStudyClassId],
  );

  // Filter students for the "Select Student" dropdown
  const filteredStudentsForDropdown = useMemo(
    () =>
      allStudents.filter(student =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
      ),
    [allStudents, studentSearchTerm],
  );

  // Filter students for the ENROLLED students table
  const filteredEnrolledStudents = useMemo(
    () =>
      enrolledStudents.filter(student =>
        student.name.toLowerCase().includes(tableSearchTerm.toLowerCase()),
      ),
    [enrolledStudents, tableSearchTerm],
  );

  // Sort the ENROLLED students table
  const sortedEnrolledStudents = useMemo(() => {
    const sortableStudents = [...filteredEnrolledStudents];
    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [filteredEnrolledStudents, sortConfig]);

  // Paginate the ENROLLED students table
  const currentEnrolledStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return sortedEnrolledStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent,
    );
  }, [sortedEnrolledStudents, currentPage, paginationLength]);

  // --- Event Handlers ---

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSelectedStudyClassId(null); // Reset study class
    setSelectedStudentId(null); // Reset student
    setOpenDropdown(null);
  };

  const handleSelectStudyClass = (studyClassId: number) => {
    setSelectedStudyClassId(studyClassId);
    setOpenDropdown(null);
    setCurrentPage(1); // Reset table pagination
  };

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setOpenDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedStudyClassId) return;

    createSubscription(
      {
        studentId: selectedStudentId,
        studyClassId: selectedStudyClassId,
      },
      {
        onSuccess: () => {
          // Reset student selection, keep class selection
          setSelectedStudentId(null);
          setStudentSearchTerm('');
        },
      },
    );
  };

  const requestSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Student) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className='w-4 h-4' />
    ) : (
      <ArrowDown className='w-4 h-4' />
    );
  };

  const handlePaginationLengthChange = (length: number) => {
    setPaginationLength(length);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // --- Render ---

  if (isLoading && !courses.length && !allStudents.length) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <SpinLoader />
      </div>
    );
  }

  const selectedStudentName =
    allStudents.find(s => s.id === selectedStudentId)?.name ||
    '-- Select a student --';

  const selectedCourseName =
    courses.find(c => c.id === selectedCourseId)?.name ||
    '-- Select a course --';

  const selectedStudyClassName =
    studyClasses.find(sc => sc.id === selectedStudyClassId)?.classCode ||
    '-- Select a study class --';

  return (
    <div className='container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl font-bold text-foreground'>Enroll Student</h1>

      {/* --- Enrollment Form --- */}
      <form onSubmit={handleSubmit} className='card p-6 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Course Dropdown */}
          <div className='relative'>
            <label
              htmlFor='course-button'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Course
            </label>
            <button
              type='button'
              id='course-button'
              disabled={isSubmitting}
              onClick={() =>
                setOpenDropdown(openDropdown === 'course' ? null : 'course')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span
                className={clsx(
                  selectedCourseId
                    ? 'text-foreground'
                    : 'text-muted-foreground italic',
                )}
              >
                {selectedCourseName}
              </span>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  openDropdown === 'course'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground',
                )}
              />
            </button>
            {openDropdown === 'course' && (
              <ul className='absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg'>
                {courses.map(course => (
                  <li
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className={clsx(
                      'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                      selectedCourseId === course.id
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {course.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Study Class Dropdown */}
          <div className='relative'>
            <label
              htmlFor='studyclass-button'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Study Class
            </label>
            <button
              type='button'
              id='studyclass-button'
              disabled={!selectedCourseId || isSubmitting}
              onClick={() =>
                setOpenDropdown(
                  openDropdown === 'studyClass' ? null : 'studyClass',
                )
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
            >
              <span
                className={clsx(
                  selectedStudyClassId
                    ? 'text-foreground'
                    : 'text-muted-foreground italic',
                )}
              >
                {selectedStudyClassName}
              </span>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  openDropdown === 'studyClass'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground',
                )}
              />
            </button>
            {openDropdown === 'studyClass' && (
              <ul className='absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-card-background border border-border rounded-lg shadow-lg'>
                {isLoadingStudyClasses ? (
                  <li className='px-3 py-2 text-muted-foreground italic'>
                    Loading...
                  </li>
                ) : studyClasses.length > 0 ? (
                  studyClasses.map(sc => (
                    <li
                      key={sc.id}
                      onClick={() => handleSelectStudyClass(sc.id)}
                      className={clsx(
                        'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                        selectedStudyClassId === sc.id
                          ? 'bg-primary/20 text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {sc.classCode}
                    </li>
                  ))
                ) : (
                  <li className='px-3 py-2 text-muted-foreground italic'>
                    No classes for this course.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
          {/* Student Dropdown */}
          <div className='relative'>
            <label
              htmlFor='student-button'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Student
            </label>
            <button
              type='button'
              id='student-button'
              disabled={isSubmitting}
              onClick={() =>
                setOpenDropdown(openDropdown === 'student' ? null : 'student')
              }
              className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors'
            >
              <span
                className={clsx(
                  selectedStudentId
                    ? 'text-foreground'
                    : 'text-muted-foreground italic',
                )}
              >
                {selectedStudentName}
              </span>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  openDropdown === 'student'
                    ? 'rotate-180 text-primary'
                    : 'text-muted-foreground',
                )}
              />
            </button>
            {openDropdown === 'student' && (
              <div className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg'>
                <input
                  type='text'
                  placeholder='Search students...'
                  className='input w-full rounded-b-none border-x-0 border-t-0'
                  value={studentSearchTerm}
                  onChange={e => setStudentSearchTerm(e.target.value)}
                />
                <ul className='max-h-60 overflow-y-auto'>
                  {filteredStudentsForDropdown.map(student => (
                    <li
                      key={student.id}
                      onClick={() => handleSelectStudent(student.id)}
                      className={clsx(
                        'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                        selectedStudentId === student.id
                          ? 'bg-primary/20 text-primary-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {student.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Student Count Label */}
          <div className='text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>
              {isLoadingEnrolledStudents ? '...' : enrolledStudents.length}
            </span>{' '}
            students enrolled in this class.
          </div>
        </div>

        {error && (
          <p className='text-red-500 text-sm'>Error: {error.message}</p>
        )}

        <button
          type='submit'
          className='btn btn-primary'
          disabled={!selectedStudentId || !selectedStudyClassId || isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe Student to Study Class'}
        </button>
      </form>

      {/* --- Enrolled Student List --- */}
      {selectedStudyClass && (
        <div className='space-y-4'>
          {/* --- Student Search --- */}
          <div>
            <label
              htmlFor='table-search'
              className='block text-sm font-medium text-foreground/80 mb-1'
            >
              Student Name
            </label>
            <input
              type='text'
              id='table-search'
              placeholder='Search enrolled students...'
              className='input max-w-sm'
              value={tableSearchTerm}
              onChange={e => setTableSearchTerm(e.target.value)}
            />
          </div>

          {/* --- Class Info Label --- */}
          <div className='card p-4 text-sm text-foreground/80 space-x-4'>
            <span>
              <strong>Year:</strong> {selectedStudyClass.year}
            </span>
            <span>
              <strong>Semester:</strong> {selectedStudyClass.semester}
            </span>
            <span>
              <strong>Course:</strong> {selectedStudyClass.courseName}
            </span>
            <span>
              <strong>Professor:</strong>{' '}
              {selectedStudyClass.professorName || 'Not Assigned'}
            </span>
          </div>

          {/* --- Enrolled Students Table --- */}
          {isLoadingEnrolledStudents ? (
            <div className='text-center'>
              <SpinLoader />
            </div>
          ) : currentEnrolledStudents.length > 0 ? (
            <div className='space-y-4'>
              <div className='overflow-x-auto bg-card-background rounded-lg border border-border shadow'>
                <table className='min-w-full border-collapse'>
                  <thead>
                    <tr className='border-b border-border'>
                      {[
                        { label: 'ID', key: 'id' },
                        { label: 'Name', key: 'name' },
                        { label: 'E-mail', key: 'email' },
                        { label: 'Register (CPF)', key: 'register' },
                      ].map(header => (
                        <th
                          key={header.key}
                          className='py-3 px-4 text-left text-foreground/80 cursor-pointer hover:text-foreground'
                          onClick={() =>
                            requestSort(header.key as keyof Student)
                          }
                        >
                          <span className='flex items-center gap-2'>
                            {header.label}
                            {getSortIcon(header.key as keyof Student)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentEnrolledStudents.map(student => (
                      <tr
                        key={student.id}
                        className='hover:bg-foreground/5 border-b border-border'
                      >
                        <td className='py-3 px-4 text-foreground text-left'>
                          {student.id}
                        </td>
                        <td className='py-3 px-4 text-foreground text-left'>
                          {student.name}
                        </td>
                        <td className='py-3 px-4 text-foreground text-left'>
                          {student.email}
                        </td>
                        <td className='py-3 px-4 text-foreground text-left'>
                          {student.register}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className='flex items-center justify-between'>
                {/* Pagination Length Dropdown */}
                <div className='relative'>
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
                    <ul className='absolute z-20 bottom-full mb-1 w-full sm:w-36 bg-card-background border border-border rounded-lg shadow-lg overflow-hidden'>
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

                {/* Pagination Buttons */}
                <div className='flex justify-center'>
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
                        sortedEnrolledStudents.length / paginationLength,
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
                      Math.ceil(
                        sortedEnrolledStudents.length / paginationLength,
                      )
                    }
                    className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='card text-center p-6'>
              <p className='text-foreground/70'>No students found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
