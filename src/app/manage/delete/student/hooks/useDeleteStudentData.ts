'use client';

import { useMemo } from 'react';
import { useGetAllStudents } from '@/hooks';
import { useDeleteStudentStore } from '@/stores/deleteStudent';

export function useDeleteStudentData() {
  const { selectedStudentId, searchTerm, isDropdownOpen } =
    useDeleteStudentStore();
  const { data: students = [], isLoading, error } = useGetAllStudents();

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const selectedStudent = useMemo(
    () => students.find(s => s.id === selectedStudentId) || null,
    [students, selectedStudentId],
  );

  return {
    students,
    filteredStudents,
    selectedStudent,
    selectedStudentId,
    searchTerm,
    isDropdownOpen,
    isLoading,
    error,
  };
}
