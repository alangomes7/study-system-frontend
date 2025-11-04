'use client';

import { useState } from 'react';
import {
  courseSchema,
  type CourseFormData,
  type CourseFormErrors,
} from '@/lib/schemas/course-schema';
import { useCreateCourse } from '@/lib/api/api_query';
import { z } from 'zod';

const INITIAL_STATE: CourseFormData = {
  name: '',
  description: '',
};

// -----------------------------
// Hook definition
// -----------------------------
export function useCourseForm() {
  const [formData, setFormData] = useState<CourseFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<CourseFormErrors>({});

  const courseMutation = useCreateCourse({
    onSuccess: () => {
      resetForm();
      alert('Course created successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to create course:', error);
    },
  });

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  // -----------------------------
  // Return API
  // -----------------------------
  return {
    formData,
    errors,
    isSubmitting: courseMutation.isPending,
    apiError: courseMutation.error,
    handleChange,
    handleSubmit,
  };
}
