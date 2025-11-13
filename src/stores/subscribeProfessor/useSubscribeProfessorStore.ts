import { create } from 'zustand';
import { DropdownType } from '@/stores';

/**
 * Interface for the professor enrollment form's state.
 */
interface SubscribeProfessorState {
  // UI State
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedProfessorId: number | null;
  openDropdown: DropdownType;
  professorSearchTerm: string;
  isSubmitting: boolean;

  // Actions
  setDropdown: (dropdown: DropdownType) => void;
  setProfessorSearchTerm: (term: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  selectCourse: (courseId: number | null) => void;
  selectStudyClass: (studyClassId: number | null) => void;
  selectProfessor: (professorId: number | null) => void;
  resetProfessorSelection: () => void;
}

/**
 * Zustand store for managing the state of the professor enrollment form.
 */
export const useSubscribeProfessorStore = create<SubscribeProfessorState>(
  set => ({
    // --- Initial UI State ---
    selectedCourseId: null,
    selectedStudyClassId: null,
    selectedProfessorId: null,
    openDropdown: null,
    professorSearchTerm: '',
    isSubmitting: false,

    // --- UI Actions ---
    setDropdown: dropdown => set({ openDropdown: dropdown }),
    setProfessorSearchTerm: term => set({ professorSearchTerm: term }),
    setIsSubmitting: isSubmitting => set({ isSubmitting }),

    /**
     * Selects a course and resets dependent class/professor selections.
     */
    selectCourse: courseId => {
      set({
        selectedCourseId: courseId,
        selectedStudyClassId: null, // Reset dependent state
        selectedProfessorId: null,
        openDropdown: null,
      });
    },

    /**
     * Selects a study class and resets the professor selection.
     */
    selectStudyClass: studyClassId => {
      set({
        selectedStudyClassId: studyClassId,
        selectedProfessorId: null,
        openDropdown: null,
      });
    },

    /**
     * Selects a professor.
     */
    selectProfessor: professorId => {
      set({ selectedProfessorId: professorId, openDropdown: null });
    },

    /**
     * Resets the professor selection and search term in the form.
     */
    resetProfessorSelection: () => {
      set({ selectedProfessorId: null, professorSearchTerm: '' });
    },
  }),
);
