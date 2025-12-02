'use client';

import { UserType, Student, Professor, UserApp } from '@/types';
import { useUserFormData } from './data/useUserFormData';
import { useUserFormHandlers } from './handler/useUserFormHandlers';
import { UseMutationResult } from '@tanstack/react-query';

interface UseUserFormProps {
  userType: UserType;
  user?: Student | Professor | UserApp | null;
  onSuccess?: () => void;
}

export default function useUserForm({
  userType,
  user,
  onSuccess,
}: UseUserFormProps) {
  // 1. Get Data & State (uses useApi hooks internally)
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    mutation,
    isSubmitting,
    apiError,
  } = useUserFormData({ userType, user, onSuccess });

  // 2. Get Handlers (handles Zod validation)
  const { handleChange, handleMaskedChange, handleSubmit } =
    useUserFormHandlers({
      formData,
      setFormData,
      setErrors,
      // We cast to the generic mutation type expected by the handler
      mutation: mutation as UseMutationResult<unknown, Error, any, unknown>,
      userType,
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
