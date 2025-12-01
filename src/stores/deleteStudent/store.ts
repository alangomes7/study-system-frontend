import { create } from 'zustand';

interface DeleteStudentState {
  selectedStudentId: number | null;
  searchTerm: string;
  isDropdownOpen: boolean;

  setSelectedStudentId: (id: number | null) => void;
  setSearchTerm: (term: string) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  reset: () => void;
}

export const useDeleteStudentStore = create<DeleteStudentState>(set => ({
  selectedStudentId: null,
  searchTerm: '',
  isDropdownOpen: false,

  setSelectedStudentId: id =>
    set({ selectedStudentId: id, isDropdownOpen: false }),
  setSearchTerm: term => set({ searchTerm: term }),
  setIsDropdownOpen: isOpen => set({ isDropdownOpen: isOpen }),
  reset: () =>
    set({ selectedStudentId: null, searchTerm: '', isDropdownOpen: false }),
}));
