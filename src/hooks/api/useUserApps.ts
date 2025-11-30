'use client';

import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { UserApp } from '@/types';

const ENDPOINT = '/userApp';

export const useGetAllUserApps = () => {
  return useApi<UserApp>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.userApps,
  }).useGetAll();
};

export const useCreateUserApp = (options?: {
  onSuccess?: (data: UserApp) => void;
  onError?: (error: Error) => void;
}) => {
  return useApi<UserApp, Omit<UserApp, 'id'>>({
    endpoint: ENDPOINT,
    queryKey: queryKeys.userApps,
  }).useCreate(options);
};
