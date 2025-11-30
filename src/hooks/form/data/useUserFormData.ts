'use client';

import { useState, useEffect } from 'react';
import { type userFormData, type userFormErrors } from '@/lib/schemas';
import {
  useCreateStudent,
  useCreateProfessor,
  useUpdateStudent,
  useUpdateProfessor,
  useCreateUserApp, // Import this
} from '@/hooks';
import { Student, Professor, UserType, UserApp } from '@/types';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | UserApp | null;
};

const INITIAL_STATE: userFormData = {
  name: '',
  email: '',
  phone: '',
  register: '',
};

export function useUserFormData({ user, userType }: UseUserFormProps) {
  const [formData, setFormData] = useState<userFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<userFormErrors>({});

  const isEditMode = !!user;

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  // --- Mutations ---
  const studentCreateMutation = useCreateStudent({
    onSuccess: () => resetForm(),
  });
  const professorCreateMutation = useCreateProfessor({
    onSuccess: () => resetForm(),
  });
  const userAppCreateMutation = useCreateUserApp({
    onSuccess: () => resetForm(),
  });

  const studentUpdateMutation = useUpdateStudent(user?.id || 0);
  const professorUpdateMutation = useUpdateProfessor(user?.id || 0);

  // --- Select Mutation ---
  const mutation = (() => {
    if (isEditMode) {
      // Assuming only Student and Professor updates are handled here for now
      return userType === 'Student'
        ? studentUpdateMutation
        : professorUpdateMutation;
    } else {
      if (userType === 'Student') return studentCreateMutation;
      if (userType === 'Professor') return professorCreateMutation;
      // Handle User and ADMIN creation
      return userAppCreateMutation;
    }
  })();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        // Only set phone/register if they exist on the user object
        phone: 'phone' in user ? user.phone : '',
        register: 'register' in user ? user.register : '',
      });
    } else if (!isEditMode) {
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
