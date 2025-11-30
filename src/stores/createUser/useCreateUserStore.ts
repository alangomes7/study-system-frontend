import { create } from 'zustand';
import { UserType } from '@/types';

interface CreateUserState {
  selectedUserType: UserType | null;
  isDropdownOpen: boolean;

  setSelectedUserType: (type: UserType | null) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
  toggleDropdown: () => void;
}

export const useCreateUserStore = create<CreateUserState>(set => ({
  selectedUserType: null,
  isDropdownOpen: false,

  setSelectedUserType: type =>
    set({ selectedUserType: type, isDropdownOpen: false }),
  setIsDropdownOpen: isOpen => set({ isDropdownOpen: isOpen }),
  toggleDropdown: () =>
    set(state => ({ isDropdownOpen: !state.isDropdownOpen })),
}));
