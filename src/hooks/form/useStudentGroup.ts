'use client';

import { useStudentGroupData } from './data/useStudentGroupData';
import { useStudentGroupHandlers } from './handler/useStudentGroupHandlers';

/**
 * Manages a student group (an array of student IDs) in local storage,
 * keyed by the **class code**.
 *
 * @param classCode The code of the currently selected class (e.g., "A001")
 * @returns An object with the group, and functions to modify it.
 */
export default function useStudentGroup(classCode: string | null) {
  const { group, setGroup, isStudentInGroup } = useStudentGroupData(classCode);
  const { addStudent, removeStudent } = useStudentGroupHandlers({ setGroup });

  return {
    group,
    addStudent,
    removeStudent,
    isStudentInGroup,
  };
}
