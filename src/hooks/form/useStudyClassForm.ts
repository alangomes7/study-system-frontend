'use client';

import { useState, useMemo, useEffect } from 'react';
import { z } from 'zod';
import { useGetCourses, useGetProfessors, useCreateStudyClass } from '@/hooks';
import {
  studyClassSchema,
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
const availableYears = [currentYear, currentYear + 1];
const allSemesters = [1, 2];
const currentYearAvailableSemesters = defaultSemester === 1 ? [1, 2] : [2];

export default function useStudyClassForm() {
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
    // If the selected year changes and the current semester is no longer valid
    // (e.g., changing from 2026 (Sem 1) to 2025 (Sem 2 only))
    // automatically update the semester to the first valid option.
    if (!availableSemesters.includes(formData.semester)) {
      setFormField('semester', availableSemesters[0]);
    }
  }, [formData.year, availableSemesters, formData.semester]);

  // --- Handlers ---
  const setFormField = <K extends keyof StudyClassFormData>(
    field: K,
    value: StudyClassFormData[K],
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // --- Validate with Zod ---
    const validationResult = studyClassSchema.safeParse(formData);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(
        validationResult.error,
      ).fieldErrors;
      setErrors(flattenedErrors as StudyClassFormErrors);
      return;
    }

    // --- On success, call mutation ---
    // No options needed here anymore
    createStudyClass(validationResult.data);
  };

  return {
    formData,
    setFormField,
    errors,
    isSubmitting,
    apiError,
    isLoading,
    courses,
    professors,
    openDropdown,
    setOpenDropdown,
    availableYears,
    availableSemesters,
    handleSubmit,
  };
}
