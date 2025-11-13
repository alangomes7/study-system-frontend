import { create } from 'zustand';
import { SortConfig } from './types';
import { Student } from '@/types';

/**
 * Interface for the enrolled students table's state.
 */
interface EnrolledTableState {
  // UI State
  tableSearchTerm: string;
  currentPage: number;
  paginationLength: number;
  sortConfig: SortConfig<Student> | null;

  // Actions
  setTableSearchTerm: (term: string) => void;
  setPagination: (page: number, length?: number) => void;
  setSortConfig: (config: SortConfig<Student> | null) => void;
}

/**
 * Zustand store for managing the UI state of the enrolled students table
 * (search, pagination, and sorting).
 */
export const useEnrolledTableStore = create<EnrolledTableState>((set, get) => ({
  // --- Initial UI State ---
  tableSearchTerm: '',
  currentPage: 1,
  paginationLength: 10,
  sortConfig: null,

  // --- UI Actions ---
  setTableSearchTerm: term => set({ tableSearchTerm: term }),

  /**
   * Sets the pagination state for the table.
   */
  setPagination: (page, length) => {
    set({
      currentPage: page,
      paginationLength: length ?? get().paginationLength,
    });
  },

  /**
   * Sets the sort configuration for the table.
   */
  setSortConfig: config => set({ sortConfig: config }),
}));
