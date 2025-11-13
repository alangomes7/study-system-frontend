import { Student } from '@/types';

/**
 * Defines the sorting configuration for the students table.
 */
export type SortConfigStudent = {
  key: keyof Student | null;
  direction: 'asc' | 'desc';
};

/**
 * State and actions for filtering.
 */
export interface FilterSlice {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

/**
 * State and actions for pagination.
 */
export interface PaginationSlice {
  currentPage: number;
  paginationLength: number;
  openDropdown: string | null;
  setPagination: (page: number, length?: number) => void;
  setOpenDropdown: (value: string | null) => void;
}

/**
 * State and actions for sorting.
 */
export interface SortSlice {
  sortConfig: SortConfigStudent;
  setSortConfig: (key: keyof Student) => void;
}

/**
 * The combined state for the entire students page,
 * merging all individual slices.
 */
export type StudentsPageState = FilterSlice & PaginationSlice & SortSlice;
