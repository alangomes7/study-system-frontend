'use client';

import { useState, useEffect } from 'react';
import { type userFormData, type userFormErrors } from '@/lib/schemas';
import {
  useCreateStudent,
  //useCreateProfessor,
  useUpdateStudent,
  //useUpdateProfessor,
} from '@/hooks';
import { Student, Professor } from '@/types';

type UserType = 'student' | 'professor';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | null;
};

const INITIAL_STATE: userFormData = {
  name: '',
  email: '',
  phone: '',
  register: '',
};

/**
 * Manages the state, mutations, and side-effects for the user form.
 */
export function useUserFormData({ user }: UseUserFormProps) {
  const [formData, setFormData] = useState<userFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<userFormErrors>({});

  const isEditMode = !!user;

  // Reset form to blank state
  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  // --- Mutations for Creating ---
  const studentCreateMutation = useCreateStudent({
    onSuccess: () => resetForm(),
  });

  // --- Mutations for Updating ---
  const studentUpdateMutation = useUpdateStudent(user?.id || 0);
  //const professorUpdateMutation = useUpdateProfessor(user?.id || 0);

  // --- Select the correct mutation based on original file logic ---
  const mutation = isEditMode ? studentUpdateMutation : studentCreateMutation;

  // --- Populate form if user data changes (for edit mode) ---
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        register: user.register,
      });
    } else if (!isEditMode) {
      // If user is cleared and we're not in edit mode, reset
      resetForm();
    }
  }, [user, isEditMode]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    mutation,
    isSubmitting: mutation.isPending,
    apiError: mutation.error,
  };
}
