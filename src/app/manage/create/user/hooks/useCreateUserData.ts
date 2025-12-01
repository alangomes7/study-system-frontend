'use client';

import { useCreateUserStore } from '@/stores';
import { UserType } from '@/types';

export function useCreateUserData() {
  const selectedUserType = useCreateUserStore(state => state.selectedUserType);
  const isDropdownOpen = useCreateUserStore(state => state.isDropdownOpen);

  const options: UserType[] = ['User', 'ADMIN'];

  const formUserType: UserType = selectedUserType || 'User';

  return {
    selectedUserType,
    isDropdownOpen,
    options,
    formUserType,
  };
}
