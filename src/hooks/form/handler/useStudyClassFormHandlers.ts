'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import {
  studyClassSchema,
  type StudyClassFormErrors,
  type StudyClassFormData,
} from '@/lib/schemas';
import { type UseMutationResult } from '@tanstack/react-query';

type UseStudyClassFormHandlersProps = {
  formData: StudyClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<StudyClassFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<StudyClassFormErrors>>;
  createStudyClass: UseMutationResult<
    unknown,
    Error,
    StudyClassFormData,
    unknown
  >;
};

/**
 * Provides memoized handlers for the study class form.
 */
export function useStudyClassFormHandlers({
  formData,
  setFormData,
  setErrors,
  createStudyClass,
}: UseStudyClassFormHandlersProps) {
  const setFormField = useCallback(
    <K extends keyof StudyClassFormData>(
      field: K,
      value: StudyClassFormData[K],
    ) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormData],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({}); // Clear previous errors // --- Validate with Zod ---

      const validationResult = studyClassSchema.safeParse(formData);

      if (!validationResult.success) {
        const flattenedErrors = z.flattenError(
          validationResult.error,
        ).fieldErrors;
        setErrors(flattenedErrors as StudyClassFormErrors);
        return;
      }

      createStudyClass.mutate(validationResult.data);
    },
    [formData, setErrors, createStudyClass],
  );

  return {
    setFormField,
    handleSubmit,
  };
}
