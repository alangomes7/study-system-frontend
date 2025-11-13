'use client';

import { useMemo } from 'react';
import { useGetAllStudents } from '@/hooks';
import { useStudentsPageStore } from '@/stores/studentsPage';

export function useStudentsPageData() {
  const { searchTerm, currentPage, paginationLength, sortConfig } =
    useStudentsPageStore();

  const { data: students = [], isLoading, error } = useGetAllStudents();

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const sortedStudents = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      const aVal = String(a[key] ?? '').toLowerCase();
      const bVal = String(b[key] ?? '').toLowerCase();
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortConfig]);

  const currentStudents = useMemo(() => {
    const lastIndex = currentPage * paginationLength;
    const firstIndex = lastIndex - paginationLength;
    return sortedStudents.slice(firstIndex, lastIndex);
  }, [sortedStudents, currentPage, paginationLength]);

  const totalPages = Math.ceil(sortedStudents.length / paginationLength);

  return {
    isLoading,
    error,
    data: {
      currentStudents,
      filteredStudents,
    },
    ui: {
      searchTerm,
      currentPage,
      paginationLength,
      totalPages,
      sortConfig,
    },
  };
}
