import { create } from 'zustand';
import { createFilterSlice } from './filterSlice';
import { createPaginationSlice } from './paginationSlice';
import { createSortSlice } from './sortSlice';
import { StudentsPageState } from './types';

export * from './types';
export * from './filterSlice';
export * from './paginationSlice';
export * from './sortSlice';

/**
 * Creates the Zustand store for the students page by combining all slices.
 */
export const useStudentsPageStore = create<StudentsPageState>()((...a) => ({
  ...createFilterSlice(...a),
  ...createPaginationSlice(...a),
  ...createSortSlice(...a),
}));
