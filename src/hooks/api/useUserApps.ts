'use client';

import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { UserApp } from '@/types';
import { ApiError } from '@/lib/api';
import { UseMutationOptions } from '@tanstack/react-query';

const ENDPOINT = '/userApp';

export const useGetAllUserApps = () => {
  return useApi<UserApp>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.userApps,
  }).useGetAll();
};

export const useCreateUserApp = (
  options?: UseMutationOptions<UserApp, ApiError, Omit<UserApp, 'id'>>,
) => {
  return useApi<UserApp, Omit<UserApp, 'id'>>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.userApps,
  }).useCreate(options);
};
