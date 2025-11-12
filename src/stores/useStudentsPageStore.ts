import { Student } from '@/types';
import { create } from 'zustand';

type SortConfig = {
  key: keyof Student | null;
  direction: 'asc' | 'desc';
};

type StudentsPageState = {
  searchTerm: string;
  currentPage: number;
  paginationLength: number;
  openDropdown: string | null;
  sortConfig: SortConfig;
  setSearchTerm: (term: string) => void;
  setPagination: (page: number, length?: number) => void;
  setOpenDropdown: (value: string | null) => void;
  setSortConfig: (key: keyof Student) => void;
};

export const useStudentsPageStore = create<StudentsPageState>(set => ({
  searchTerm: '',
  currentPage: 1,
  paginationLength: 10,
  openDropdown: null,
  sortConfig: { key: null, direction: 'asc' },

  setSearchTerm: searchTerm => set({ searchTerm }),
  setPagination: (currentPage, paginationLength) =>
    set(state => ({
      currentPage,
      paginationLength: paginationLength ?? state.paginationLength,
    })),
  setOpenDropdown: openDropdown => set({ openDropdown }),
  setSortConfig: key =>
    set(state => {
      if (state.sortConfig.key === key) {
        return {
          sortConfig: {
            key,
            direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
          },
        };
      }
      return { sortConfig: { key, direction: 'asc' } };
    }),
}));
