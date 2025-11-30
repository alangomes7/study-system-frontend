'use client';

import { useCallback } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { TokenResponse } from '@/types';

export interface LoginFormData {
  email: string;
  password: string;
}

type UseLoginFormHandlersProps = {
  formData: LoginFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoginFormData>>;

  loginMutation: UseMutationResult<
    TokenResponse,
    Error,
    LoginFormData,
    unknown
  >;
};

export function useLoginFormHandlers({
  formData,
  setFormData,
  loginMutation,
}: UseLoginFormHandlersProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    [setFormData],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    },
    [formData, loginMutation],
  );

  return {
    handleChange,
    handleSubmit,
  };
}
