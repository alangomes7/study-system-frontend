import { useMemo } from 'react';
import {
  useGetCourses,
  useGetStudyClassesByCourse,
  useGetAllStudents,
  useGetStudentsByStudyClass,
  useCreateSubscription,
} from '@/hooks';
import { useSubscribeFormStore, useEnrolledTableStore } from '@/stores';
import { Student } from '../types';

export function useSubscribeStudentData() {
  // --- UI State (from Zustand) ---
  const {
    selectedCourseId,
    selectedStudyClassId,
    selectedStudentId,
    openDropdown,
    studentSearchTerm,
    selectCourse,
    selectStudyClass,
    selectStudent,
    setDropdown,
    setStudentSearchTerm,
    resetStudentSelection,
  } = useSubscribeFormStore();

  const {
    tableSearchTerm,
    currentPage,
    paginationLength,
    sortConfig,
    setTableSearchTerm,
    setPagination,
    setSortConfig,
  } = useEnrolledTableStore();

  // --- Server State (from React Query) ---
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

  const {
    data: enrolledStudents = [],
    isLoading: isLoadingEnrolledStudents,
    error: enrolledStudentsError,
  } = useGetStudentsByStudyClass(selectedStudyClassId);

  // --- Mutation (from React Query) ---
  const {
    mutateAsync: createSubscriptionMutate,
    isPending: isSubmitting,
    error: mutationError,
  } = useCreateSubscription({
    onSuccess: () => {
      resetStudentSelection();
      setSortConfig({ key: 'id', direction: 'descending' });
    },
  });

  // --- Combined Loading & Error ---
  const isLoading =
    isLoadingCourses || isLoadingAllStudents || isLoadingStudyClasses;
  const error =
    coursesError ||
    allStudentsError ||
    studyClassesError ||
    enrolledStudentsError ||
    mutationError;

  // --- Event Handlers (Connecting Actions) ---

  const handleSelectCourse = (courseId: number) => {
    selectCourse(courseId);
  };

  const handleSelectStudyClass = (studyClassId: number) => {
    selectStudyClass(studyClassId);
  };

  const handleSelectStudent = (studentId: number) => {
    selectStudent(studentId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStudentId && selectedStudyClassId) {
      await createSubscriptionMutate({
        studentId: selectedStudentId,
        studyClassId: selectedStudyClassId,
      });
    }
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

  const handlePaginationLengthChange = (length: number) => {
    setPagination(1, length);
  };

  const paginate = (pageNumber: number) => {
    setPagination(pageNumber);
  };

  // --- Derived Data (Memos) ---
  const selectedStudyClass = useMemo(
    () => studyClasses.find(sc => sc.id === selectedStudyClassId) || null,
    [studyClasses, selectedStudyClassId],
  );

  // Create a Set of enrolled student IDs for efficient lookup
  const enrolledStudentIds = useMemo(
    () => new Set(enrolledStudents.map(s => s.id)),
    [enrolledStudents],
  );

  const filteredStudentsForDropdown = useMemo(
    () =>
      allStudents.filter(
        student =>
          // Filter 1: Student is not already enrolled
          !enrolledStudentIds.has(student.id) &&
          // Filter 2: Student name matches search term
          student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
      ),
    [allStudents, studentSearchTerm, enrolledStudentIds],
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
        // Handle 'id' sorting as numbers ---
        if (sortConfig.key === 'id') {
          return sortConfig.direction === 'ascending'
            ? a.id - b.id
            : b.id - a.id;
        }

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

  const currentEnrolledStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return sortedEnrolledStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent,
    );
  }, [sortedEnrolledStudents, currentPage, paginationLength]);

  // --- Return Values ---
  const handlers = {
    handleSelectCourse,
    handleSelectStudyClass,
    handleSelectStudent,
    handleSubmit,
    requestSort,
    handlePaginationLengthChange,
    paginate,
  };

  const computed = {
    courses,
    studyClasses,
    allStudents,
    filteredStudentsForDropdown,
    filteredEnrolledStudents,
    sortedEnrolledStudents,
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
    isLoadingEnrolledStudents,
    enrolledStudents: filteredEnrolledStudents,
    setStudentSearchTerm,
    setTableSearchTerm,
    setOpenDropdown: setDropdown,
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
