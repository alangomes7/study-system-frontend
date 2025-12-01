'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useFetchApi } from './useFetchApi';

interface UseApiOptions {
  endpoint: string;
  queryKey: string | readonly unknown[];
}

/**
 * A generic hook that combines the fetch wrapper with React Query.
 * Provides standardized hooks for CRUD operations.
 *
 * @param endpoint - The API endpoint (e.g., '/students')
 * @param queryKey - The base query key for caching (e.g., 'students' or ['students'])
 */
export function useApi<T, TInput = Partial<T>>({
  endpoint,
  queryKey,
}: UseApiOptions) {
  const { findAll, findById, create, update, remove, fetchWithAuth, baseUrl } =
    useFetchApi<T, TInput>(endpoint);
  const queryClient = useQueryClient();
  const baseKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  /**
   * Hook to fetch all items.
   */
  const useGetAll = (
    params?: Record<string, string | number | boolean>,
    options?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery({
      queryKey: params ? [...baseKey, params] : baseKey,
      queryFn: () => findAll(params),
      ...options,
    });
  };

  /**
   * Hook to fetch a single item by ID.
   */
  const useGetOne = (
    id: number | string | null,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery({
      queryKey: [...baseKey, id],
      queryFn: () => findById(id!),
      enabled: !!id,
      ...options,
    });
  };

  /**
   * Hook to create a new item.
   */
  const useCreate = (
    options?: UseMutationOptions<T, Error, TInput, unknown>,
  ) => {
    return useMutation({
      mutationFn: create,
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: baseKey });

        // Cast to specific function type to avoid 'any'
        const onSuccess = options?.onSuccess as
          | ((data: T, variables: TInput, context: unknown) => unknown)
          | undefined;

        onSuccess?.(data, variables, context);
      },
    });
  };

  /**
   * Hook to update an item.
   * Expects variables to be an object containing `id` and `data`.
   */
  const useUpdate = (
    options?: UseMutationOptions<
      T,
      Error,
      { id: number | string; data: TInput },
      unknown
    >,
  ) => {
    return useMutation({
      mutationFn: ({ id, data }) => update(id, data),
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        queryClient.invalidateQueries({
          queryKey: [...baseKey, variables.id],
        });

        const onSuccess = options?.onSuccess as
          | ((
              data: T,
              variables: { id: number | string; data: TInput },
              context: unknown,
            ) => unknown)
          | undefined;

        onSuccess?.(data, variables, context);
      },
    });
  };

  /**
   * Hook to delete an item.
   */
  const useDelete = (
    options?: UseMutationOptions<void, Error, number | string, unknown>,
  ) => {
    return useMutation({
      mutationFn: remove,
      ...options,
      onSuccess: (data, id, context) => {
        queryClient.invalidateQueries({ queryKey: baseKey });

        const onSuccess = options?.onSuccess as
          | ((
              data: void,
              variables: number | string,
              context: unknown,
            ) => unknown)
          | undefined;

        onSuccess?.(data, id, context);
      },
    });
  };

  return {
    useGetAll,
    useGetOne,
    useCreate,
    useUpdate,
    useDelete,
    raw: {
      findAll,
      findById,
      create,
      update,
      remove,
      fetchWithAuth,
      baseUrl,
    },
  };
}
