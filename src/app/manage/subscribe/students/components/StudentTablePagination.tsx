'use client';

import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Student, DropdownType } from '../types';

type Props = {
  openDropdown: DropdownType;
  setOpenDropdown: React.Dispatch<React.SetStateAction<DropdownType>>;
  paginationLength: number;
  handlePaginationLengthChange: (length: number) => void;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  sortedEnrolledStudents: Student[];
};

export function StudentTablePagination({
  openDropdown,
  setOpenDropdown,
  paginationLength,
  handlePaginationLengthChange,
  currentPage,
  paginate,
  sortedEnrolledStudents,
}: Props) {
  const totalPages = Math.ceil(
    sortedEnrolledStudents.length / paginationLength,
  );

  return (
    <div className='flex items-center justify-between'>
      {/* Per Page Dropdown */}
      <div className='relative'>
        <button
          type='button'
          onClick={() =>
            setOpenDropdown(openDropdown === 'pagination' ? null : 'pagination')
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
          <ul className='absolute z-20 bottom-full mb-1 w-full sm:w-36 bg-card-background border border-border rounded-lg shadow-lg overflow-hidden'>
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

      {/* Page Buttons */}
      <div className='flex justify-center'>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
        >
          &lt;
        </button>
        {Array.from(
          {
            length: totalPages,
          },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`btn mx-1 ${
                currentPage === i + 1
                  ? 'btn-primary'
                  : 'border border-border bg-card-background hover:bg-foreground/5'
              }`}
            >
              {i + 1}
            </button>
          ),
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='btn border border-border bg-card-background hover:bg-foreground/5 disabled:opacity-50'
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
