'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { useStudentsPageData } from '../hooks/useStudentsPageData';
import type { useStudentsPageHandlers } from '../hooks/useStudentsPageHandlers';
import { Student } from '@/types/student';

type Props = {
  students: {
    id: number;
    name: string;
    phone: string;
    email: string;
    register: string;
  }[];
  ui: ReturnType<typeof useStudentsPageData>['ui'];
  handlers: ReturnType<typeof useStudentsPageHandlers>;
};

export default function StudentsCardList({ students, ui, handlers }: Props) {
  const { sortConfig } = ui;
  const { handleSort } = handlers;

  const fields: { key: keyof Student; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'register', label: 'CPF' },
  ];

  const renderSortIcon = (key: keyof Student) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className='inline w-4 h-4 ml-1 text-primary' />
    ) : (
      <ChevronDown className='inline w-4 h-4 ml-1 text-primary' />
    );
  };

  return (
    <div className='md:hidden'>
      {/* Sorting controls for mobile */}
      <div className='flex items-center justify-between mb-4 px-2'>
        {fields.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`flex items-center text-sm font-medium px-2 py-1 rounded-md transition-colors ${
              sortConfig.key === key
                ? 'text-primary bg-primary/10'
                : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
            }`}
          >
            {label}
            {renderSortIcon(key)}
          </button>
        ))}
      </div>

      {/* Student cards */}
      <div className='grid grid-cols-1 gap-4'>
        {students.map(student => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className='card hover:shadow-md transition-shadow'
          >
            <div className='font-bold text-lg text-primary'>{student.name}</div>
            <div className='text-sm text-foreground/80 mt-2 space-y-1'>
              <p>
                <strong>ID:</strong> {student.id}
              </p>
              <p>
                <strong>Phone:</strong> {student.phone}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>CPF:</strong> {student.register}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
