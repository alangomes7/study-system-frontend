'use client';

import { UseMutationOptions } from '@tanstack/react-query';
import { useApi } from './useApi';
import { TokenResponse } from '@/types';
import { ApiError, LoginCredentials } from '@/lib/api';

export const useLogin = (
  options?: UseMutationOptions<TokenResponse, ApiError, LoginCredentials>,
) => {
  const { useCreate } = useApi<TokenResponse, LoginCredentials>({
    endpoint: '/authentication/login',
    queryKey: ['login'],
  });

  return useCreate(options);
};
