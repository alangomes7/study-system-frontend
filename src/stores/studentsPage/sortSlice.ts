import { StateCreator } from 'zustand';
import { StudentsPageState, SortSlice } from './types';

export const createSortSlice: StateCreator<
  StudentsPageState,
  [],
  [],
  SortSlice
> = set => ({
  sortConfig: { key: null, direction: 'asc' },
  setSortConfig: key =>
    set(state => {
      // Toggle direction if the same key is clicked
      if (state.sortConfig.key === key) {
        return {
          sortConfig: {
            key,
            direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
          },
        };
      }
      // Otherwise, set new key and default to 'asc'
      return { sortConfig: { key, direction: 'asc' } };
    }),
});
