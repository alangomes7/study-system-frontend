'use client';

import { useCreateUserStore } from '@/stores';
import { UserType } from '@/types';

export function useCreateUserData() {
  const selectedUserType = useCreateUserStore(state => state.selectedUserType);
  const isDropdownOpen = useCreateUserStore(state => state.isDropdownOpen);

  const options: UserType[] = ['User', 'ADMIN'];

  // Default to 'User' so the form renders (but submit is disabled until selection)
  const formUserType: UserType = selectedUserType || 'User';

  return {
    selectedUserType,
    isDropdownOpen,
    options,
    formUserType,
  };
}
