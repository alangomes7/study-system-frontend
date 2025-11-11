import { create } from 'zustand';
import { Student } from '@/types';

export type DropdownType =
  | 'course'
  | 'studyClass'
  | 'student'
  | 'pagination'
  | null;

export interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}

// 1. Define the shape of the UI state ONLY
interface SubscribeStudentUIState {
  // UI State
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedStudentId: number | null;
  openDropdown: DropdownType;
  studentSearchTerm: string;
  tableSearchTerm: string;
  currentPage: number;
  paginationLength: number;
  sortConfig: SortConfig<Student> | null;

  // Actions
  setDropdown: (dropdown: DropdownType) => void;
  setStudentSearchTerm: (term: string) => void;
  setTableSearchTerm: (term: string) => void;
  setPagination: (page: number, length?: number) => void;
  setSortConfig: (config: SortConfig<Student> | null) => void;
  selectCourse: (courseId: number | null) => void;
  selectStudyClass: (studyClassId: number | null) => void;
  selectStudent: (studentId: number | null) => void;
  resetStudentSelection: () => void;
}

export const useSubscribeStudentStore = create<SubscribeStudentUIState>(
  (set, get) => ({
    // --- Initial UI State ---
    selectedCourseId: null,
    selectedStudyClassId: null,
    selectedStudentId: null,
    openDropdown: null,
    studentSearchTerm: '',
    tableSearchTerm: '',
    currentPage: 1,
    paginationLength: 10,
    sortConfig: null,

    // --- UI Actions ---
    setDropdown: dropdown => set({ openDropdown: dropdown }),
    setStudentSearchTerm: term => set({ studentSearchTerm: term }),
    setTableSearchTerm: term => set({ tableSearchTerm: term }),
    setPagination: (page, length) => {
      set({
        currentPage: page,
        paginationLength: length ?? get().paginationLength,
        openDropdown: null, // Close dropdown on change
      });
    },
    setSortConfig: config => set({ sortConfig: config }),

    selectCourse: courseId => {
      set({
        selectedCourseId: courseId,
        selectedStudyClassId: null, // Reset dependent state
        selectedStudentId: null,
        openDropdown: null,
      });
    },

    selectStudyClass: studyClassId => {
      set({
        selectedStudyClassId: studyClassId,
        currentPage: 1, // Reset pagination
        openDropdown: null,
      });
    },

    selectStudent: studentId => {
      set({ selectedStudentId: studentId, openDropdown: null });
    },

    resetStudentSelection: () => {
      set({ selectedStudentId: null, studentSearchTerm: '' });
    },
  }),
);
