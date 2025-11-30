'use client';

import { UserForm } from '@/components';
import { UserTypeDropdown } from './components/UserTypeDropdown';
import { useCreateUserData } from './hooks/useCreateUserData';
import { useCreateUserHandlers } from './hooks/useCreateUserHandlers';

export default function CreateUserClientPage() {
  const { selectedUserType, isDropdownOpen, options, formUserType } =
    useCreateUserData();

  const { handleSelect, handleToggleDropdown } = useCreateUserHandlers();

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6 text-foreground'>
        Create New {selectedUserType ? selectedUserType : 'User'} Account
      </h1>

      {/* Dropdown Component */}
      <UserTypeDropdown
        selectedUserType={selectedUserType}
        isDropdownOpen={isDropdownOpen}
        options={options}
        onSelect={handleSelect}
        onToggle={handleToggleDropdown}
      />

      {/* User Form Component */}
      <UserForm
        userType={formUserType}
        title='' // Title is handled by the H1 above
        submitLabel={`Create ${selectedUserType || 'User'}`}
        disableSubmit={!selectedUserType}
      />
    </div>
  );
}
