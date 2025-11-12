'use client';

import { useState, useEffect } from 'react';
import {
  userSchema,
  type userFormData,
  type userFormErrors,
} from '@/lib/schemas';
import {
  useCreateStudent,
  useCreateProfessor,
  useUpdateStudent,
  //useUpdateProfessor,
} from '@/hooks';
import z from 'zod';
import { Student, Professor } from '@/types';

type UserType = 'student' | 'professor';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | null;
};

const unmask = (value: string) => value.replace(/\D/g, '');

// -----------------------------
// Hook definition
// -----------------------------
export default function useUserForm({ user, userType }: UseUserFormProps) {
  const [formData, setFormData] = useState<userFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    register: user?.register || '',
  });
  const [errors, setErrors] = useState<userFormErrors>({});

  const isEditMode = !!user;

  // --- Mutations for Creating ---
  const studentCreateMutation = useCreateStudent({
    onSuccess: () => resetForm(),
  });
  const professorCreateMutation = useCreateProfessor({
    onSuccess: () => resetForm(),
  });

  // --- Mutations for Updating ---
  // We need the user's ID to update
  const studentUpdateMutation = useUpdateStudent(user?.id || 0);
  //const professorUpdateMutation = useUpdateProfessor(user?.id || 0);

  // --- Select the correct mutation ---
  const mutation = isEditMode ? studentUpdateMutation : studentCreateMutation;
  // let mutation;
  // if (userType === 'student') {
  //   mutation = isEditMode ? studentUpdateMutation : studentCreateMutation;
  // } else {
  //   mutation = isEditMode ? professorUpdateMutation : professorCreateMutation;
  // }

  // Reset form to blank state
  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', register: '' });
    setErrors({});
  };

  // --- Populate form if user data changes (for edit mode) ---
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        register: user.register,
      });
    }
  }, [user]);

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

    // Call the selected mutation
    mutation.mutate(validationResult.data);
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
