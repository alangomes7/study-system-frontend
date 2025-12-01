import { StateCreator } from 'zustand';
import { StudentsPageState, PaginationSlice } from './types';

export const createPaginationSlice: StateCreator<
  StudentsPageState,
  [],
  [],
  PaginationSlice
> = set => ({
  currentPage: 1,
  paginationLength: 10,
  openDropdown: null,
  setPagination: (currentPage, paginationLength) =>
    set(state => ({
      currentPage,
      paginationLength: paginationLength ?? state.paginationLength,
      openDropdown: null,
    })),
  setOpenDropdown: openDropdown => set({ openDropdown }),
});
