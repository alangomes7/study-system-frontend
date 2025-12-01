'use client';

import { useDeleteStudentStore } from '@/stores/deleteStudent';
import { useDeleteStudent } from '@/hooks';
import { toast } from 'react-toastify';

export function useDeleteStudentHandlers() {
  const { setSelectedStudentId, setSearchTerm, setIsDropdownOpen, reset } =
    useDeleteStudentStore();

  const { mutateAsync: deleteStudent, isPending: isDeleting } =
    useDeleteStudent();

  const handleSelect = (id: number) => {
    setSelectedStudentId(id);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!useDeleteStudentStore.getState().isDropdownOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async () => {
    const id = useDeleteStudentStore.getState().selectedStudentId;
    if (!id) return;

    if (
      confirm(
        'Are you sure you want to delete this student? This action cannot be undone.',
      )
    ) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted successfully');
        reset();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete student');
      }
    }
  };

  return {
    handleSelect,
    toggleDropdown,
    handleSearch,
    handleDelete,
    isDeleting,
  };
}
