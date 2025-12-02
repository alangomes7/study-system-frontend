'use client';

import { useState, useEffect } from 'react';
import { type userFormData, type userFormErrors } from '@/lib/schemas';
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
};

// Add password to initial state
const INITIAL_STATE: userFormData = {
  name: '',
  email: '',
  phone: '',
  register: '',
  password: '',
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
  // We use the existing API hooks.
  // Note: These hooks might handle redirection internally (check useStudents.ts).

  const studentCreateMutation = useCreateStudent({
    onSuccess: () => resetForm(),
  });

  const professorCreateMutation = useCreateProfessor({
    onSuccess: () => resetForm(),
  });

  const userAppCreateMutation = useCreateUserApp({
    onSuccess: () => resetForm(),
  });

  // Safe ID access: If user is null, we pass 0, but the mutation won't be called in that case anyway.
  // We cast the ID to number because the hooks expect numbers, though your types might be flexible.
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
