'use client';

import { UseMutationResult } from '@tanstack/react-query';
import { TokenResponse } from '@/types';
import { useLoginFormData } from './data/useLoginFormData';
import {
  useLoginFormHandlers,
  LoginFormData,
} from './handler/useLoginFormHandlers';

export default function useLoginForm() {
  const { formData, setFormData, loginMutation, isSubmitting } =
    useLoginFormData();

  const { handleChange, handleSubmit } = useLoginFormHandlers({
    formData,
    setFormData,
    loginMutation: loginMutation as unknown as UseMutationResult<
      TokenResponse,
      Error,
      LoginFormData,
      unknown
    >,
  });

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
}
