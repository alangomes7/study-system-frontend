'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { useStudentsPageData } from '../hooks/useStudentsPageData';
import type { useStudentsPageHandlers } from '../hooks/useStudentsPageHandlers';
import { Student } from '@/types';

type Props = {
  students: {
    id: number;
    name: string;
    phone: string;
    email: string;
    register: string;
  }[];
  onRowClick: (id: number) => void;
  ui: ReturnType<typeof useStudentsPageData>['ui'];
  handlers: ReturnType<typeof useStudentsPageHandlers>;
};

export default function StudentsTable({
  students,
  onRowClick,
  ui,
  handlers,
}: Props) {
  const { sortConfig } = ui;
  const { handleSort } = handlers;

  const headers: { key: keyof Student; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'E-mail' },
    { key: 'register', label: 'CPF' },
  ];

  const renderSortIcon = (key: keyof Student) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className='inline-block w-4 h-4 ml-1 text-primary' />
    ) : (
      <ChevronDown className='inline-block w-4 h-4 ml-1 text-primary' />
    );
  };

  return (
    <div className='hidden md:block overflow-x-auto bg-card-background rounded-lg border border-border shadow'>
      <table className='min-w-full border-collapse'>
        <thead>
          <tr className='border-b border-border'>
            {headers.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className='py-3 px-4 text-left text-foreground/80 cursor-pointer select-none hover:text-primary transition-colors'
              >
                {label}
                {renderSortIcon(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr
              key={student.id}
              onClick={() => onRowClick(student.id)}
              className='hover:bg-foreground/5 border-b border-border cursor-pointer'
            >
              <td className='py-3 px-4 text-foreground'>{student.id}</td>
              <td className='py-3 px-4 text-foreground'>{student.name}</td>
              <td className='py-3 px-4 text-foreground'>{student.phone}</td>
              <td className='py-3 px-4 text-foreground'>{student.email}</td>
              <td className='py-3 px-4 text-foreground'>{student.register}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
