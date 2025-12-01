import { create } from 'zustand';

type DropdownType = 'course' | 'class' | 'subscription' | null;

interface DeleteSubscriptionState {
  selectedCourseId: number | null;
  selectedStudyClassId: number | null;
  selectedSubscriptionId: number | null;
  openDropdown: DropdownType;

  setSelectedCourseId: (id: number | null) => void;
  setSelectedStudyClassId: (id: number | null) => void;
  setSelectedSubscriptionId: (id: number | null) => void;
  setOpenDropdown: (type: DropdownType) => void;
  reset: () => void;
}

export const useDeleteSubscriptionStore = create<DeleteSubscriptionState>(
  set => ({
    selectedCourseId: null,
    selectedStudyClassId: null,
    selectedSubscriptionId: null,
    openDropdown: null,

    setSelectedCourseId: id =>
      set({
        selectedCourseId: id,
        selectedStudyClassId: null,
        selectedSubscriptionId: null,
        openDropdown: null,
      }),
    setSelectedStudyClassId: id =>
      set({
        selectedStudyClassId: id,
        selectedSubscriptionId: null,
        openDropdown: null,
      }),
    setSelectedSubscriptionId: id =>
      set({
        selectedSubscriptionId: id,
        openDropdown: null,
      }),
    setOpenDropdown: type => set({ openDropdown: type }),
    reset: () =>
      set({
        selectedCourseId: null,
        selectedStudyClassId: null,
        selectedSubscriptionId: null,
        openDropdown: null,
      }),
  }),
);
