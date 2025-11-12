'use client';

import { useCallback } from 'react';
import {
  courseSchema,
  type CourseFormData,
  type CourseFormErrors,
} from '@/lib/schemas/index';
import { z } from 'zod';
import { type UseMutationResult } from '@tanstack/react-query';

type UseCourseFormHandlersProps = {
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<CourseFormErrors>>;
  courseMutation: UseMutationResult<unknown, Error, CourseFormData, unknown>;
};

/**
 * Provides memoized event handlers for the course form.
 */
export function useCourseFormHandlers({
  formData,
  setFormData,
  setErrors,
  courseMutation,
}: UseCourseFormHandlersProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    [setFormData],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const validationResult = courseSchema.safeParse(formData);

      if (!validationResult.success) {
        const flattenedErrors = z.flattenError(
          validationResult.error,
        ).fieldErrors;
        setErrors(flattenedErrors);
        return;
      }

      courseMutation.mutate(validationResult.data);
    },
    [formData, setErrors, courseMutation],
  );

  return {
    handleChange,
    handleSubmit,
  };
}
