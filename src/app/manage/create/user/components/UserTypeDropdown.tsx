'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { UserType } from '@/types';

interface UserTypeDropdownProps {
  selectedUserType: UserType | null;
  isDropdownOpen: boolean;
  options: UserType[];
  onSelect: (type: UserType) => void;
  onToggle: () => void;
}

export function UserTypeDropdown({
  selectedUserType,
  isDropdownOpen,
  options,
  onSelect,
  onToggle,
}: UserTypeDropdownProps) {
  return (
    <div className='card p-6 mb-6 bg-card-background border border-border shadow-sm rounded-lg'>
      <label className='block text-sm font-medium text-foreground/80 mb-2'>
        Select Account Type
      </label>
      <div className='relative max-w-xs'>
        <button
          type='button'
          onClick={onToggle}
          className='w-full bg-card-background border border-border text-foreground rounded-md px-4 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
        >
          <span
            className={clsx(
              selectedUserType
                ? 'text-foreground font-medium'
                : 'text-muted-foreground italic',
            )}
          >
            {selectedUserType || '-- Select Type --'}
          </span>
          <ChevronDown
            className={clsx(
              'w-4 h-4 transition-transform duration-200',
              isDropdownOpen
                ? 'rotate-180 text-primary'
                : 'text-muted-foreground',
            )}
          />
        </button>

        {isDropdownOpen && (
          <ul className='absolute z-10 mt-1 w-full bg-card-background border border-border rounded-md shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
            {options.map(option => (
              <li
                key={option}
                onClick={() => onSelect(option)}
                className={clsx(
                  'px-4 py-2 cursor-pointer transition-colors',
                  selectedUserType === option
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-foreground hover:bg-primary/10 hover:text-primary',
                )}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
