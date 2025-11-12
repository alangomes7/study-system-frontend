'use client';

import { useState, useEffect, useCallback } from 'react';

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

/**
 * Manages the student group state, syncing with localStorage
 * and providing derived data (isStudentInGroup).
 */
export function useStudentGroupData(classCode: string | null) {
  const [group, setGroup] = useState<number[]>([]);

  // Load from storage on classCode change
  useEffect(() => {
    if (classCode) {
      const storedGroup = getStoredGroup(classCode);
      setGroup(storedGroup);
    } else {
      setGroup([]);
    }
  }, [classCode]);

  // Save to storage on group/classCode change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (classCode) {
      localStorage.setItem(classCode, JSON.stringify(group));
    }
  }, [classCode, group]);

  // Memoized checker function (derived data)
  const isStudentInGroup = useCallback(
    (studentId: number) => {
      return group.includes(studentId);
    },
    [group],
  );

  return {
    group,
    setGroup,
    isStudentInGroup,
  };
}
