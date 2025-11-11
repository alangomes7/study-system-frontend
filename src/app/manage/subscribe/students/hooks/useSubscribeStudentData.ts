import { useState, useMemo } from 'react';
import {
  useGetCourses,
  useGetStudyClassesByCourse,
  useGetAllStudents,
  useGetStudentsByStudyClass,
  useCreateSubscription,
} from '@/hooks';
import { SortConfig, Student, DropdownType } from '../types';
import { useSubscribeStudentHandlers } from './useSubscribeStudentHandlers';

export function useSubscribeStudentData() {
  // --- Core State ---
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedStudyClassId, setSelectedStudyClassId] = useState<
    number | null
  >(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
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
  const { data: enrolledStudents = [], error: enrolledStudentsError } =
    useGetStudentsByStudyClass(selectedStudyClassId);
  const {
    mutateAsync: createSubscriptionMutate,
    isPending: isSubmitting,
    error: mutationError,
  } = useCreateSubscription();

  const createSubscriptionAdapter = async (
    studentId: number,
    studyClassId: number,
  ) => {
    await createSubscriptionMutate({ studentId, studyClassId });
  };

  const isLoading =
    isLoadingCourses || isLoadingAllStudents || isLoadingStudyClasses;
  const error =
    coursesError ||
    allStudentsError ||
    studyClassesError ||
    enrolledStudentsError ||
    mutationError;

  // --- Derived Data ---
  const selectedStudyClass = useMemo(
    () => studyClasses.find(sc => sc.id === selectedStudyClassId) || null,
    [studyClasses, selectedStudyClassId],
  );

  const filteredStudentsForDropdown = useMemo(
    () =>
      allStudents.filter(student =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
      ),
    [allStudents, studentSearchTerm],
  );

  const filteredEnrolledStudents = useMemo(
    () =>
      enrolledStudents.filter(student =>
        student.name.toLowerCase().includes(tableSearchTerm.toLowerCase()),
      ),
    [enrolledStudents, tableSearchTerm],
  );

  const sortedEnrolledStudents = useMemo(() => {
    const sortableStudents = [...filteredEnrolledStudents];

    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        const key = sortConfig.key;

        if (a[key] < b[key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableStudents;
  }, [filteredEnrolledStudents, sortConfig]);

  const indexOfLastStudent = currentPage * paginationLength;
  const indexOfFirstStudent = indexOfLastStudent - paginationLength;
  const currentEnrolledStudents = sortedEnrolledStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  // --- Base handlers from the hook ---
  const baseHandlers = useSubscribeStudentHandlers({
    setSelectedCourseId,
    setSelectedStudyClassId,
    setSelectedStudentId,
    setOpenDropdown,
    setCurrentPage,
    setPaginationLength,
    setSortConfig,
    setStudentSearchTerm,
    setTableSearchTerm,
    createSubscription: createSubscriptionAdapter,
  });

  const handlers = {
    ...baseHandlers,
    setStudentSearchTerm,
    setTableSearchTerm,
    setOpenDropdown,
  };

  const computed = {
    courses,
    studyClasses,
    allStudents,
    enrolledStudents,
    filteredStudentsForDropdown,
    filteredEnrolledStudents,
    sortedEnrolledStudents,
    currentEnrolledStudents,
    selectedCourseId,
    selectedStudyClassId,
    selectedStudentId,
    openDropdown,
    studentSearchTerm,
    tableSearchTerm,
    paginationLength,
    sortConfig,
    isSubmitting,
    currentPage,
    isLoadingEnrolledStudents: isLoadingStudyClasses,
  };

  return {
    isLoading,
    error,
    selectedStudyClass,
    enrolledStudents: currentEnrolledStudents,
    handlers,
    computed,
  };
}
