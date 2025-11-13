'use client';

import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useGetProfessors } from '@/hooks';
import { SpinLoader } from '@/components';
import { useSubscribeProfessorStore } from '@/stores';

export function ProfessorDropdown() {
  const {
    selectedStudyClassId,
    selectedProfessorId,
    openDropdown,
    professorSearchTerm,
    isSubmitting,
    selectProfessor,
    setDropdown,
    setProfessorSearchTerm,
  } = useSubscribeProfessorStore();

  const {
    data: allProfessors = [],
    isLoading: isLoadingAll,
    error: allProfessorsError,
  } = useGetProfessors();

  const filteredProfessorsForDropdown = useMemo(
    () =>
      allProfessors.filter(professor =>
        professor.name
          .toLowerCase()
          .includes(professorSearchTerm.toLowerCase()),
      ),
    [allProfessors, professorSearchTerm],
  ); //

  const selectedProfessorName =
    allProfessors.find(prof => prof.id === selectedProfessorId)?.name ||
    '-- Select a professor --';

  const isDisabled = isSubmitting || !selectedStudyClassId || isLoadingAll;

  return (
    <div className='relative'>
      <label
        htmlFor='professor-button'
        className='block text-sm font-medium text-foreground/80 mb-1'
      >
        Professor
      </label>
      <button
        type='button'
        id='professor-button'
        disabled={isDisabled}
        onClick={() =>
          setDropdown(openDropdown === 'professor' ? null : 'professor')
        }
        className='w-full bg-card-background border border-border text-foreground rounded-md px-3 py-2 flex justify-between items-center shadow-sm hover:border-primary transition-colors disabled:opacity-50'
      >
        <span
          className={clsx(
            selectedProfessorId
              ? 'text-foreground'
              : 'text-muted-foreground italic',
            'flex items-center',
          )}
        >
          {isLoadingAll ? (
            <SpinLoader className='w-4 h-4 mr-2' />
          ) : (
            selectedProfessorName
          )}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            openDropdown === 'professor'
              ? 'rotate-180 text-primary'
              : 'text-muted-foreground',
          )}
        />
      </button>

      {openDropdown === 'professor' && (
        <div className='absolute z-20 mt-1 w-full bg-card-background border border-border rounded-lg shadow-lg'>
          <input
            type='text'
            placeholder='Search professors...'
            className='input w-full rounded-b-none border-x-0 border-t-0'
            value={professorSearchTerm}
            onChange={e => setProfessorSearchTerm(e.target.value)}
          />
          <ul className='max-h-60 overflow-y-auto'>
            {filteredProfessorsForDropdown.length > 0 ? (
              filteredProfessorsForDropdown.map(professor => (
                <li
                  key={professor.id}
                  onClick={() => selectProfessor(professor.id)}
                  className={clsx(
                    'px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors',
                    selectedProfessorId === professor.id
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-foreground',
                  )}
                >
                  {professor.name}
                </li>
              ))
            ) : (
              <li className='px-3 py-2 text-muted-foreground italic'>
                {isLoadingAll ? 'Loading...' : 'No professors found.'}
              </li>
            )}
          </ul>
        </div>
      )}
      {allProfessorsError && (
        <p className='text-red-500 text-sm mt-1'>
          {allProfessorsError.message}
        </p>
      )}
    </div>
  );
}
