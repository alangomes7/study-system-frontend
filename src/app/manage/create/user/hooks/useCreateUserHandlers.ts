'use client';

import { useCreateUserStore } from '@/stores';
import { UserType } from '@/types';

export function useCreateUserHandlers() {
  const setSelectedUserType = useCreateUserStore(
    state => state.setSelectedUserType,
  );
  const toggleDropdown = useCreateUserStore(state => state.toggleDropdown);
  const setIsDropdownOpen = useCreateUserStore(
    state => state.setIsDropdownOpen,
  );

  const handleSelect = (type: UserType) => {
    setSelectedUserType(type);
  };

  const handleToggleDropdown = () => {
    toggleDropdown();
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return {
    handleSelect,
    handleToggleDropdown,
    handleCloseDropdown,
  };
}
