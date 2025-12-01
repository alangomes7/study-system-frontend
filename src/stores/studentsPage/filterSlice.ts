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
    get().setPagination(1);
  },
});
