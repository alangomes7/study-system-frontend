'use client';

import { useRouter } from 'next/navigation';
import { useStudentsPageStore } from '@/stores/useStudentsPageStore';
import { Student } from '@/types';

export function useStudentsPageHandlers() {
  const router = useRouter();
  const {
    setSearchTerm,
    setPagination,
    setOpenDropdown,
    setSortConfig,
    openDropdown,
  } = useStudentsPageStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(1);
  };

  const handlePaginationLengthChange = (length: number) => {
    setPagination(1, length);
  };

  const paginate = (pageNumber: number) => {
    setPagination(pageNumber);
  };

  const handleRowClick = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  const handleSort = (key: keyof Student) => {
    setSortConfig(key);
  };

  return {
    ui: { openDropdown },
    handleSearchChange,
    handlePaginationLengthChange,
    paginate,
    handleRowClick,
    setOpenDropdown,
    handleSort,
  };
}
