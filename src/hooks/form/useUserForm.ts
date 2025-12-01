'use client';

import { UseMutationResult } from '@tanstack/react-query';
import { Student, Professor, UserType, UserApp } from '@/types';
import { useUserFormData } from './data/useUserFormData';
import { useUserFormHandlers } from './handler/useUserFormHandlers';
import { UserMutationVariables } from './types';

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
      mutation: mutation as unknown as UseMutationResult<
        unknown,
        Error,
        UserMutationVariables
      >,
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
