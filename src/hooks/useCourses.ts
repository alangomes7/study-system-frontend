'use client';

import { useState, useEffect, useMemo } from 'react';
import { Course } from '@/types/course';
import { StudyClass } from '@/types/study-class';
import { Student } from '@/types/student';
import {
  getCourse,
  getStudentsInBatches,
  getStudyClassesByCourse,
  getSubscriptions,
} from '@/lib/api';
import { get } from 'http';

export function useCourses(id: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [studyClasses, setStudyClasses] = useState<StudyClass[]>([]);
  const [selectedStudyClass, setSelectedStudyClass] =
    useState<StudyClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studyClassSearchTerm, setStudyClassSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch initial course and study class data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const courseData = await getCourse(id);
        setCourse(courseData);
        const studyClassesData = await getStudyClassesByCourse(id);
        setStudyClasses(studyClassesData);
        if (studyClassesData.length > 0) {
          setSelectedStudyClass(studyClassesData[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch course data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Filter study classes based on search term
  const filteredStudyClasses = useMemo(() => {
    return studyClasses.filter(studyClass =>
      studyClass.classCode
        .toLowerCase()
        .includes(studyClassSearchTerm.toLowerCase()),
    );
  }, [studyClasses, studyClassSearchTerm]);

  // Effect to update selected class when filter changes
  useEffect(() => {
    if (
      filteredStudyClasses.length > 0 &&
      !filteredStudyClasses.find(sc => sc.id === selectedStudyClass?.id)
    ) {
      setSelectedStudyClass(filteredStudyClasses[0]);
    } else if (filteredStudyClasses.length === 0) {
      setSelectedStudyClass(null);
    }
  }, [
    studyClassSearchTerm,
    studyClasses,
    filteredStudyClasses,
    selectedStudyClass?.id,
  ]);

  // Effect to fetch students when a study class is selected
  useEffect(() => {
    if (!selectedStudyClass) {
      setStudents([]);
      return;
    }

    async function fetchStudents() {
      try {
        const subscriptions = await getSubscriptions(selectedStudyClass!.id);
        const studentData = await getStudentsInBatches(subscriptions);
        setStudents(studentData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      }
    }

    fetchStudents();
  }, [selectedStudyClass]);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, students]);

  // Pagination logic
  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  // Event Handlers
  const handleStudyClassClick = (studyClass: StudyClass) => {
    setSelectedStudyClass(studyClass);
  };

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Return all the values and functions your page component needs
  return {
    isLoading,
    error,
    course,
    selectedStudyClass,
    studyClassSearchTerm,
    setStudyClassSearchTerm,
    filteredStudyClasses,
    handleStudyClassClick,
    filteredStudents,
    currentStudents,
    currentPage,
    paginationLength,
    searchTerm,
    setSearchTerm,
    handlePaginationLengthChange,
    paginate,
  };
}
