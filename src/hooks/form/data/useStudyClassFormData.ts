'use client';

import { useState, useMemo, useEffect } from 'react';
import { useGetCourses, useGetProfessors, useCreateStudyClass } from '@/hooks';
import {
  type StudyClassFormErrors,
  type StudyClassFormData,
} from '@/lib/schemas';

// --- Date/Time Constants (now) ---
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const defaultSemester = currentMonth >= 6 ? 2 : 1;

const INITIAL_STATE: StudyClassFormData = {
  year: currentYear,
  semester: defaultSemester,
  courseId: null,
  professorId: null,
};

// --- Available Options ---
export const availableYears = [currentYear, currentYear + 1];
const allSemesters = [1, 2];
const currentYearAvailableSemesters = defaultSemester === 1 ? [1, 2] : [2];

/**
 * Manages all state, data fetching, mutations, and derived
 * data for the study class form.
 */
export function useStudyClassFormData() {
  const [formData, setFormData] = useState<StudyClassFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<StudyClassFormErrors>({});
  const [openDropdown, setOpenDropdown] = useState<
    'course' | 'professor' | 'year' | 'semester' | null
  >(null);

  // --- Data Fetching ---
  const { data: courses = [], isLoading: isLoadingCourses } = useGetCourses();
  const { data: professors = [], isLoading: isLoadingProfessors } =
    useGetProfessors();

  // --- Mutation ---
  const {
    mutate: createStudyClass,
    isPending: isSubmitting,
    error: apiError,
  } = useCreateStudyClass({
    onSuccess: () => {
      setFormData(INITIAL_STATE); // Reset form on success
    },
  });

  const isLoading = isLoadingCourses || isLoadingProfessors;

  // --- Memoized Semester Options ---
  const availableSemesters = useMemo(() => {
    if (formData.year === currentYear) {
      return currentYearAvailableSemesters;
    }
    if (formData.year === currentYear + 1) {
      return allSemesters;
    }
    return [];
  }, [formData.year]);

  // --- Auto-correct Semester on Year change ---
  useEffect(() => {
    // If the selected year changes and the current semester is no longer valid,
    // automatically update the semester to the first valid option.
    if (!availableSemesters.includes(formData.semester)) {
      setFormData(prev => ({
        ...prev,
        semester: availableSemesters[0],
      }));
    }
  }, [formData.year, availableSemesters, formData.semester]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    openDropdown,
    setOpenDropdown,
    courses,
    professors,
    isLoading,
    createStudyClass,
    isSubmitting,
    apiError,
    availableSemesters,
  };
}
