'use client';

import { Student, Professor, UserType, UserApp } from '@/types';
import { useUserFormData } from './data/useUserFormData';
import { useUserFormHandlers } from './handler/useUserFormHandlers';

type UseUserFormProps = {
  userType: UserType;
  user?: Student | Professor | UserApp | null;
};

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
      userType, // Pass userType here
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
