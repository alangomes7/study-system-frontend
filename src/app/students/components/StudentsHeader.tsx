'use client';

import { ChevronDown } from 'lucide-react';
import type { useStudentsPageHandlers } from '../hooks/useStudentsPageHandlers';
import type { useStudentsPageData } from '../hooks/useStudentsPageData';
import clsx from 'clsx';

type Props = {
  ui: ReturnType<typeof useStudentsPageData>['ui'];
  handlers: ReturnType<typeof useStudentsPageHandlers>;
};

export default function StudentsHeader({ ui, handlers }: Props) {
  const { searchTerm, paginationLength } = ui;
  const { openDropdown } = handlers.ui;
  const { setOpenDropdown, handleSearchChange, handlePaginationLengthChange } =
    handlers;

  return (
    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6'>
      <h1 className='text-2xl font-bold md:text-3xl text-foreground'>
        Students
      </h1>

      <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
        {/* Pagination Dropdown */}
        <div className='relative w-full sm:w-auto'>
          <button
            type='button'
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'pagination' ? null : 'pagination',
              )
            }
            className='bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center w-full sm:w-36 shadow-sm hover:border-primary transition-colors'
          >
            <span>{paginationLength} per page</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdown === 'pagination'
                  ? 'rotate-180 text-primary'
                  : 'text-muted-foreground'
              }`}
            />
          </button>

          {openDropdown === 'pagination' && (
            <ul className='absolute z-20 mt-1 w-full sm:w-36 bg-card-background border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2'>
              {[5, 10, 20].map(length => (
                <li
                  key={length}
                  onClick={() => handlePaginationLengthChange(length)}
                  className={`px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    paginationLength === length
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {length} per page
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search */}
        <input
          type='text'
          placeholder='Search by student name...'
          className={clsx('input w-full sm:w-auto', 'input-search')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
