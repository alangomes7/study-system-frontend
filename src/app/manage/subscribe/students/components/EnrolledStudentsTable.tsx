'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { DotsAnimation } from '@/components';
import React from 'react';
import { SortConfig } from '../types';
import { DropdownType } from '@/stores/types';
import { StudentTableSearch } from './StudentTableSearch';
import { StudentTablePagination } from './StudentTablePagination';
import { useRouter } from 'next/navigation';
import { Student } from '@/types';

interface StudyClass {
  year: number;
  semester: number;
  courseName: string;
  professorName: string | null;
}

interface ComponentHandlers {
  requestSort: (
    key: keyof Student,
    sortConfig: SortConfig<Student> | null,
  ) => void;
  handlePaginationLengthChange: (length: number) => void;
  paginate: (pageNumber: number) => void;
}

interface ComponentComputed {
  tableSearchTerm: string;
  sortConfig: SortConfig<Student> | null;
  sortedEnrolledStudents: Student[];
  paginationLength: number;
  currentPage: number;
  openDropdown: DropdownType;
  isLoadingEnrolledStudents: boolean;
  setTableSearchTerm: (term: string) => void;
  setOpenDropdown: (dropdown: DropdownType) => void;
}

type Props = {
  studyClass: StudyClass | null;
  enrolledStudents: Student[];
  handlers: ComponentHandlers;
  computed: ComponentComputed;
};

export function EnrolledStudentsTable({
  studyClass,
  enrolledStudents,
  handlers,
  computed,
}: Props) {
  const router = useRouter();

  const { requestSort, handlePaginationLengthChange, paginate } = handlers;

  const {
    tableSearchTerm,
    sortConfig,
    sortedEnrolledStudents,
    paginationLength,
    currentPage,
    openDropdown,
    isLoadingEnrolledStudents,
    setTableSearchTerm,
    setOpenDropdown,
  } = computed;

  const getSortIcon = (key: keyof Student) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className='w-4 h-4' />
    ) : (
      <ArrowDown className='w-4 h-4' />
    );
  };

  const handleRowClick = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  if (isLoadingEnrolledStudents) {
    return (
      <div className='text-center'>
        <DotsAnimation />
      </div>
    );
  }

  if (!studyClass) {
    return (
      <div className='card text-center p-6'>
        <p className='text-foreground/70'>
          Please select a study class to see enrolled students.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <StudentTableSearch
        tableSearchTerm={tableSearchTerm}
        setTableSearchTerm={setTableSearchTerm}
      />

      {/* Class Info */}
      <div className='card p-4 text-sm text-foreground/80 space-x-4'>
        <span>
          <strong>Year:</strong> {studyClass.year}
        </span>
        <span>
          <strong>Semester:</strong> {studyClass.semester}
        </span>
        <span>
          <strong>Course:</strong> {studyClass.courseName}
        </span>
        <span>
          <strong>Professor:</strong>{' '}
          {studyClass.professorName || 'Not Assigned'}
        </span>
      </div>

      {/* Table */}
      {enrolledStudents.length > 0 ? (
        <div className='space-y-4'>
          <div className='overflow-x-auto bg-card-background rounded-lg border border-border shadow'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr className='border-b border-border items-center'>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Name', key: 'name' },
                    { label: 'E-mail', key: 'email' },
                    { label: 'Register (CPF)', key: 'register' },
                    { label: 'Enrolled At', key: 'subscriptionDate' },
                  ].map(header => (
                    <th
                      key={header.key}
                      className='py-3 px-4 text-center text-foreground/80 cursor-pointer hover:text-foreground'
                      onClick={() =>
                        requestSort(header.key as keyof Student, sortConfig)
                      }
                    >
                      <span className='flex items-center justify-center gap-2'>
                        {header.label}
                        {getSortIcon(header.key as keyof Student)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map(student => (
                  <tr
                    key={student.id}
                    className='hover:bg-foreground/5 border-b border-border cursor-pointer'
                    onClick={() => handleRowClick(student.id)}
                  >
                    <td className='py-3 px-4 text-foreground text-center'>
                      {student.id}
                    </td>
                    <td className='py-3 px-4 text-foreground text-center'>
                      {student.name}
                    </td>
                    <td className='py-3 px-4 text-foreground text-center'>
                      {student.email}
                    </td>
                    <td className='py-3 px-4 text-foreground text-center'>
                      {student.register}
                    </td>
                    <td className='py-3 px-4 text-foreground text-center'>
                      {student.subscriptionDate
                        ? new Date(student.subscriptionDate).toLocaleString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <StudentTablePagination
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            paginationLength={paginationLength}
            handlePaginationLengthChange={handlePaginationLengthChange}
            currentPage={currentPage}
            paginate={paginate}
            sortedEnrolledStudents={sortedEnrolledStudents}
          />
        </div>
      ) : (
        <div className='card text-center p-6'>
          <p className='text-foreground/70'>No students found.</p>
        </div>
      )}
    </div>
  );
}
