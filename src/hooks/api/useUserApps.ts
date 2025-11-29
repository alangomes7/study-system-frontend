'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import * as api from '@/lib/api';
import { UserApp } from '@/types';

/**
 * Hook to fetch all user apps.
 */
export const useGetAllUserApps = () => {
  return useQuery<UserApp[], Error>({
    queryKey: queryKeys.userApps,
    queryFn: api.getAllUserApps,
  });
};

/**
 * Hook to create a new user app.
 */
export const useCreateUserApp = (options?: {
  onSuccess?: (data: UserApp) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<UserApp, Error, Omit<UserApp, 'id'>>({
    mutationFn: api.createUserApp,
    onSuccess: data => {
      // Invalidate the list so it refreshes automatically
      queryClient.invalidateQueries({ queryKey: queryKeys.userApps });

      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: error => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
