'use client';

import { useCourseFormData } from './data/useCourseFormData';
import { useCourseFormHandlers } from './handler/useCourseFormHandlers';

/**
 * Manages the state and logic for creating a new course.
 */
export default function useCourseForm() {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    courseMutation,
    isSubmitting,
    apiError,
  } = useCourseFormData();

  const { handleChange, handleSubmit } = useCourseFormHandlers({
    formData,
    setFormData,
    setErrors,
    courseMutation,
  });

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit,
  };
}
