'use client';

import { useApi } from './useApi';
import { queryKeys } from './queryKeys';
import { Professor, ProfessorCreationData } from '@/types';
import { useRouter } from 'next/navigation';
import { UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';

const PROFESSOR_ENDPOINT = '/professors';

export const useGetProfessors = () => {
  return useApi<Professor>({
    endpoint: PROFESSOR_ENDPOINT,
    queryKey: queryKeys.professors,
  }).useGetAll();
};

export const useGetProfessor = (id: number) => {
  return useApi<Professor>({
    endpoint: PROFESSOR_ENDPOINT,
    queryKey: queryKeys.professors,
  }).useGetOne(id);
};

export const useCreateProfessor = (
  options?: UseMutationOptions<
    Professor,
    ApiError,
    ProfessorCreationData,
    unknown
  >,
) => {
  const router = useRouter();
  return useApi<Professor, ProfessorCreationData>({
    endpoint: PROFESSOR_ENDPOINT,
    queryKey: queryKeys.professors,
  }).useCreate({
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      router.push('/professors');
    },
  });
};

export const useUpdateProfessor = (id: number) => {
  const router = useRouter();
  const { useUpdate } = useApi<Professor, ProfessorCreationData>({
    endpoint: PROFESSOR_ENDPOINT,
    queryKey: queryKeys.professors,
  });

  const mutation = useUpdate({
    onSuccess: () => {
      router.push(`/professors/${id}`);
    },
  });

  return {
    ...mutation,
    mutate: (data: ProfessorCreationData) => mutation.mutate({ id, data }),
    mutateAsync: (data: ProfessorCreationData) =>
      mutation.mutateAsync({ id, data }),
  };
};
