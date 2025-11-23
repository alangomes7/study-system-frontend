'use client';

import { SpinLoaderAnimation } from '@/components';
import { useStudentsPageData } from './hooks/useStudentsPageData';
import { useStudentsPageHandlers } from './hooks/useStudentsPageHandlers';
import StudentsCardList from './components/StudentsCardList';
import StudentsEmptyState from './components/StudentsEmptyState';
import StudentsHeader from './components/StudentsHeader';
import StudentsPagination from './components/StudentsPagination';
import StudentsTable from './components/StudentsTable';
import { clsx } from 'clsx';

export default function StudentsClientPage() {
  const { isLoading, error, data, ui } = useStudentsPageData();
  const handlers = useStudentsPageHandlers();

  const { currentStudents, filteredStudents } = data;
  const { currentPage, totalPages } = ui;

  if (isLoading) {
    return (
      <SpinLoaderAnimation
        className={clsx('flex h-60 items-center justify-center')}
      />
    );
  }

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <StudentsHeader ui={ui} handlers={handlers} />

      {filteredStudents.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <StudentsTable
            students={currentStudents}
            onRowClick={handlers.handleRowClick}
            ui={ui}
            handlers={handlers}
          />

          {/* Mobile Card View */}
          <StudentsCardList
            students={currentStudents}
            ui={ui}
            handlers={handlers}
          />

          <StudentsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPaginate={handlers.paginate}
          />
        </>
      ) : (
        <StudentsEmptyState />
      )}
    </div>
  );
}
