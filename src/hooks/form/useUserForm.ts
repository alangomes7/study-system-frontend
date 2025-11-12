'use client';

import { Student, Professor } from '@/types';
import { useUserFormData } from './data/useUserFormData';
import { useUserFormHandlers } from './handler/useUserFormHandlers';

type UserType = 'student' | 'professor';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | null;
};

/**
 * Manages state and logic for the user create/edit form.
 */
export default function useUserForm({ user, userType }: UseUserFormProps) {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    mutation,
    isSubmitting,
    apiError,
  } = useUserFormData({ user, userType });

  const { handleChange, handleMaskedChange, handleSubmit } =
    useUserFormHandlers({
      formData,
      setFormData,
      setErrors,
      mutation,
    });

  return {
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleMaskedChange,
    handleSubmit,
  };
}
