import { create } from 'zustand';
import { DropdownType } from '@/stores';

/**
 * Interface for the subscription form's state.
 */
interface SubscribeFormState {
  // UI State
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedStudentId: number | null;
  openDropdown: DropdownType;
  studentSearchTerm: string;
  isSubmitting: boolean;

  // Actions
  setDropdown: (dropdown: DropdownType) => void;
  setStudentSearchTerm: (term: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  selectCourse: (courseId: number | null) => void;
  selectStudyClass: (studyClassId: number | null) => void;
  selectStudent: (studentId: number | null) => void;
  resetStudentSelection: () => void;
}

/**
 * Zustand store for managing the state of the student enrollment form.
 */
export const useSubscribeFormStore = create<SubscribeFormState>(set => ({
  // --- Initial UI State ---
  selectedCourseId: null,
  selectedStudyClassId: null,
  selectedStudentId: null,
  openDropdown: null,
  studentSearchTerm: '',
  isSubmitting: false,

  // --- UI Actions ---
  setDropdown: dropdown => set({ openDropdown: dropdown }),
  setStudentSearchTerm: term => set({ studentSearchTerm: term }),
  setIsSubmitting: isSubmitting => set({ isSubmitting }),

  /**
   * Selects a course and resets dependent class/student selections.
   */
  selectCourse: courseId => {
    set({
      selectedCourseId: courseId,
      selectedStudyClassId: null,
      selectedStudentId: null,
      openDropdown: null,
    });
  },

  /**
   * Selects a study class and resets the student selection.
   * Note: Any logic that resets the *table's* pagination
   * should now be handled by the component/hook that calls this action.
   */
  selectStudyClass: studyClassId => {
    set({
      selectedStudyClassId: studyClassId,
      selectedStudentId: null,
      openDropdown: null,
    });
  },

  /**
   * Selects a student.
   */
  selectStudent: studentId => {
    set({ selectedStudentId: studentId, openDropdown: null });
  },

  /**
   * Resets the student selection and search term in the form.
   */
  resetStudentSelection: () => {
    set({ selectedStudentId: null, studentSearchTerm: '' });
  },
}));
