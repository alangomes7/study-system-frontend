'use client';

import { useState } from 'react';
import {
  type CourseFormData,
  type CourseFormErrors,
} from '@/lib/schemas/index';
import { useCreateCourse } from '@/hooks';

const INITIAL_STATE: CourseFormData = {
  name: '',
  description: '',
};

/**
 * Manages the state, validation errors, and mutation for the course form.
 */
export function useCourseFormData() {
  const [formData, setFormData] = useState<CourseFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<CourseFormErrors>({});

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  const courseMutation = useCreateCourse({
    onSuccess: () => {
      resetForm();
      alert('Course created successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to create course:', error);
    },
  });

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    courseMutation,
    isSubmitting: courseMutation.isPending,
    apiError: courseMutation.error,
  };
}
