'use client';

import { useState, useEffect, useMemo } from 'react';
import { StudyClass } from '@/types/study-class';
import { Student } from '@/types/student';
import {
  getAllStudyClasses,
  getStudentsInBatches,
  getSubscriptionsByStudyClass,
  createStudyClass,
  getProfessors,
  getCourses,
  getStudyClass,
  enrollProfessorInStudyClass,
  getAllStudents,
  createSubscription,
} from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import { Professor } from '@/types/professor';

export function useStudyClasses() {
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
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

  // Memoize: Filtered study classes
  const filteredStudyClasses = useMemo(() => {
    // Only show classes if a search term is entered
    if (studyClassSearchTerm.trim() === '') {
      return [];
    }
    return studyClasses.filter(sc =>
      sc.classCode
        .toLowerCase()
        .includes(studyClassSearchTerm.toLowerCase().trim()),
    );
  }, [studyClasses, studyClassSearchTerm]);

  // Effect to fetch students when a study class is selected
  useEffect(() => {
    if (!selectedStudyClass) {
      setStudents([]);
      return;
    }

    async function fetchStudents() {
      setIsStudentsLoading(true);
      try {
        const subscriptions = await getSubscriptionsByStudyClass(
          selectedStudyClass!.id,
        );
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

  // Memoize: Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()),
    );
  }, [students, studentSearchTerm]);

  // Memoize: Paginated students
  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  // Effect to reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [studentSearchTerm, paginationLength]);

  // --- Handlers ---

  const handleStudyClassClick = (studyClass: StudyClass) => {
    if (selectedStudyClass?.id === studyClass.id) return; // Prevent refetch
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
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return {
    isLoading,
    isStudentsLoading,
    studyClasses,
    selectedStudyClass,
    filteredStudyClasses,
    students,
    filteredStudents,
    currentStudents,
    studentSearchTerm,
    setStudentSearchTerm,
    studyClassSearchTerm,
    setStudyClassSearchTerm,
    currentPage,
    paginationLength,
    handleStudyClassClick,
    handleStudyClassDeselect,
    handlePaginationLengthChange,
    paginate,
  };
}

/**
 * Hook for managing the creation of a new study class.
 */
export function useCreateStudyClass() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  // const [classCode, setClassCode] = useState(''); // <-- REMOVED
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>(''); // Form state is string
  const [professorId, setProfessorId] = useState<string>(''); // Form state is string
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const router = useRouter();

  // Fetch data for dropdowns
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [coursesData, professorsData] = await Promise.all([
          getCourses(),
          getProfessors(),
        ]);
        setCourses(coursesData);
        setProfessors(professorsData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      setError('Please select a course.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createStudyClass({
        year,
        semester,
        courseId: Number(courseId),
        professorId: professorId ? Number(professorId) : null,
      });
      router.push('/study-classes'); // Navigate on success
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    courses,
    professors,
    // classCode, // <-- REMOVED
    // setClassCode, // <-- REMOVED
    year,
    setYear,
    semester,
    setSemester,
    courseId,
    setCourseId,
    professorId,
    setProfessorId,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}

/**
 * Hook for managing the professor enrollment page.
 * @param studyClassId The ID of the study class to enroll a professor into.
 */
export function useEnrollProfessor(studyClassId: string | number) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [studyClass, setStudyClass] = useState<StudyClass | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Effect to fetch study class and professor list
  useEffect(() => {
    // Ensure ID is valid before fetching
    if (!studyClassId) {
      setIsLoading(false);
      setError('No Study Class ID provided.');
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch professors and the specific study class concurrently
        const [professorsData, studyClassData] = await Promise.all([
          getProfessors(),
          getStudyClass(Number(studyClassId)), // Ensure ID is a number
        ]);
        setProfessors(professorsData);
        setStudyClass(studyClassData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [studyClassId]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessor) {
      setError('Please select a professor to enroll.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await enrollProfessorInStudyClass(studyClassId, selectedProfessor);
      router.push(`/study-classes/${studyClassId}`); // Navigate on success
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    professors,
    studyClass,
    selectedProfessor,
    setSelectedProfessor,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}

/**
 * Hook for managing the student enrollment page.
 * @param studyClassId The ID of the study class to enroll a student into.
 */
export function useEnrollStudent(studyClassId: string | number) {
  const [students, setStudents] = useState<Student[]>([]);
  const [studyClass, setStudyClass] = useState<StudyClass | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Effect to fetch study class and student list
  useEffect(() => {
    if (!studyClassId) {
      setIsLoading(false);
      setError('No Study Class ID provided.');
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [studentsData, studyClassData] = await Promise.all([
          getAllStudents(),
          getStudyClass(Number(studyClassId)),
        ]);
        setStudents(studentsData);
        setStudyClass(studyClassData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [studyClassId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student to enroll.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createSubscription({
        studentId: Number(selectedStudent),
        studyClassId: Number(studyClassId),
      });
      router.push(`/study-classes/${studyClassId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    students,
    studyClass,
    selectedStudent,
    setSelectedStudent,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}
