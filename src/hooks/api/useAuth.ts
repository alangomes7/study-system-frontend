'use client';

import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/lib/api';
import { TokenResponse } from '@/types';

export const useLogin = (options?: {
  onSuccess?: (data: TokenResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
