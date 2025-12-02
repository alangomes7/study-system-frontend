'use client';

import { useState, useEffect } from 'react';
import { type UserFormData, type UserFormErrors } from '@/lib/schemas';
import { Student, Professor, UserType, UserApp } from '@/types';
import { useCreateStudent, useUpdateStudent } from '@/hooks/api/useStudents';
import {
  useCreateProfessor,
  useUpdateProfessor,
} from '@/hooks/api/useProfessors';
import { useCreateUserApp } from '@/hooks/api/useUserApps';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | UserApp | null;
  onSuccess?: () => void;
};

// Add password to initial state
const INITIAL_STATE: UserFormData = {
  name: '',
  email: '',
  phone: '',
  register: '',
  password: '',
};

export function useUserFormData({
  user,
  userType,
  onSuccess,
}: UseUserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<UserFormErrors>({});

  const isEditMode = !!user;

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  // --- Mutations ---
  const studentCreateMutation = useCreateStudent({
    onSuccess: () => {
      resetForm();
      onSuccess?.();
    },
  });

  const professorCreateMutation = useCreateProfessor({
    onSuccess: () => {
      resetForm();
      onSuccess?.();
    },
  });

  const userAppCreateMutation = useCreateUserApp({
    onSuccess: () => {
      resetForm();
      onSuccess?.();
    },
  });

  // Safe ID access
  const studentUpdateMutation = useUpdateStudent(
    user?.id ? Number(user.id) : 0,
  );

  const professorUpdateMutation = useUpdateProfessor(
    user?.id ? Number(user.id) : 0,
  );

  // --- Select Mutation ---
  const mutation = (() => {
    if (isEditMode) {
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
        phone: 'phone' in user ? user.phone : '',
        register: 'register' in user ? user.register : '',
        password: '',
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
