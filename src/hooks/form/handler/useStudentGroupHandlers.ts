'use client';

import { useCallback } from 'react';

type UseStudentGroupHandlersProps = {
  setGroup: React.Dispatch<React.SetStateAction<number[]>>;
};

/**
 * Provides memoized handlers for modifying the student group.
 */
export function useStudentGroupHandlers({
  setGroup,
}: UseStudentGroupHandlersProps) {
  const addStudent = useCallback(
    (studentId: number) => {
      setGroup(prevGroup => {
        if (!prevGroup.includes(studentId)) {
          return [...prevGroup, studentId];
        }
        return prevGroup;
      });
    },
    [setGroup],
  );

  const removeStudent = useCallback(
    (studentId: number) => {
      setGroup(prevGroup => prevGroup.filter(id => id !== studentId));
    },
    [setGroup],
  );

  return {
    addStudent,
    removeStudent,
  };
}
