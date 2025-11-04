'use client';

import { useState } from 'react';
import {
  userSchema,
  type userFormData,
  type userFormErrors,
} from '@/lib/schemas/user-schema';
import { useCreateStudent, useCreateProfessor } from '@/lib/api/api_query';
import z from 'zod';

const INITIAL_STATE: userFormData = {
  name: '',
  email: '',
  phone: '',
  register: '',
};

const unmask = (value: string) => value.replace(/\D/g, '');

// -----------------------------
// Hook definition
// -----------------------------
type UserType = 'student' | 'professor';

export function useUserForm(userType: UserType) {
  const [formData, setFormData] = useState<userFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<userFormErrors>({});

  const studentMutation = useCreateStudent({
    onSuccess: () => {
      resetForm();
    },
  });

  const professorMutation = useCreateProfessor({
    onSuccess: () => {
      resetForm();
    },
  });

  const mutation = userType === 'student' ? studentMutation : professorMutation;

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMaskedChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const unmaskedData = {
      ...formData,
      phone: unmask(formData.phone),
      register: unmask(formData.register),
    };

    const validationResult = userSchema.safeParse(unmaskedData);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(
        validationResult.error,
      ).fieldErrors;
      setErrors(flattenedErrors);
      return;
    }

    if (userType === 'student') {
      studentMutation.mutate(validationResult.data);
    } else {
      professorMutation.mutate(validationResult.data);
    }
  };

  // -----------------------------
  // Return API
  // -----------------------------
  return {
    formData,
    errors,
    isSubmitting: mutation.isPending,
    apiError: mutation.error,
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}
