'use client';

import { useDeleteStudentStore } from '@/stores/deleteStudent';
import { useDeleteStudent } from '@/hooks';
import { DialogPopup } from '@/components';
import { ChangeEvent } from 'react';

export function useDeleteStudentHandlers() {
  const selectedStudentId = useDeleteStudentStore(s => s.selectedStudentId);
  const isDropdownOpen = useDeleteStudentStore(s => s.isDropdownOpen);

  const setSelectedStudentId = useDeleteStudentStore(
    s => s.setSelectedStudentId,
  );
  const setSearchTerm = useDeleteStudentStore(s => s.setSearchTerm);
  const setIsDropdownOpen = useDeleteStudentStore(s => s.setIsDropdownOpen);
  const reset = useDeleteStudentStore(s => s.reset);

  const { mutateAsync: deleteStudent, isPending: isDeleting } =
    useDeleteStudent();

  const handleSelect = (id: number) => {
    setSelectedStudentId(id);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const executeDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      DialogPopup.success('Student deleted successfully');
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete student';
      DialogPopup.error(errorMessage);
    }
  };

  const handleDelete = () => {
    if (!selectedStudentId) return;

    DialogPopup.confirm(
      'Are you sure you want to delete this student? This action cannot be undone.',
      confirmation => {
        if (confirmation) {
          void executeDelete(selectedStudentId);
        }
      },
    );
  };

  return {
    handleSelect,
    toggleDropdown,
    handleSearch,
    handleDelete,
    isDeleting,
    selectedStudentId,
  };
}
