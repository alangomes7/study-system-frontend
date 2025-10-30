// src/hooks/useStudents.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '@/types/student';
import { createStudent, getAllStudents } from '@/lib/api';

/**
 * Hook for managing the list of students (fetching, filtering, pagination).
 */
export function useStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLength, setPaginationLength] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch all students on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const studentsData = await getAllStudents();
        setStudents(studentsData);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to fetch students. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []); // Runs once on mount

  // Memoize derived state: filteredStudents
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  // Memoize derived state: currentStudents for pagination
  const currentStudents = useMemo(() => {
    const indexOfLastStudent = currentPage * paginationLength;
    const indexOfFirstStudent = indexOfLastStudent - paginationLength;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  }, [filteredStudents, currentPage, paginationLength]);

  // Effect to reset page number when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paginationLength]);

  // --- Handlers ---

  const handlePaginationLengthChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaginationLength(Number(e.target.value));
  };

  const handleRowClick = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Return all state and functions needed by the component
  return {
    isLoading,
    error,
    filteredStudents,
    currentStudents,
    currentPage,
    paginationLength,
    searchTerm,
    setSearchTerm,
    handlePaginationLengthChange,
    handleRowClick,
    paginate,
  };
}

/**
 * Hook for managing the creation of a new student.
 */
export function useCreateStudent() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [register, setRegister] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createStudent({ name, phone, email, register });
      router.push('/students'); // Navigate on success
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    register,
    setRegister,
    error,
    isSubmitting,
    handleSubmit,
  };
}
