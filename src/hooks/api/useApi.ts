'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useFetchApi } from './useFetchApi';
import { ApiError } from '@/lib/api/ApiError';

interface UseApiOptions {
  endpoint: string;
  queryKey: string | readonly unknown[];
}

export function useApi<T, TInput = Partial<T>>({
  endpoint,
  queryKey,
}: UseApiOptions) {
  const { findAll, findById, create, update, remove, fetchWithAuth, baseUrl } =
    useFetchApi<T, TInput>(endpoint);

  const queryClient = useQueryClient();
  const baseKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  // -------------------------------------------------
  // GET ALL
  // -------------------------------------------------
  const useGetAll = (
    params?: Record<string, string | number | boolean>,
    options?: Omit<UseQueryOptions<T[], ApiError>, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery({
      queryKey: params ? [...baseKey, params] : baseKey,
      queryFn: () => findAll(params),
      ...options,
    });
  };

  // -------------------------------------------------
  // GET ONE
  // -------------------------------------------------
  const useGetOne = (
    id: number | string | null,
    options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>,
  ) => {
    return useQuery({
      queryKey: [...baseKey, id],
      queryFn: () => findById(id!),
      enabled: !!id,
      ...options,
    });
  };

  // -------------------------------------------------
  // CREATE
  // -------------------------------------------------
  const useCreate = (
    options?: UseMutationOptions<T, ApiError, TInput, unknown>,
  ) => {
    return useMutation({
      mutationFn: create,
      ...options,
      onSuccess: (data, variables, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: baseKey });

        const onSuccess = options?.onSuccess as
          | ((
              data: T,
              variables: TInput,
              context: unknown,
              mutationContext: unknown,
            ) => unknown)
          | undefined;

        onSuccess?.(data, variables, context, mutationContext);
      },
    });
  };

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------
  const useUpdate = (
    options?: UseMutationOptions<
      T,
      ApiError,
      { id: number | string; data: TInput },
      unknown
    >,
  ) => {
    return useMutation({
      mutationFn: ({ id, data }) => update(id, data),
      ...options,
      onSuccess: (data, variables, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: baseKey });
        queryClient.invalidateQueries({
          queryKey: [...baseKey, variables.id],
        });

        const onSuccess = options?.onSuccess as
          | ((
              data: T,
              variables: { id: number | string; data: TInput },
              context: unknown,
              mutationContext: unknown,
            ) => unknown)
          | undefined;

        onSuccess?.(data, variables, context, mutationContext);
      },
    });
  };

  // -------------------------------------------------
  // DELETE
  // -------------------------------------------------
  const useDelete = (
    options?: UseMutationOptions<void, ApiError, number | string, unknown>,
  ) => {
    return useMutation({
      mutationFn: remove,
      ...options,
      onSuccess: (data, id, context, mutationContext) => {
        queryClient.invalidateQueries({ queryKey: baseKey });

        const onSuccess = options?.onSuccess as
          | ((
              data: void,
              variables: number | string,
              context: unknown,
              mutationContext: unknown,
            ) => unknown)
          | undefined;

        onSuccess?.(data, id, context, mutationContext);
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
