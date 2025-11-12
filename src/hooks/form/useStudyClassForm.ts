'use client';

import {
  availableYears,
  useStudyClassFormData,
} from './data/useStudyClassFormData';
import { useStudyClassFormHandlers } from './handler/useStudyClassFormHandlers';

/**
 * Manages state and logic for the study class creation form.
 */
export default function useStudyClassForm() {
  const {
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
  } = useStudyClassFormData();

  const { setFormField, handleSubmit } = useStudyClassFormHandlers({
    formData,
    setFormData,
    setErrors,
    createStudyClass,
  });

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
    availableYears, // Pass the imported constant
    availableSemesters,
    handleSubmit,
  };
}
