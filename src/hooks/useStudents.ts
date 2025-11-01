'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Manages a student group (an array of student IDs) in local storage,
 * keyed by the **class code**.
 *
 * @param classCode The code of the currently selected class (e.g., "A001")
 * @returns An object with the group, and functions to modify it.
 */
export function useStudentGroup(classCode: string | null) {
  const [group, setGroup] = useState<number[]>([]);

  // Helper to safely read from local storage
  const getStoredGroup = (key: string): number[] => {
    try {
      if (typeof window === 'undefined') return [];

      const item = localStorage.getItem(key);
      if (!item) return [];
      const parsed = JSON.parse(item);

      if (Array.isArray(parsed) && parsed.every(id => typeof id === 'number')) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Failed to parse student group from localStorage', error);
      return [];
    }
  };

  useEffect(() => {
    if (classCode) {
      const storedGroup = getStoredGroup(classCode);
      setGroup(storedGroup);
    } else {
      setGroup([]);
    }
  }, [classCode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (classCode) {
      localStorage.setItem(classCode, JSON.stringify(group));
    }
  }, [classCode, group]);

  // Memoized functions to add/remove students
  const addStudent = useCallback((studentId: number) => {
    setGroup(prevGroup => {
      if (!prevGroup.includes(studentId)) {
        return [...prevGroup, studentId];
      }
      return prevGroup;
    });
  }, []);

  const removeStudent = useCallback((studentId: number) => {
    setGroup(prevGroup => prevGroup.filter(id => id !== studentId));
  }, []);

  // Memoized checker function
  const isStudentInGroup = useCallback(
    (studentId: number) => {
      return group.includes(studentId);
    },
    [group],
  );

  return {
    group,
    addStudent,
    removeStudent,
    isStudentInGroup,
  };
}
