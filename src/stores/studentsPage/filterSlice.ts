import { StateCreator } from 'zustand';
import { StudentsPageState, FilterSlice } from './types';

export const createFilterSlice: StateCreator<
  StudentsPageState,
  [],
  [],
  FilterSlice
> = (set, get) => ({
  searchTerm: '',
  setSearchTerm: term => {
    set({ searchTerm: term });
    // This is where we handle the coupled logic:
    // Calling setSearchTerm also resets pagination.
    get().setPagination(1);
  },
});
