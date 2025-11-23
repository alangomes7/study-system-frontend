import clsx from 'clsx';
import React from 'react';

type Props = {
  tableSearchTerm: string;
  setTableSearchTerm: (term: string) => void;
};

export function StudentTableSearch({
  tableSearchTerm,
  setTableSearchTerm,
}: Props) {
  return (
    <div>
      <label
        htmlFor='table-search'
        className='block text-sm font-medium text-foreground/80 mb-1'
      >
        Student Name
      </label>
      <input
        type='text'
        id='table-search'
        placeholder='Search enrolled students...'
        className={clsx('input max-w-sm', 'input-search')}
        value={tableSearchTerm}
        onChange={e => setTableSearchTerm(e.target.value)}
      />
    </div>
  );
}
