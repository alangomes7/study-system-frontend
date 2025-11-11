// src/stores/useSubscribeStudentStore.ts
import { create } from 'zustand';
import {
  getCourses,
  getStudyClassesByCourse,
  getAllStudents,
  getSubscriptionsByStudyClass,
  getStudentsInBatches,
  createSubscription as apiCreateSubscription,
} from '@/lib/api'; //
import { Course, StudyClass, Student, SubscriptionCreationData } from '@/types';

// Define the shape of your state
interface SubscribeStudentState {
  // UI State
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedStudentId: number | null;
  openDropdown: 'course' | 'studyClass' | 'student' | 'pagination' | null;
  studentSearchTerm: string;
  tableSearchTerm: string;
  currentPage: number;
  paginationLength: number;
  sortConfig: {
    key: keyof Student;
    direction: 'ascending' | 'descending';
  } | null;

  // Data & Server State
  courses: Course[];
  studyClasses: StudyClass[];
  allStudents: Student[];
  enrolledStudents: Student[];

  // Loading States
  isLoadingCourses: boolean;
  isLoadingStudyClasses: boolean;
  isLoadingAllStudents: boolean;
  isLoadingEnrolledStudents: boolean;
  isSubmitting: boolean;

  // Error States
  coursesError: Error | null;
  studyClassesError: Error | null;
  allStudentsError: Error | null;
  enrolledStudentsError: Error | null;
  mutationError: Error | null;

  // Actions (functions to update state)
  setDropdown: (
    dropdown: 'course' | 'studyClass' | 'student' | 'pagination' | null,
  ) => void;
  setSearchTerms: (type: 'student' | 'table', term: string) => void;
  setPagination: (page: number, length?: number) => void;
  setSortConfig: (
    config: {
      key: keyof Student;
      direction: 'ascending' | 'descending';
    } | null,
  ) => void;

  selectCourse: (courseId: number | null) => void;
  selectStudyClass: (studyClassId: number | null) => void;
  selectStudent: (studentId: number | null) => void;

  // Data Fetching Actions
  fetchCourses: () => Promise<void>;
  fetchStudyClasses: (courseId: number) => Promise<void>;
  fetchAllStudents: () => Promise<void>;
  fetchEnrolledStudents: (studyClassId: number) => Promise<void>;
  createSubscription: () => Promise<void>;
}

export const useSubscribeStudentStore = create<SubscribeStudentState>(
  (set, get) => ({
    // --- Initial State ---
    selectedCourseId: null,
    selectedStudyClassId: null,
    selectedStudentId: null,
    openDropdown: null,
    studentSearchTerm: '',
    tableSearchTerm: '',
    currentPage: 1,
    paginationLength: 10,
    sortConfig: null,

    courses: [],
    studyClasses: [],
    allStudents: [],
    enrolledStudents: [],

    isLoadingCourses: false,
    isLoadingStudyClasses: false,
    isLoadingAllStudents: false,
    isLoadingEnrolledStudents: false,
    isSubmitting: false,

    coursesError: null,
    studyClassesError: null,
    allStudentsError: null,
    enrolledStudentsError: null,
    mutationError: null,

    // --- UI Actions ---
    setDropdown: dropdown => set({ openDropdown: dropdown }),
    setSearchTerms: (type, term) => {
      if (type === 'student') set({ studentSearchTerm: term });
      if (type === 'table') set({ tableSearchTerm: term });
    },
    setPagination: (page, length) => {
      set({
        currentPage: page,
        paginationLength: length ?? get().paginationLength,
      });
    },
    setSortConfig: config => set({ sortConfig: config }),

    selectCourse: courseId => {
      set({
        selectedCourseId: courseId,
        selectedStudyClassId: null,
        selectedStudentId: null,
        enrolledStudents: [],
      });
      if (courseId) {
        get().fetchStudyClasses(courseId);
      } else {
        set({ studyClasses: [] });
      }
    },

    selectStudyClass: studyClassId => {
      set({ selectedStudyClassId: studyClassId, currentPage: 1 });
      if (studyClassId) {
        get().fetchEnrolledStudents(studyClassId);
      } else {
        set({ enrolledStudents: [] });
      }
    },

    selectStudent: studentId => set({ selectedStudentId: studentId }),

    // --- Data Fetching Actions ---
    fetchCourses: async () => {
      set({ isLoadingCourses: true, coursesError: null });
      try {
        const courses = await getCourses();
        set({ courses, isLoadingCourses: false });
      } catch (error) {
        set({ coursesError: error as Error, isLoadingCourses: false });
      }
    },

    fetchStudyClasses: async (courseId: number) => {
      set({ isLoadingStudyClasses: true, studyClassesError: null });
      try {
        const studyClasses = await getStudyClassesByCourse(String(courseId)); //
        set({ studyClasses, isLoadingStudyClasses: false });
      } catch (error) {
        set({
          studyClassesError: error as Error,
          isLoadingStudyClasses: false,
        });
      }
    },

    fetchAllStudents: async () => {
      set({ isLoadingAllStudents: true, allStudentsError: null });
      try {
        const allStudents = await getAllStudents(); //
        set({ allStudents, isLoadingAllStudents: false });
      } catch (error) {
        set({ allStudentsError: error as Error, isLoadingAllStudents: false });
      }
    },

    fetchEnrolledStudents: async (studyClassId: number) => {
      set({ isLoadingEnrolledStudents: true, enrolledStudentsError: null });
      try {
        // This logic mirrors the 'useGetStudentsByStudyClass' hook
        const subscriptions = await getSubscriptionsByStudyClass(studyClassId); //
        if (subscriptions.length === 0) {
          set({ enrolledStudents: [], isLoadingEnrolledStudents: false });
          return;
        }
        const students = await getStudentsInBatches(subscriptions); //
        set({ enrolledStudents: students, isLoadingEnrolledStudents: false });
      } catch (error) {
        set({
          enrolledStudentsError: error as Error,
          isLoadingEnrolledStudents: false,
        });
      }
    },

    createSubscription: async () => {
      const { selectedStudentId, selectedStudyClassId } = get();
      if (!selectedStudentId || !selectedStudyClassId) return;

      set({ isSubmitting: true, mutationError: null });
      try {
        const data: SubscriptionCreationData = {
          studentId: selectedStudentId,
          studyClassId: selectedStudyClassId,
        };
        await apiCreateSubscription(data); //
        set({
          isSubmitting: false,
          selectedStudentId: null,
          studentSearchTerm: '',
        });
        // On success, refresh the enrolled students list
        await get().fetchEnrolledStudents(selectedStudyClassId);
      } catch (error) {
        set({ mutationError: error as Error, isSubmitting: false });
      }
    },
  }),
);
