import { StateCreator } from 'zustand';
import { StudentsPageState, PaginationSlice } from './types';

export const createPaginationSlice: StateCreator<
  StudentsPageState,
  [],
  [],
  PaginationSlice
> = (set, get) => ({
  currentPage: 1,
  paginationLength: 10,
  openDropdown: null,
  setPagination: (currentPage, paginationLength) =>
    set(state => ({
      currentPage,
      paginationLength: paginationLength ?? state.paginationLength,
      openDropdown: null, // Close dropdown on pagination change
    })),
  setOpenDropdown: openDropdown => set({ openDropdown }),
});
